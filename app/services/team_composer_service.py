"""Feature 8: Team Composer Service.

Composes the smallest effective complementary team to cover required capabilities
for an analyzed problem, consuming candidate results strictly from Feature 7 (MatchingService).
"""

import uuid
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.exceptions import (
    ProblemAccessDeniedError,
    ProblemNotAnalyzedError,
    ProblemNotFoundError,
)
from app.db.models.capability import Capability
from app.db.models.problem import Problem, ProblemCapability, ProblemStatus
from app.db.models.team import (
    Team,
    TeamCapabilityCoverage,
    TeamMember,
    TeamMemberStatus,
    TeamStatus,
)
from app.repositories.problem_repository import ProblemRepository
from app.schemas.matching import MatchCandidateRead, MatchesResponse
from app.schemas.team import (
    ComposeTeamRequest,
    TeamCapabilityCoverageRead,
    TeamCompositionResponse,
    TeamExplanation,
    TeamGapRead,
    TeamMemberRead,
)
from app.services.matching_service import MatchingService
from app.services.skill_gap_service import (
    IMPORTANCE_WEIGHTS,
    SKILL_GAP_THRESHOLDS,
    SkillGapService,
)

# Centralized configuration weights for team composition objective
TEAM_COMPOSITION_WEIGHTS: dict[str, float] = {
    "coverage": 0.45,
    "evidence": 0.25,
    "relevance": 0.20,
    "complementarity": 0.10,
}

DEFAULT_MAX_TEAM_SIZE: int = 5
TEAM_CANDIDATE_POOL_SIZE: int = 20


class TeamComposerService:
    """Selects and optimizes an evidence-based team to solve a specific problem."""

    def __init__(
        self,
        db: Session,
        weights: dict[str, float] | None = None,
    ):
        self.db = db
        self.weights = weights or TEAM_COMPOSITION_WEIGHTS
        self.problem_repo = ProblemRepository(db)
        self.matching_service = MatchingService(db)
        self.skill_gap_service = SkillGapService(db)

    # ── Main Entrypoint ──────────────────────────────────────────────────

    def compose_team(
        self,
        problem_id: uuid.UUID,
        request_user_id: uuid.UUID,
        config: ComposeTeamRequest | None = None,
    ) -> TeamCompositionResponse:
        """Composes, optimizes, and persists an effective team for the given problem."""
        max_size = config.max_team_size if config else DEFAULT_MAX_TEAM_SIZE

        # 1. Validate problem and permissions
        problem = self.problem_repo.get_by_id(problem_id)
        if not problem:
            raise ProblemNotFoundError()
        if problem.user_id != request_user_id:
            raise ProblemAccessDeniedError()
        if problem.status != ProblemStatus.ANALYZED or not problem.analysis:
            raise ProblemNotAnalyzedError()

        # 2. Extract and deduplicate required capabilities
        required_caps = self._get_required_capabilities(problem)
        if not required_caps:
            return self._handle_empty_requirements(problem)

        # 3. Get candidate pool from Feature 7 (MatchingService)
        matches_response = self.matching_service.find_matches(problem_id)
        candidates = matches_response.matches[:TEAM_CANDIDATE_POOL_SIZE]

        if not candidates:
            return self._handle_no_candidates(problem, required_caps)

        # 4. Run greedy set-cover selection
        selected_candidates = self._greedy_selection(
            candidates=candidates,
            required_caps=required_caps,
            max_team_size=max_size,
        )

        # 5. Run optimization pass (remove redundant members)
        optimized_candidates = self._optimize_team(
            selected=selected_candidates,
            required_caps=required_caps,
        )

        # 6. Compute team coverage and metrics
        coverage_data = self._calculate_team_coverage(
            team_candidates=optimized_candidates,
            required_caps=required_caps,
        )

        team_score = self._calculate_team_score(
            team_candidates=optimized_candidates,
            coverage_score=coverage_data["overall_coverage_score"],
            required_caps=required_caps,
        )

        # 7. Assign suggested roles and build explanations
        members_read = self._build_members_read(
            team_candidates=optimized_candidates,
            required_caps=required_caps,
        )

        explanation = self._build_team_explanation(
            problem_title=problem.title,
            team_score=team_score,
            coverage_score=coverage_data["overall_coverage_score"],
            members=members_read,
            all_candidates=candidates,
            gaps=coverage_data["gaps"],
        )

        # 8. Persist Team, TeamMember, and TeamCapabilityCoverage
        team = self._persist_team(
            problem_id=problem.id,
            team_score=team_score,
            coverage_score=coverage_data["overall_coverage_score"],
            explanation=explanation.model_dump(),
            members=members_read,
            coverage_items=coverage_data["coverage_items"],
        )

        return TeamCompositionResponse(
            team_id=team.id,
            problem_id=problem.id,
            problem_title=problem.title,
            team_score=team_score,
            coverage_score=coverage_data["overall_coverage_score"],
            team_size=len(members_read),
            status=TeamStatus.PROPOSED,
            members=members_read,
            capability_coverage=coverage_data["coverage_items"],
            gaps=coverage_data["gaps"],
            explanation=explanation,
            created_at=team.created_at,
        )

    # ── Helper: Extract Capabilities ─────────────────────────────────────

    def _get_required_capabilities(
        self, problem: Problem
    ) -> list[ProblemCapability]:
        """Extracts deduplicated required capabilities, keeping highest importance."""
        required_caps_map: dict[uuid.UUID, ProblemCapability] = {}
        for pc in problem.capabilities:
            existing = required_caps_map.get(pc.capability_id)
            if not existing or pc.importance > existing.importance:
                required_caps_map[pc.capability_id] = pc
        return list(required_caps_map.values())

    # ── Greedy Selection ─────────────────────────────────────────────────

    def _greedy_selection(
        self,
        candidates: list[MatchCandidateRead],
        required_caps: list[ProblemCapability],
        max_team_size: int,
    ) -> list[MatchCandidateRead]:
        """Selects members iteratively based on marginal contribution until covered or max size."""
        selected: list[MatchCandidateRead] = []
        covered_scores: dict[uuid.UUID, float] = {pc.capability_id: 0.0 for pc in required_caps}
        covered_threshold = SKILL_GAP_THRESHOLDS["covered"]

        while len(selected) < max_team_size:
            # Check if all required capabilities are already COVERED (>= 70)
            if all(covered_scores[pc.capability_id] >= covered_threshold for pc in required_caps):
                break

            best_candidate: MatchCandidateRead | None = None
            best_contribution: float = -1.0

            for candidate in candidates:
                if candidate in selected:
                    continue

                contribution = self._calculate_candidate_marginal_contribution(
                    candidate=candidate,
                    current_coverage=covered_scores,
                    required_caps=required_caps,
                )

                if contribution > best_contribution:
                    best_contribution = contribution
                    best_candidate = candidate

            # If no candidate provides meaningful marginal contribution (> 0.5), stop
            if best_candidate is None or best_contribution <= 0.5:
                break

            selected.append(best_candidate)
            # Update current coverage
            cand_scores = {b.capability_id: b.user_score for b in best_candidate.capability_breakdown}
            for pc in required_caps:
                covered_scores[pc.capability_id] = max(
                    covered_scores[pc.capability_id],
                    cand_scores.get(pc.capability_id, 0.0),
                )

        return selected

    def _calculate_candidate_marginal_contribution(
        self,
        candidate: MatchCandidateRead,
        current_coverage: dict[uuid.UUID, float],
        required_caps: list[ProblemCapability],
    ) -> float:
        """Calculates marginal contribution of adding a candidate to the current team."""
        cand_scores = {b.capability_id: b.user_score for b in candidate.capability_breakdown}

        total_gain = 0.0
        total_possible = 0.0
        complementarity_gain = 0.0
        covered_threshold = SKILL_GAP_THRESHOLDS["covered"]

        for pc in required_caps:
            req_level = self.skill_gap_service.normalize_required_level(pc.required_level, pc.importance)
            weight = IMPORTANCE_WEIGHTS.get(req_level, 0.7)
            total_possible += 100.0 * weight

            current_score = current_coverage.get(pc.capability_id, 0.0)
            user_score = cand_scores.get(pc.capability_id, 0.0)

            # Marginal coverage gain
            gain = max(0.0, user_score - current_score)
            total_gain += gain * weight

            # Complementarity: bonus for improving capabilities that are currently gaps/partial
            if current_score < covered_threshold and user_score > current_score:
                complementarity_gain += (user_score - current_score) * weight

        marginal_coverage_score = (total_gain / total_possible * 100.0) if total_possible > 0 else 0.0
        complementarity_score = (complementarity_gain / total_possible * 100.0) if total_possible > 0 else 0.0

        # Weighted composite marginal contribution
        contribution = (
            marginal_coverage_score * 0.50
            + complementarity_score * 0.20
            + candidate.capability_score * 0.15
            + candidate.project_relevance_score * 0.15
        )
        return contribution

    # ── Optimization Pass (Pruning) ──────────────────────────────────────

    def _optimize_team(
        self,
        selected: list[MatchCandidateRead],
        required_caps: list[ProblemCapability],
    ) -> list[MatchCandidateRead]:
        """Removes members whose absence does not reduce overall capability coverage."""
        if len(selected) <= 1:
            return selected

        optimized = list(selected)
        i = 0
        while i < len(optimized):
            if len(optimized) <= 1:
                break

            candidate = optimized[i]
            # Calculate coverage without this candidate
            remaining = [c for c in optimized if c.user_id != candidate.user_id]

            cov_with = self._calculate_coverage_scores(optimized, required_caps)
            cov_without = self._calculate_coverage_scores(remaining, required_caps)

            # Check if all required capabilities have practically identical coverage without candidate
            coverage_drop = False
            for pc in required_caps:
                score_with = cov_with.get(pc.capability_id, 0.0)
                score_without = cov_without.get(pc.capability_id, 0.0)
                # If removing drops coverage by more than 1.0 point, keep the member
                if (score_with - score_without) > 1.0:
                    coverage_drop = True
                    break

            if not coverage_drop:
                # Candidate is completely redundant
                optimized.pop(i)
            else:
                i += 1

        return optimized

    def _calculate_coverage_scores(
        self,
        team_candidates: list[MatchCandidateRead],
        required_caps: list[ProblemCapability],
    ) -> dict[uuid.UUID, float]:
        """Calculates max capability score for each required capability across the team."""
        coverage: dict[uuid.UUID, float] = {pc.capability_id: 0.0 for pc in required_caps}
        for cand in team_candidates:
            cand_scores = {b.capability_id: b.user_score for b in cand.capability_breakdown}
            for pc in required_caps:
                score = cand_scores.get(pc.capability_id, 0.0)
                if score > coverage[pc.capability_id]:
                    coverage[pc.capability_id] = score
        return coverage

    # ── Coverage Calculation ─────────────────────────────────────────────

    def _calculate_team_coverage(
        self,
        team_candidates: list[MatchCandidateRead],
        required_caps: list[ProblemCapability],
    ) -> dict[str, Any]:
        """Calculates per-capability coverage, overall score, and remaining gaps."""
        coverage_map = self._calculate_coverage_scores(team_candidates, required_caps)

        coverage_items: list[TeamCapabilityCoverageRead] = []
        gaps: list[TeamGapRead] = []
        total_weighted = 0.0
        total_weight = 0.0

        for pc in required_caps:
            cap_id = pc.capability_id
            cap_name = pc.capability.name if pc.capability else "Unknown"
            req_level = self.skill_gap_service.normalize_required_level(pc.required_level, pc.importance)
            weight = IMPORTANCE_WEIGHTS.get(req_level, 0.7)

            score = coverage_map.get(cap_id, 0.0)
            status = self.skill_gap_service.classify_capability(score, req_level)

            total_weighted += score * weight
            total_weight += weight

            coverage_items.append(
                TeamCapabilityCoverageRead(
                    capability_id=cap_id,
                    capability=cap_name,
                    required_level=req_level,
                    importance=pc.importance,
                    coverage_score=score,
                    status=status,
                )
            )

            if status != "COVERED":
                if score <= 0.0:
                    reason = f"No suitable candidate with verified evidence was found for {cap_name}."
                else:
                    reason = f"The team achieves a partial score of {score} for {cap_name}, below the covered threshold."
                gaps.append(
                    TeamGapRead(
                        capability_id=cap_id,
                        capability=cap_name,
                        required_level=req_level,
                        coverage_score=score,
                        status=status,
                        reason=reason,
                    )
                )

        overall_coverage = round(total_weighted / total_weight, 1) if total_weight > 0 else 0.0

        return {
            "overall_coverage_score": max(0.0, min(100.0, overall_coverage)),
            "coverage_items": coverage_items,
            "gaps": gaps,
        }

    # ── Team Score Calculation ───────────────────────────────────────────

    def _calculate_team_score(
        self,
        team_candidates: list[MatchCandidateRead],
        coverage_score: float,
        required_caps: list[ProblemCapability],
    ) -> float:
        """Calculates the overall team objective score using TEAM_COMPOSITION_WEIGHTS."""
        if not team_candidates:
            return 0.0

        avg_evidence = sum(c.capability_score for c in team_candidates) / len(team_candidates)
        avg_relevance = sum(c.project_relevance_score for c in team_candidates) / len(team_candidates)

        # Complementarity: proportion of distinct primary capability contributions
        covered_threshold = SKILL_GAP_THRESHOLDS["covered"]
        contributions_count = 0
        for pc in required_caps:
            contributing = [
                c for c in team_candidates
                if any(b.capability_id == pc.capability_id and b.user_score >= 40.0 for b in c.capability_breakdown)
            ]
            if contributing:
                contributions_count += 1

        complementarity_score = (
            (contributions_count / len(required_caps) * 100.0) if required_caps else 0.0
        )

        team_score = (
            coverage_score * self.weights.get("coverage", 0.45)
            + avg_evidence * self.weights.get("evidence", 0.25)
            + avg_relevance * self.weights.get("relevance", 0.20)
            + complementarity_score * self.weights.get("complementarity", 0.10)
        )
        return round(max(0.0, min(100.0, team_score)), 1)

    # ── Role Assignment & Member Formatting ──────────────────────────────

    def _build_members_read(
        self,
        team_candidates: list[MatchCandidateRead],
        required_caps: list[ProblemCapability],
    ) -> list[TeamMemberRead]:
        """Generates evidence-based role suggestions and lists covered capabilities per member."""
        members: list[TeamMemberRead] = []

        for cand in team_candidates:
            cand_breakdowns = {b.capability_id: b for b in cand.capability_breakdown}

            # Find capabilities where this member has evidence >= 40
            covered_names: list[str] = []
            best_cap_name: str | None = None
            best_score: float = -1.0

            for pc in required_caps:
                b = cand_breakdowns.get(pc.capability_id)
                if b and b.user_score >= 40.0:
                    covered_names.append(b.capability_name)
                    if b.user_score > best_score:
                        best_score = b.user_score
                        best_cap_name = b.capability_name

            # Evidence-based suggested role
            if best_cap_name:
                suggested_role = f"Suggested role: {best_cap_name}"
            else:
                suggested_role = "General Contributor"

            members.append(
                TeamMemberRead(
                    user_id=cand.user_id,
                    user_name=cand.user_name,
                    suggested_role=suggested_role,
                    contribution_score=cand.total_score,
                    member_status=TeamMemberStatus.PROPOSED,
                    covered_capabilities=covered_names,
                )
            )

        return members

    # ── Explanation Builder ──────────────────────────────────────────────

    def _build_team_explanation(
        self,
        problem_title: str,
        team_score: float,
        coverage_score: float,
        members: list[TeamMemberRead],
        all_candidates: list[MatchCandidateRead],
        gaps: list[TeamGapRead],
    ) -> TeamExplanation:
        """Constructs a deterministic, fact-based explanation for the team composition."""
        size = len(members)
        if size == 0:
            summary = f"No eligible candidates were found to compose a team for '{problem_title}'."
        else:
            summary = (
                f"{size} member{'s were' if size > 1 else ' was'} selected for '{problem_title}', "
                f"achieving {coverage_score}% capability coverage and a team objective score of {team_score}."
            )

        member_explanations = []
        for m in members:
            caps_str = ", ".join(m.covered_capabilities) if m.covered_capabilities else "general tasks"
            member_explanations.append(
                f"{m.user_name} ({m.suggested_role}) contributes verified strength in {caps_str} "
                f"with a match score of {m.contribution_score}."
            )

        redundancy_notes = []
        selected_ids = {m.user_id for m in members}
        unselected = [c for c in all_candidates if c.user_id not in selected_ids]
        if unselected:
            redundancy_notes.append(
                f"{len(unselected)} candidate(s) were excluded to minimize redundancy as their capabilities "
                "were already sufficiently covered by the selected members."
            )

        if gaps:
            gap_names = ", ".join(g.capability for g in gaps)
            redundancy_notes.append(f"Remaining team capability gaps: {gap_names}.")

        return TeamExplanation(
            summary=summary,
            member_explanations=member_explanations,
            redundancy_notes=redundancy_notes,
        )

    # ── Persistence ──────────────────────────────────────────────────────

    def _persist_team(
        self,
        problem_id: uuid.UUID,
        team_score: float,
        coverage_score: float,
        explanation: dict[str, Any],
        members: list[TeamMemberRead],
        coverage_items: list[TeamCapabilityCoverageRead],
    ) -> Team:
        """Persists the Team, TeamMember, and TeamCapabilityCoverage entities."""
        # Check if there is an existing PROPOSED/DRAFT team for this problem to replace
        existing_stmt = select(Team).where(
            Team.problem_id == problem_id,
            Team.status == TeamStatus.PROPOSED,
        )
        existing_teams = list(self.db.execute(existing_stmt).scalars().all())
        for et in existing_teams:
            self.db.delete(et)
        self.db.flush()

        team = Team(
            problem_id=problem_id,
            name=f"Composed Team for Problem {str(problem_id)[:8]}",
            status=TeamStatus.PROPOSED,
            team_score=team_score,
            coverage_score=coverage_score,
            explanation=explanation,
        )
        self.db.add(team)
        self.db.flush()

        # Add members
        for m in members:
            tm = TeamMember(
                team_id=team.id,
                user_id=m.user_id,
                suggested_role=m.suggested_role,
                contribution_score=m.contribution_score,
                member_status=TeamMemberStatus.PROPOSED,
                covered_capabilities=m.covered_capabilities,
            )
            self.db.add(tm)
            m.id = tm.id

        # Add capability coverages
        for cov in coverage_items:
            tcc = TeamCapabilityCoverage(
                team_id=team.id,
                capability_id=cov.capability_id,
                coverage_score=cov.coverage_score,
                coverage_status=cov.status,
            )
            self.db.add(tcc)

        self.db.commit()
        self.db.refresh(team)
        return team

    # ── Edge Cases Handlers ──────────────────────────────────────────────

    def _handle_empty_requirements(self, problem: Problem) -> TeamCompositionResponse:
        now = datetime.now(timezone.utc)
        team = Team(
            problem_id=problem.id,
            name=f"Composed Team for Problem {str(problem.id)[:8]}",
            status=TeamStatus.PROPOSED,
            team_score=0.0,
            coverage_score=0.0,
            explanation={"summary": "Problem has no required capabilities."},
        )
        self.db.add(team)
        self.db.commit()
        self.db.refresh(team)

        return TeamCompositionResponse(
            team_id=team.id,
            problem_id=problem.id,
            problem_title=problem.title,
            team_score=0.0,
            coverage_score=0.0,
            team_size=0,
            status=TeamStatus.PROPOSED,
            members=[],
            capability_coverage=[],
            gaps=[],
            explanation=TeamExplanation(
                summary="The problem does not require any capabilities.",
                member_explanations=[],
                redundancy_notes=[],
            ),
            created_at=team.created_at,
        )

    def _handle_no_candidates(
        self, problem: Problem, required_caps: list[ProblemCapability]
    ) -> TeamCompositionResponse:
        coverage_data = self._calculate_team_coverage([], required_caps)
        explanation = TeamExplanation(
            summary=f"No matching candidates with verified evidence were found for '{problem.title}'.",
            member_explanations=[],
            redundancy_notes=["All required capabilities remain unfilled."],
        )
        team = self._persist_team(
            problem_id=problem.id,
            team_score=0.0,
            coverage_score=0.0,
            explanation=explanation.model_dump(),
            members=[],
            coverage_items=coverage_data["coverage_items"],
        )

        return TeamCompositionResponse(
            team_id=team.id,
            problem_id=problem.id,
            problem_title=problem.title,
            team_score=0.0,
            coverage_score=0.0,
            team_size=0,
            status=TeamStatus.PROPOSED,
            members=[],
            capability_coverage=coverage_data["coverage_items"],
            gaps=coverage_data["gaps"],
            explanation=explanation,
            created_at=team.created_at,
        )
