"""Feature 10: Mini Project Workspace — Service layer."""

import uuid
from datetime import datetime, timezone

from sqlalchemy.orm import Session, selectinload

from app.core.exceptions import AppError
from app.db.models.task import Task, TaskStatus
from app.db.models.team import Team, TeamMember, TeamMemberStatus, TeamStatus
from app.db.models.workspace import Workspace, WorkspaceMember, WorkspaceMemberStatus, WorkspaceStatus
from app.schemas.workspace import (
    WorkspaceProgressRead,
    WorkspaceTaskCreate,
)


# ---------------------------------------------------------------------------
# Domain errors
# ---------------------------------------------------------------------------


class WorkspaceNotFoundError(AppError):
    status_code = 404
    detail = "Workspace not found."


class WorkspaceAccessDeniedError(AppError):
    status_code = 403
    detail = "You do not have access to this workspace."


class WorkspaceAlreadyExistsError(AppError):
    status_code = 409
    detail = "A workspace already exists for this problem."


class TeamNotReadyError(AppError):
    status_code = 400
    detail = "A PROPOSED team must exist for this problem before creating a workspace."


class TaskNotFoundError(AppError):
    status_code = 404
    detail = "Task not found."


class TaskStateError(AppError):
    status_code = 409


# ---------------------------------------------------------------------------
# Service
# ---------------------------------------------------------------------------


class WorkspaceService:
    def __init__(self, db: Session) -> None:
        self.db = db

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _get_workspace_or_404(self, workspace_id: uuid.UUID) -> Workspace:
        ws = (
            self.db.query(Workspace)
            .options(selectinload(Workspace.members), selectinload(Workspace.tasks))
            .filter(Workspace.id == workspace_id)
            .first()
        )
        if not ws:
            raise WorkspaceNotFoundError()
        return ws

    def _authorize_workspace(self, ws: Workspace, user_id: uuid.UUID) -> None:
        """Workspace is accessible to the problem owner or any workspace member."""
        from app.db.models.problem import Problem

        problem = self.db.query(Problem).filter(Problem.id == ws.problem_id).first()
        if problem and problem.user_id == user_id:
            return
        is_member = any(m.user_id == user_id for m in ws.members)
        if not is_member:
            raise WorkspaceAccessDeniedError()

    def _get_task_or_404(self, task_id: uuid.UUID) -> Task:
        task = self.db.query(Task).filter(Task.id == task_id).first()
        if not task:
            raise TaskNotFoundError()
        return task

    def _authorize_task(self, task: Task, user_id: uuid.UUID) -> None:
        """Task authorization — reuse workspace authorization."""
        if task.workspace_id:
            ws = (
                self.db.query(Workspace)
                .options(selectinload(Workspace.members))
                .filter(Workspace.id == task.workspace_id)
                .first()
            )
            if ws:
                self._authorize_workspace(ws, user_id)
                return
        # Task has no workspace — check problem ownership
        from app.db.models.problem import Problem

        problem = self.db.query(Problem).filter(Problem.id == task.problem_id).first()
        if not problem or problem.user_id != user_id:
            raise WorkspaceAccessDeniedError()

    def _count_tasks(self, workspace_id: uuid.UUID) -> dict[str, int]:
        tasks = self.db.query(Task).filter(Task.workspace_id == workspace_id).all()
        counts: dict[str, int] = {
            "total": len(tasks),
            "todo": 0,
            "in_progress": 0,
            "done": 0,
            "blocked": 0,
            "cancelled": 0,
        }
        for t in tasks:
            if t.status == TaskStatus.TODO:
                counts["todo"] += 1
            elif t.status == TaskStatus.IN_PROGRESS:
                counts["in_progress"] += 1
            elif t.status == TaskStatus.DONE:
                counts["done"] += 1
            elif t.status == TaskStatus.BLOCKED:
                counts["blocked"] += 1
            elif t.status == TaskStatus.CANCELLED:
                counts["cancelled"] += 1
        return counts

    # ------------------------------------------------------------------
    # Create workspace
    # ------------------------------------------------------------------

    def create_workspace(self, problem_id: uuid.UUID, user_id: uuid.UUID) -> Workspace:
        from app.db.models.problem import Problem

        problem = self.db.query(Problem).filter(Problem.id == problem_id).first()
        if not problem:
            raise AppError("Problem not found.")
        if problem.user_id != user_id:
            raise WorkspaceAccessDeniedError()

        existing = (
            self.db.query(Workspace).filter(Workspace.problem_id == problem_id).first()
        )
        if existing:
            raise WorkspaceAlreadyExistsError()

        # Find the PROPOSED (or most recent) team for this problem
        team = (
            self.db.query(Team)
            .options(selectinload(Team.members))
            .filter(Team.problem_id == problem_id, Team.status == TeamStatus.PROPOSED)
            .order_by(Team.created_at.desc())
            .first()
        )
        if not team:
            raise TeamNotReadyError()

        ws = Workspace(
            problem_id=problem_id,
            team_id=team.id,
            title=f"Workspace — {problem.title}",
            description=f"Execution workspace for problem: {problem.title}",
            status=WorkspaceStatus.PLANNING,
            progress=0.0,
        )
        self.db.add(ws)
        self.db.flush()

        # Mirror team members as workspace members
        for tm in team.members:
            if tm.member_status != TeamMemberStatus.PROPOSED:
                continue
            wm = WorkspaceMember(
                workspace_id=ws.id,
                user_id=tm.user_id,
                team_member_id=tm.id,
                role=tm.suggested_role or "Member",
                status=WorkspaceMemberStatus.ACTIVE,
            )
            self.db.add(wm)

        self.db.commit()
        self.db.refresh(ws)
        # Reload with members
        return self._get_workspace_or_404(ws.id)

    # ------------------------------------------------------------------
    # Read workspace
    # ------------------------------------------------------------------

    def get_workspace(self, workspace_id: uuid.UUID, user_id: uuid.UUID) -> Workspace:
        ws = self._get_workspace_or_404(workspace_id)
        self._authorize_workspace(ws, user_id)
        return ws

    def get_workspace_members(
        self, workspace_id: uuid.UUID, user_id: uuid.UUID
    ) -> list[WorkspaceMember]:
        ws = self._get_workspace_or_404(workspace_id)
        self._authorize_workspace(ws, user_id)
        return ws.members

    # ------------------------------------------------------------------
    # Task CRUD within workspace
    # ------------------------------------------------------------------

    def list_workspace_tasks(
        self, workspace_id: uuid.UUID, user_id: uuid.UUID
    ) -> list[Task]:
        ws = self._get_workspace_or_404(workspace_id)
        self._authorize_workspace(ws, user_id)
        return self.db.query(Task).filter(Task.workspace_id == workspace_id).all()

    def create_workspace_task(
        self,
        workspace_id: uuid.UUID,
        user_id: uuid.UUID,
        payload: WorkspaceTaskCreate,
    ) -> Task:
        ws = self._get_workspace_or_404(workspace_id)
        self._authorize_workspace(ws, user_id)

        if ws.status == WorkspaceStatus.COMPLETED:
            raise TaskStateError("Cannot add tasks to a completed workspace.")
        if ws.status == WorkspaceStatus.ARCHIVED:
            raise TaskStateError("Cannot add tasks to an archived workspace.")

        task = Task(
            workspace_id=workspace_id,
            problem_id=ws.problem_id,
            team_id=ws.team_id,
            title=payload.title,
            description=payload.description,
            task_type=payload.task_type,
            priority=payload.priority,
            status=TaskStatus.TODO,
            estimated_effort=payload.estimated_effort,
            due_at=payload.due_at,
            assigned_member_id=payload.assigned_member_id,
            created_by=user_id,
        )
        self.db.add(task)

        # Transition workspace to IN_PROGRESS if still PLANNING
        if ws.status == WorkspaceStatus.PLANNING:
            ws.status = WorkspaceStatus.IN_PROGRESS
            ws.started_at = ws.started_at or datetime.now(timezone.utc)

        self.db.commit()
        self.db.refresh(task)
        return task

    # ------------------------------------------------------------------
    # Task state machine
    # ------------------------------------------------------------------

    def get_task(self, task_id: uuid.UUID, user_id: uuid.UUID) -> Task:
        task = self._get_task_or_404(task_id)
        self._authorize_task(task, user_id)
        return task

    def update_task(
        self, task_id: uuid.UUID, user_id: uuid.UUID, payload: WorkspaceTaskCreate
    ) -> Task:
        task = self._get_task_or_404(task_id)
        self._authorize_task(task, user_id)

        task.title = payload.title
        task.description = payload.description
        task.task_type = payload.task_type
        task.priority = payload.priority
        task.estimated_effort = payload.estimated_effort
        task.due_at = payload.due_at
        task.assigned_member_id = payload.assigned_member_id

        self.db.commit()
        self.db.refresh(task)
        return task

    def start_task(self, task_id: uuid.UUID, user_id: uuid.UUID) -> Task:
        task = self._get_task_or_404(task_id)
        self._authorize_task(task, user_id)

        if task.status != TaskStatus.TODO:
            raise TaskStateError(
                f"Task must be in TODO status to start. Current: {task.status.value}"
            )
        task.status = TaskStatus.IN_PROGRESS
        self.db.commit()
        self.db.refresh(task)
        self._recalculate_progress(task.workspace_id)
        return task

    def complete_task(self, task_id: uuid.UUID, user_id: uuid.UUID) -> Task:
        task = self._get_task_or_404(task_id)
        self._authorize_task(task, user_id)

        if task.status not in (TaskStatus.IN_PROGRESS, TaskStatus.BLOCKED):
            raise TaskStateError(
                f"Task must be IN_PROGRESS or BLOCKED to complete. Current: {task.status.value}"
            )
        task.status = TaskStatus.DONE
        task.completed_at = datetime.now(timezone.utc)
        self.db.commit()
        self.db.refresh(task)
        self._recalculate_progress(task.workspace_id)
        return task

    def block_task(self, task_id: uuid.UUID, user_id: uuid.UUID) -> Task:
        task = self._get_task_or_404(task_id)
        self._authorize_task(task, user_id)

        if task.status not in (TaskStatus.TODO, TaskStatus.IN_PROGRESS):
            raise TaskStateError(
                f"Task must be TODO or IN_PROGRESS to block. Current: {task.status.value}"
            )
        task.status = TaskStatus.BLOCKED
        self.db.commit()
        self.db.refresh(task)
        self._recalculate_progress(task.workspace_id)
        return task

    # ------------------------------------------------------------------
    # Progress
    # ------------------------------------------------------------------

    def _recalculate_progress(self, workspace_id: uuid.UUID | None) -> None:
        """Recalculate and persist workspace progress after a task state change."""
        if not workspace_id:
            return
        ws = self.db.query(Workspace).filter(Workspace.id == workspace_id).first()
        if not ws:
            return
        counts = self._count_tasks(workspace_id)
        total = counts["total"]
        if total == 0:
            ws.progress = 0.0
        else:
            ws.progress = round(counts["done"] / total * 100, 2)

        # Auto-complete workspace when all tasks are DONE
        active = total - counts["done"] - counts["cancelled"]
        if total > 0 and active == 0 and counts["done"] > 0:
            ws.status = WorkspaceStatus.COMPLETED
            ws.completed_at = ws.completed_at or datetime.now(timezone.utc)

        self.db.commit()

    def get_workspace_progress(
        self, workspace_id: uuid.UUID, user_id: uuid.UUID
    ) -> WorkspaceProgressRead:
        ws = self._get_workspace_or_404(workspace_id)
        self._authorize_workspace(ws, user_id)
        counts = self._count_tasks(workspace_id)
        total = counts["total"]
        done = counts["done"]
        return WorkspaceProgressRead(
            workspace_id=workspace_id,
            total_tasks=total,
            todo=counts["todo"],
            in_progress=counts["in_progress"],
            done=done,
            blocked=counts["blocked"],
            cancelled=counts["cancelled"],
            progress_percent=round(done / total * 100, 2) if total else 0.0,
        )
