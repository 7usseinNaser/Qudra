"""Feature 10: Mini Project Workspace — Comprehensive test suite (22 tests + 1 E2E).

Tests cover:
  - Workspace creation (happy path, duplicate prevention, missing team guard)
  - Workspace retrieval and authorization
  - Workspace member listing
  - Task CRUD within workspace
  - Task state machine: start, complete, block (valid + invalid transitions)
  - Progress calculation
  - Auto-completion of workspace when all tasks done
  - Authorization enforcement (403 for non-members)
  - End-to-end integration test: Features 1–10 full pipeline
"""

import os
import uuid

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

# ── helpers ──────────────────────────────────────────────────────────────────


def _register_and_login(client: TestClient, email: str, password: str = "Test1234!") -> str:
    """Register a user and return the Bearer token."""
    client.post("/api/auth/register", json={"email": email, "password": password, "full_name": "Test User"})
    resp = client.post("/api/auth/login", data={"username": email, "password": password})
    assert resp.status_code == 200, f"Login failed: {resp.text}"
    return resp.json()["access_token"]


def _auth(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


def _create_capability(client: TestClient, token: str, name: str) -> str:
    resp = client.post("/api/capabilities", json={"name": name, "category": "technical"}, headers=_auth(token))
    assert resp.status_code == 201
    return resp.json()["id"]


def _create_problem(client: TestClient, token: str, cap_id: str) -> str:
    payload = {
        "title": "Workspace Test Problem",
        "description": "A comprehensive software problem for workspace testing that requires technical capability and development.",
        "domain": "Technology",
    }
    resp = client.post("/api/problems", json=payload, headers=_auth(token))
    assert resp.status_code == 201
    prob_id = resp.json()["id"]
    analyze_resp = client.post(f"/api/problems/{prob_id}/analyze", headers=_auth(token))
    assert analyze_resp.status_code == 200, f"Analyze failed: {analyze_resp.text}"
    return prob_id


def _compose_team(client: TestClient, token: str, problem_id: str) -> str:
    resp = client.post(f"/api/problems/{problem_id}/compose-team", headers=_auth(token))
    assert resp.status_code == 200
    return resp.json()["team_id"]


# ── fixtures ──────────────────────────────────────────────────────────────────


@pytest.fixture()
def owner_token(client: TestClient) -> str:
    return _register_and_login(client, f"owner_{uuid.uuid4().hex[:8]}@test.com")


@pytest.fixture()
def other_token(client: TestClient) -> str:
    return _register_and_login(client, f"other_{uuid.uuid4().hex[:8]}@test.com")


@pytest.fixture()
def cap_id(client: TestClient, owner_token: str) -> str:
    return _create_capability(client, owner_token, f"cap_{uuid.uuid4().hex[:6]}")


@pytest.fixture()
def problem_id(client: TestClient, owner_token: str, cap_id: str) -> str:
    return _create_problem(client, owner_token, cap_id)


@pytest.fixture()
def team_id(client: TestClient, owner_token: str, problem_id: str) -> str:
    return _compose_team(client, owner_token, problem_id)


@pytest.fixture()
def workspace_id(client: TestClient, owner_token: str, problem_id: str, team_id: str) -> str:
    resp = client.post(f"/api/problems/{problem_id}/workspace", headers=_auth(owner_token))
    assert resp.status_code == 201, f"Create workspace failed: {resp.text}"
    return resp.json()["id"]


# ═══════════════════════════════════════════════════════════════════════════════
# TEST 1 — Create workspace successfully
# ═══════════════════════════════════════════════════════════════════════════════
def test_create_workspace(client: TestClient, owner_token: str, problem_id: str, team_id: str):
    resp = client.post(f"/api/problems/{problem_id}/workspace", headers=_auth(owner_token))
    assert resp.status_code == 201
    data = resp.json()
    assert data["problem_id"] == problem_id
    assert data["team_id"] == team_id
    assert data["status"] == "PLANNING"
    assert data["progress"] == 0.0


# ═══════════════════════════════════════════════════════════════════════════════
# TEST 2 — Duplicate workspace returns 409
# ═══════════════════════════════════════════════════════════════════════════════
def test_create_workspace_duplicate(client: TestClient, owner_token: str, problem_id: str, team_id: str, workspace_id: str):
    resp = client.post(f"/api/problems/{problem_id}/workspace", headers=_auth(owner_token))
    assert resp.status_code == 409


# ═══════════════════════════════════════════════════════════════════════════════
# TEST 3 — Create workspace without team returns 400
# ═══════════════════════════════════════════════════════════════════════════════
def test_create_workspace_without_team(client: TestClient, owner_token: str, cap_id: str):
    p_id = _create_problem(client, owner_token, cap_id)
    resp = client.post(f"/api/problems/{p_id}/workspace", headers=_auth(owner_token))
    assert resp.status_code == 400


# ═══════════════════════════════════════════════════════════════════════════════
# TEST 4 — Get workspace
# ═══════════════════════════════════════════════════════════════════════════════
def test_get_workspace(client: TestClient, owner_token: str, workspace_id: str):
    resp = client.get(f"/api/workspaces/{workspace_id}", headers=_auth(owner_token))
    assert resp.status_code == 200
    assert resp.json()["id"] == workspace_id


# ═══════════════════════════════════════════════════════════════════════════════
# TEST 5 — Get workspace not found returns 404
# ═══════════════════════════════════════════════════════════════════════════════
def test_get_workspace_not_found(client: TestClient, owner_token: str):
    fake_id = str(uuid.uuid4())
    resp = client.get(f"/api/workspaces/{fake_id}", headers=_auth(owner_token))
    assert resp.status_code == 404


# ═══════════════════════════════════════════════════════════════════════════════
# TEST 6 — Non-owner non-member gets 403
# ═══════════════════════════════════════════════════════════════════════════════
def test_get_workspace_forbidden(client: TestClient, other_token: str, workspace_id: str):
    resp = client.get(f"/api/workspaces/{workspace_id}", headers=_auth(other_token))
    assert resp.status_code == 403


# ═══════════════════════════════════════════════════════════════════════════════
# TEST 7 — List workspace members
# ═══════════════════════════════════════════════════════════════════════════════
def test_list_workspace_members(client: TestClient, owner_token: str, workspace_id: str):
    resp = client.get(f"/api/workspaces/{workspace_id}/members", headers=_auth(owner_token))
    assert resp.status_code == 200
    members = resp.json()
    assert isinstance(members, list)
    # The team may have 0 members (empty DB team) — just check structure
    for m in members:
        assert "user_id" in m
        assert "role" in m
        assert m["status"] == "ACTIVE"


# ═══════════════════════════════════════════════════════════════════════════════
# TEST 8 — List workspace tasks (initially empty)
# ═══════════════════════════════════════════════════════════════════════════════
def test_list_workspace_tasks_empty(client: TestClient, owner_token: str, workspace_id: str):
    resp = client.get(f"/api/workspaces/{workspace_id}/tasks", headers=_auth(owner_token))
    assert resp.status_code == 200
    assert resp.json() == []


# ═══════════════════════════════════════════════════════════════════════════════
# TEST 9 — Create task in workspace
# ═══════════════════════════════════════════════════════════════════════════════
def test_create_workspace_task(client: TestClient, owner_token: str, workspace_id: str):
    payload = {
        "title": "Design database schema",
        "description": "ERD and table definitions",
        "priority": "HIGH",
        "estimated_effort": "3 days",
    }
    resp = client.post(f"/api/workspaces/{workspace_id}/tasks", json=payload, headers=_auth(owner_token))
    assert resp.status_code == 201
    data = resp.json()
    assert data["title"] == "Design database schema"
    assert data["status"] == "TODO"
    assert data["workspace_id"] == workspace_id
    assert data["priority"] == "HIGH"


# ═══════════════════════════════════════════════════════════════════════════════
# TEST 10 — Creating a task transitions workspace to IN_PROGRESS
# ═══════════════════════════════════════════════════════════════════════════════
def test_workspace_transitions_to_in_progress_on_task_create(client: TestClient, owner_token: str, workspace_id: str):
    payload = {"title": "First task", "priority": "MEDIUM"}
    client.post(f"/api/workspaces/{workspace_id}/tasks", json=payload, headers=_auth(owner_token))
    ws_resp = client.get(f"/api/workspaces/{workspace_id}", headers=_auth(owner_token))
    assert ws_resp.json()["status"] == "IN_PROGRESS"


# ═══════════════════════════════════════════════════════════════════════════════
# TEST 11 — Start task (TODO → IN_PROGRESS)
# ═══════════════════════════════════════════════════════════════════════════════
def test_start_task(client: TestClient, owner_token: str, workspace_id: str):
    task_resp = client.post(
        f"/api/workspaces/{workspace_id}/tasks",
        json={"title": "Start me", "priority": "MEDIUM"},
        headers=_auth(owner_token),
    )
    task_id = task_resp.json()["id"]
    resp = client.post(f"/api/tasks/{task_id}/start", headers=_auth(owner_token))
    assert resp.status_code == 200
    assert resp.json()["status"] == "IN_PROGRESS"


# ═══════════════════════════════════════════════════════════════════════════════
# TEST 12 — Cannot start a task that is not TODO
# ═══════════════════════════════════════════════════════════════════════════════
def test_start_task_invalid_state(client: TestClient, owner_token: str, workspace_id: str):
    task_resp = client.post(
        f"/api/workspaces/{workspace_id}/tasks",
        json={"title": "Already started", "priority": "LOW"},
        headers=_auth(owner_token),
    )
    task_id = task_resp.json()["id"]
    client.post(f"/api/tasks/{task_id}/start", headers=_auth(owner_token))
    # Try to start again
    resp = client.post(f"/api/tasks/{task_id}/start", headers=_auth(owner_token))
    assert resp.status_code == 409


# ═══════════════════════════════════════════════════════════════════════════════
# TEST 13 — Complete task (IN_PROGRESS → DONE)
# ═══════════════════════════════════════════════════════════════════════════════
def test_complete_task(client: TestClient, owner_token: str, workspace_id: str):
    task_resp = client.post(
        f"/api/workspaces/{workspace_id}/tasks",
        json={"title": "Complete me", "priority": "MEDIUM"},
        headers=_auth(owner_token),
    )
    task_id = task_resp.json()["id"]
    client.post(f"/api/tasks/{task_id}/start", headers=_auth(owner_token))
    resp = client.post(f"/api/tasks/{task_id}/complete", headers=_auth(owner_token))
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "DONE"
    assert data["completed_at"] is not None


# ═══════════════════════════════════════════════════════════════════════════════
# TEST 14 — Cannot complete a TODO task directly
# ═══════════════════════════════════════════════════════════════════════════════
def test_complete_todo_task_invalid(client: TestClient, owner_token: str, workspace_id: str):
    task_resp = client.post(
        f"/api/workspaces/{workspace_id}/tasks",
        json={"title": "Cannot complete directly", "priority": "LOW"},
        headers=_auth(owner_token),
    )
    task_id = task_resp.json()["id"]
    resp = client.post(f"/api/tasks/{task_id}/complete", headers=_auth(owner_token))
    assert resp.status_code == 409


# ═══════════════════════════════════════════════════════════════════════════════
# TEST 15 — Block task (TODO → BLOCKED)
# ═══════════════════════════════════════════════════════════════════════════════
def test_block_task_from_todo(client: TestClient, owner_token: str, workspace_id: str):
    task_resp = client.post(
        f"/api/workspaces/{workspace_id}/tasks",
        json={"title": "Block me", "priority": "HIGH"},
        headers=_auth(owner_token),
    )
    task_id = task_resp.json()["id"]
    resp = client.post(f"/api/tasks/{task_id}/block", headers=_auth(owner_token))
    assert resp.status_code == 200
    assert resp.json()["status"] == "BLOCKED"


# ═══════════════════════════════════════════════════════════════════════════════
# TEST 16 — Block task (IN_PROGRESS → BLOCKED)
# ═══════════════════════════════════════════════════════════════════════════════
def test_block_task_from_in_progress(client: TestClient, owner_token: str, workspace_id: str):
    task_resp = client.post(
        f"/api/workspaces/{workspace_id}/tasks",
        json={"title": "Block from in progress", "priority": "MEDIUM"},
        headers=_auth(owner_token),
    )
    task_id = task_resp.json()["id"]
    client.post(f"/api/tasks/{task_id}/start", headers=_auth(owner_token))
    resp = client.post(f"/api/tasks/{task_id}/block", headers=_auth(owner_token))
    assert resp.status_code == 200
    assert resp.json()["status"] == "BLOCKED"


# ═══════════════════════════════════════════════════════════════════════════════
# TEST 17 — Complete a BLOCKED task
# ═══════════════════════════════════════════════════════════════════════════════
def test_complete_blocked_task(client: TestClient, owner_token: str, workspace_id: str):
    task_resp = client.post(
        f"/api/workspaces/{workspace_id}/tasks",
        json={"title": "Unblock and complete", "priority": "HIGH"},
        headers=_auth(owner_token),
    )
    task_id = task_resp.json()["id"]
    client.post(f"/api/tasks/{task_id}/block", headers=_auth(owner_token))
    resp = client.post(f"/api/tasks/{task_id}/complete", headers=_auth(owner_token))
    assert resp.status_code == 200
    assert resp.json()["status"] == "DONE"


# ═══════════════════════════════════════════════════════════════════════════════
# TEST 18 — Progress calculation
# ═══════════════════════════════════════════════════════════════════════════════
def test_workspace_progress(client: TestClient, owner_token: str, workspace_id: str):
    # Create 2 tasks
    t1 = client.post(
        f"/api/workspaces/{workspace_id}/tasks",
        json={"title": "Task A", "priority": "MEDIUM"},
        headers=_auth(owner_token),
    ).json()["id"]
    t2 = client.post(
        f"/api/workspaces/{workspace_id}/tasks",
        json={"title": "Task B", "priority": "LOW"},
        headers=_auth(owner_token),
    ).json()["id"]

    # Complete task 1
    client.post(f"/api/tasks/{t1}/start", headers=_auth(owner_token))
    client.post(f"/api/tasks/{t1}/complete", headers=_auth(owner_token))

    resp = client.get(f"/api/workspaces/{workspace_id}/progress", headers=_auth(owner_token))
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_tasks"] == 2
    assert data["done"] == 1
    assert data["todo"] == 1
    assert data["progress_percent"] == 50.0


# ═══════════════════════════════════════════════════════════════════════════════
# TEST 19 — Workspace auto-completes when all tasks are DONE
# ═══════════════════════════════════════════════════════════════════════════════
def test_workspace_auto_complete(client: TestClient, owner_token: str, workspace_id: str):
    t1 = client.post(
        f"/api/workspaces/{workspace_id}/tasks",
        json={"title": "Only task", "priority": "HIGH"},
        headers=_auth(owner_token),
    ).json()["id"]

    client.post(f"/api/tasks/{t1}/start", headers=_auth(owner_token))
    client.post(f"/api/tasks/{t1}/complete", headers=_auth(owner_token))

    ws = client.get(f"/api/workspaces/{workspace_id}", headers=_auth(owner_token)).json()
    assert ws["status"] == "COMPLETED"
    assert ws["progress"] == 100.0
    assert ws["completed_at"] is not None


# ═══════════════════════════════════════════════════════════════════════════════
# TEST 20 — Cannot create task in completed workspace
# ═══════════════════════════════════════════════════════════════════════════════
def test_create_task_in_completed_workspace(client: TestClient, owner_token: str, workspace_id: str):
    t1 = client.post(
        f"/api/workspaces/{workspace_id}/tasks",
        json={"title": "Sole task", "priority": "MEDIUM"},
        headers=_auth(owner_token),
    ).json()["id"]
    client.post(f"/api/tasks/{t1}/start", headers=_auth(owner_token))
    client.post(f"/api/tasks/{t1}/complete", headers=_auth(owner_token))

    resp = client.post(
        f"/api/workspaces/{workspace_id}/tasks",
        json={"title": "New task after completion", "priority": "LOW"},
        headers=_auth(owner_token),
    )
    assert resp.status_code == 409


# ═══════════════════════════════════════════════════════════════════════════════
# TEST 21 — Unauthenticated request returns 401
# ═══════════════════════════════════════════════════════════════════════════════
def test_unauthenticated_access(client: TestClient, workspace_id: str):
    resp = client.get(f"/api/workspaces/{workspace_id}")
    assert resp.status_code == 401


# ═══════════════════════════════════════════════════════════════════════════════
# TEST 22 — Task detail endpoint
# ═══════════════════════════════════════════════════════════════════════════════
def test_get_task_detail(client: TestClient, owner_token: str, workspace_id: str):
    task_resp = client.post(
        f"/api/workspaces/{workspace_id}/tasks",
        json={"title": "Detailed task", "estimated_effort": "2h", "priority": "CRITICAL"},
        headers=_auth(owner_token),
    )
    task_id = task_resp.json()["id"]
    resp = client.get(f"/api/tasks/{task_id}/detail", headers=_auth(owner_token))
    assert resp.status_code == 200
    data = resp.json()
    assert data["id"] == task_id
    assert data["estimated_effort"] == "2h"
    assert data["priority"] == "CRITICAL"


# ═══════════════════════════════════════════════════════════════════════════════
# END-TO-END — Features 1–10 full pipeline
# ═══════════════════════════════════════════════════════════════════════════════
def test_end_to_end_f1_through_f10(client: TestClient):
    """
    Exercises the complete QUDRA pipeline:

    F1  — Register + login
    F2  — Create capability
    F3  — Create project with capability tag
    F4  — Submit evidence for capability
    F5  — Capability score present on user capability
    F6  — Create problem + skill gap is computable
    F7  — Run matching
    F8  — Compose team
    F9  — Create task + allocate
    F10 — Create workspace → add tasks → run state machine → verify progress
    """
    email = f"e2e_{uuid.uuid4().hex[:8]}@test.com"
    password = "E2EPass1!"

    # F1 — Auth
    token = _register_and_login(client, email, password)
    headers = _auth(token)

    # F2 — Capability
    cap_resp = client.post(
        "/api/capabilities",
        json={"name": f"e2e_cap_{uuid.uuid4().hex[:6]}", "category": "technical"},
        headers=headers,
    )
    assert cap_resp.status_code == 201
    cap_id = cap_resp.json()["id"]

    # F3 — Project
    proj_resp = client.post(
        "/api/projects",
        json={"title": "E2E Project", "description": "Full pipeline test", "status": "COMPLETED"},
        headers=headers,
    )
    assert proj_resp.status_code == 201
    proj_id = proj_resp.json()["id"]

    # Tag capability on project
    tag_resp = client.post(
        f"/api/projects/{proj_id}/capabilities",
        json={"capability_id": cap_id, "proficiency_level": "ADVANCED", "is_primary": True},
        headers=headers,
    )
    assert tag_resp.status_code == 201

    # F4 — Evidence
    ev_resp = client.post(
        "/api/evidence",
        json={
            "project_id": proj_id,
            "capability_id": cap_id,
            "type": "PROJECT",
            "title": "E2E evidence",
            "description": "Test evidence for full pipeline",
            "strength": 80.0,
        },
        headers=headers,
    )
    assert ev_resp.status_code == 201

    # F5 — Capability score (trigger recalculation)
    score_resp = client.post(f"/api/users/me/capabilities/{cap_id}/recalculate", headers=headers)
    assert score_resp.status_code in (200, 201)

    # F6 — Problem
    prob_resp = client.post(
        "/api/problems",
        json={
            "title": "E2E Problem",
            "description": "A comprehensive real world problem that requires the e2e capability to execute.",
            "domain": "Technology",
        },
        headers=headers,
    )
    assert prob_resp.status_code == 201
    prob_id = prob_resp.json()["id"]

    analyze_resp = client.post(f"/api/problems/{prob_id}/analyze", headers=headers)
    assert analyze_resp.status_code == 200

    # Skill gap
    gap_resp = client.get(f"/api/problems/{prob_id}/skill-gap", headers=headers)
    assert gap_resp.status_code == 200

    # F7 — Matching
    match_resp = client.get(f"/api/problems/{prob_id}/matches", headers=headers)
    assert match_resp.status_code == 200

    # F8 — Compose team
    team_resp = client.post(f"/api/problems/{prob_id}/compose-team", headers=headers)
    assert team_resp.status_code == 200
    team_id = team_resp.json()["team_id"]
    assert team_id is not None

    # F9 — Task + allocation
    task_resp = client.post(
        "/api/tasks",
        json={
            "problem_id": prob_id,
            "title": "E2E Task",
            "priority": "HIGH",
            "complexity": "MEDIUM",
            "required_capabilities": [],
        },
        headers=headers,
    )
    assert task_resp.status_code == 201
    task_id = task_resp.json()["id"]

    alloc_resp = client.post(f"/api/tasks/{task_id}/allocation", headers=headers)
    assert alloc_resp.status_code in (200, 201)

    # F10 — Create workspace
    ws_resp = client.post(f"/api/problems/{prob_id}/workspace", headers=headers)
    assert ws_resp.status_code == 201
    ws_id = ws_resp.json()["id"]
    assert ws_resp.json()["status"] == "PLANNING"

    # Add tasks
    wt1 = client.post(
        f"/api/workspaces/{ws_id}/tasks",
        json={"title": "Workspace Task 1", "priority": "HIGH", "estimated_effort": "2 days"},
        headers=headers,
    )
    assert wt1.status_code == 201
    wt1_id = wt1.json()["id"]

    wt2 = client.post(
        f"/api/workspaces/{ws_id}/tasks",
        json={"title": "Workspace Task 2", "priority": "MEDIUM"},
        headers=headers,
    )
    assert wt2.status_code == 201
    wt2_id = wt2.json()["id"]

    # Check workspace is IN_PROGRESS
    ws_detail = client.get(f"/api/workspaces/{ws_id}", headers=headers).json()
    assert ws_detail["status"] == "IN_PROGRESS"

    # State machine on task 1
    client.post(f"/api/tasks/{wt1_id}/start", headers=headers)
    client.post(f"/api/tasks/{wt1_id}/complete", headers=headers)

    # State machine on task 2
    client.post(f"/api/tasks/{wt2_id}/start", headers=headers)
    client.post(f"/api/tasks/{wt2_id}/complete", headers=headers)

    # Progress
    prog_resp = client.get(f"/api/workspaces/{ws_id}/progress", headers=headers)
    assert prog_resp.status_code == 200
    prog = prog_resp.json()
    assert prog["done"] == 2
    assert prog["progress_percent"] == 100.0

    # Workspace auto-completed
    ws_final = client.get(f"/api/workspaces/{ws_id}", headers=headers).json()
    assert ws_final["status"] == "COMPLETED"
    assert ws_final["completed_at"] is not None

    print("\n✅ End-to-end test (Features 1–10) PASSED")
