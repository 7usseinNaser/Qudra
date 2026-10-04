"""Feature 7: Explainable Matching Service.

Computes deterministic, explainable match scores between candidate users and a problem.
Reuses CapabilityScoringService (Feature 5) as single source of truth for evidence scores.
"""

import uuid
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.exceptions import ProblemNotAnalyzedError, ProblemNotFoundError
from app.db.models.evidence import Evidence, EvidenceType, VerificationStatus
from app.db.models.match_result import MatchResult
from app.db.models.problem import ProblemCapability, ProblemStatus
from app.db.models.project import Project
from app.db.models.project_capability import ProjectCapability
from app.db.models.user import User
from app.db.models.user_capability import UserCapability
from app.repositories.problem_repository import ProblemRepository
from app.schemas.matching import (
    MatchCandidateRead,
    MatchCapabilityBreakdown,
    MatchesResponse,
    MatchExplanation,
)
from app.services.capability_scoring_service import CapabilityScoringService
from app.services.skill_gap_service import IMPORTANCE_WEIGHTS, SkillGapService

# ── Centralized matching weights (spec requirement) ──────────────────────
MATCHING_WEIGHTS: dict[str, float] = {
    "capability_match": 0.40,
    "practical": 0.25,
    "project_relevance": 0.20,
    "oral": 0.10,
    "freshness": 0.05,
}


class MatchingService:
    """Calculates deterministic, explainable match scores for all eligible candidates.

    Flow:
        Problem (analyzed) → required capabilities
        Find all users who have any of those capabilities
        For each candidate:
            1. Capability match score (importance-weighted average)
            2. Practical evidence component
            3. Project relevance component (ProjectCapability overlap)
            4. Oral evidence component
            5. Freshness component
            6. Total score = weighted combination of 1-5
            7. Build structured explanation
    """

    def __init__(self, db: Session):
        self.db = db
        self.problem_repo = ProblemRepository(db)
        self.scoring_service = CapabilityScoringService(db)
        self.skill_gap_service = SkillGapService(db)

    # ── Candidate Discovery ──────────────────────────────────────────────

    def find_candidates(
        self, required_capability_ids: list[uuid.UUID],
    ) -> list[User]:
        """Find all active users who hold at least one of the required capabilities.

        Uses a single batch query (no N+1).
        """
        if not required_capability_ids:
            return []

        stmt = (
            select(User)
            .where(
                User.is_active.is_(True),
                User.id.in_(
                    select(UserCapability.user_id)
                    .where(UserCapability.capability_id.in_(required_capability_ids))
                    .distinct()
                ),
            )
        )
        return list(self.db.execute(stmt).scalars().all())

    # ── Component Calculators ────────────────────────────────────────────

    def calculate_capability_match(
        self,
        user_caps: dict[uuid.UUID, UserCapability],
        required_caps: list[ProblemCapability],
    ) -> tuple[float, list[MatchCapabilityBreakdown]]:
        """Weighted-average capability match using IMPORTANCE_WEIGHTS.

        Returns (score 0-100, per-capability breakdown list).
        """
        if not required_caps:
            return 0.0, []

        total_weighted = 0.0
        total_weight = 0.0
        breakdowns: list[MatchCapabilityBreakdown] = []

        for pc in required_caps:
            req_level = self.skill_gap_service.normalize_required_level(
                pc.required_level, pc.importance
            )
            weight = IMPORTANCE_WEIGHTS.get(req_level, 0.7)
            cap_name = pc.capability.name if pc.capability else "Unknown"

            uc = user_caps.get(pc.capability_id)
            if uc is not None and uc.last_evaluated_at is not None:
                user_score = float(uc.evidence_strength)
            elif uc is not None:
                result = self.scoring_service.calculate_capability_score(
                    uc.user_id, pc.capability_id
                )
                user_score = float(result["score"])
            else:
                user_score = 0.0

            status = self.skill_gap_service.classify_capability(user_score, req_level)
            total_weighted += user_score * weight
            total_weight += weight

            breakdowns.append(
                MatchCapabilityBreakdown(
                    capability_id=pc.capability_id,
                    capability_name=cap_name,
                    required_level=req_level,
                    importance=pc.importance,
                    user_score=user_score,
                    status=status,
                )
            )

        score = round(total_weighted / total_weight, 1) if total_weight > 0 else 0.0
        return max(0.0, min(100.0, score)), breakdowns

    def calculate_practical_score(
        self,
        user_id: uuid.UUID,
        required_capability_ids: list[uuid.UUID],
    ) -> float:
        """Average practical evidence score across required capabilities (0-100)."""
        if not required_capability_ids:
            return 0.0

        stmt = select(Evidence).where(
            Evidence.user_id == user_id,
            Evidence.capability_id.in_(required_capability_ids),
            Evidence.type == EvidenceType.PRACTICAL,
            Evidence.verification_status == VerificationStatus.VERIFIED,
        )
        items = list(self.db.execute(stmt).scalars().all())
        if not items:
            return 0.0

        return self.scoring_service.calculate_practical_score(items)

    def calculate_oral_score(
        self,
        user_id: uuid.UUID,
        required_capability_ids: list[uuid.UUID],
    ) -> float:
        """Average oral evidence score across required capabilities (0-100)."""
        if not required_capability_ids:
            return 0.0

        stmt = select(Evidence).where(
            Evidence.user_id == user_id,
            Evidence.capability_id.in_(required_capability_ids),
            Evidence.type == EvidenceType.ORAL,
            Evidence.verification_status == VerificationStatus.VERIFIED,
        )
        items = list(self.db.execute(stmt).scalars().all())
        if not items:
            return 0.0

        return self.scoring_service.calculate_oral_score(items)

    def calculate_project_relevance(
        self,
        user_id: uuid.UUID,
        required_capability_ids: list[uuid.UUID],
    ) -> tuple[float, list[str]]:
        """Overlap between a user's project-tagged capabilities and the required capabilities.

        Returns (score 0-100, list of relevant project titles).
        """
        if not required_capability_ids:
            return 0.0, []

        # Find user's projects
        projects_stmt = select(Project).where(Project.owner_id == user_id)
        user_projects = list(self.db.execute(projects_stmt).scalars().all())
        if not user_projects:
            return 0.0, []

        project_ids = [p.id for p in user_projects]
        project_map = {p.id: p.title for p in user_projects}

        # Find which of those projects are tagged with required capabilities
        pc_stmt = select(ProjectCapability).where(
            ProjectCapability.project_id.in_(project_ids),
            ProjectCapability.capability_id.in_(required_capability_ids),
        )
        tagged = list(self.db.execute(pc_stmt).scalars().all())
        if not tagged:
            return 0.0, []

        # Unique matching capabilities and projects
        matched_cap_ids = set()
        relevant_project_ids = set()
        for t in tagged:
            matched_cap_ids.add(t.capability_id)
            relevant_project_ids.add(t.project_id)

        # Score = percentage of required capabilities covered by projects
        coverage = len(matched_cap_ids) / len(required_capability_ids)
        score = round(max(0.0, min(100.0, coverage * 100.0)), 1)

        relevant_titles = [
            project_map[pid] for pid in relevant_project_ids if pid in project_map
        ]
        return score, relevant_titles

    def calculate_freshness(
        self,
        user_id: uuid.UUID,
        required_capability_ids: list[uuid.UUID],
    ) -> float:
        """Evidence freshness score across required capabilities (0-100).

        Reuses CapabilityScoringService.calculate_freshness_score().
        """
        if not required_capability_ids:
            return 0.0

        stmt = select(Evidence).where(
            Evidence.user_id == user_id,
            Evidence.capability_id.in_(required_capability_ids),
            Evidence.verification_status == VerificationStatus.VERIFIED,
        )
        items = list(self.db.execute(stmt).scalars().all())
        if not items:
            return 0.0

        return self.scoring_service.calculate_freshness_score(items)

    # ── Total Score ──────────────────────────────────────────────────────

    def calculate_total_score(
        self,
        capability_score: float,
        practical_score: float,
        project_relevance_score: float,
        oral_score: float,
        freshness_score: float,
    ) -> float:
        """Applies MATCHING_WEIGHTS to produce the final composite score (0-100)."""
        raw = (
            capability_score * MATCHING_WEIGHTS["capability_match"]
            + practical_score * MATCHING_WEIGHTS["practical"]
            + project_relevance_score * MATCHING_WEIGHTS["project_relevance"]
            + oral_score * MATCHING_WEIGHTS["oral"]
            + freshness_score * MATCHING_WEIGHTS["freshness"]
        )
        return round(max(0.0, min(100.0, raw)), 1)

    # ── Explanation Builder ──────────────────────────────────────────────

    def build_explanation(
        self,
        user_name: str,
        total_score: float,
        breakdowns: list[MatchCapabilityBreakdown],
        relevant_projects: list[str],
    ) -> MatchExplanation:
        """Builds a structured, fact-based explanation for the match."""
        covered = [b for b in breakdowns if b.status == "COVERED"]
        gaps = [b for b in breakdowns if b.status == "GAP"]
        partial = [b for b in breakdowns if b.status == "PARTIAL"]

        # Summary
        total_req = len(breakdowns)
        summary = (
            f"{user_name} matches {len(covered)}/{total_req} required capabilities fully, "
            f"with {len(partial)} partial and {len(gaps)} gaps. "
            f"Overall match score: {total_score}."
        )

        # Strengths (fact-based)
        strengths = []
        for b in covered:
            strengths.append(
                f"Strong evidence for {b.capability_name} "
                f"(score: {b.user_score}, importance: {b.importance})"
            )

        # Gaps (fact-based)
        gap_lines = []
        for b in gaps:
            gap_lines.append(
                f"No sufficient evidence for {b.capability_name} "
                f"(score: {b.user_score}, required level: {b.required_level})"
            )
        for b in partial:
            gap_lines.append(
                f"Partial evidence for {b.capability_name} "
                f"(score: {b.user_score}, required level: {b.required_level})"
            )

        return MatchExplanation(
            summary=summary,
            strengths=strengths,
            gaps=gap_lines,
            relevant_projects=relevant_projects,
        )

    # ── Main Orchestration ───────────────────────────────────────────────

    def find_matches(self, problem_id: uuid.UUID) -> MatchesResponse:
        """Computes match scores for all eligible candidates against a problem.

        Steps:
        1. Validate problem exists and is analyzed
        2. Extract required capabilities
        3. Find candidate users (batch query)
        4. For each candidate, calculate all component scores
        5. Build explanations
        6. Rank by total_score descending
        7. Persist as MatchResult snapshots
        """
        # 1. Validate problem
        problem = self.problem_repo.get_by_id(problem_id)
        if not problem:
            raise ProblemNotFoundError()
        if problem.status != ProblemStatus.ANALYZED or not problem.analysis:
            raise ProblemNotAnalyzedError()

        # 2. Extract deduplicated required capabilities
        required_caps_map: dict[uuid.UUID, ProblemCapability] = {}
        for pc in problem.capabilities:
            existing = required_caps_map.get(pc.capability_id)
            if not existing or pc.importance > existing.importance:
                required_caps_map[pc.capability_id] = pc
        required_caps = list(required_caps_map.values())
        required_cap_ids = list(required_caps_map.keys())

        if not required_caps:
            return MatchesResponse(
                problem_id=problem_id,
                problem_title=problem.title,
                total_candidates=0,
                weights=MATCHING_WEIGHTS,
                matches=[],
            )

        # 3. Find candidates (batch, no N+1)
        candidates = self.find_candidates(required_cap_ids)

        # 4. Batch-fetch UserCapability for all candidates × required capabilities
        if candidates:
            all_user_ids = [c.id for c in candidates]
            uc_stmt = select(UserCapability).where(
                UserCapability.user_id.in_(all_user_ids),
                UserCapability.capability_id.in_(required_cap_ids),
            )
            all_ucs = list(self.db.execute(uc_stmt).scalars().all())
            # Group by user_id
            uc_by_user: dict[uuid.UUID, dict[uuid.UUID, UserCapability]] = {}
            for uc in all_ucs:
                uc_by_user.setdefault(uc.user_id, {})[uc.capability_id] = uc
        else:
            uc_by_user = {}

        # 5. Score each candidate
        results: list[MatchCandidateRead] = []
        now = datetime.now(timezone.utc)

        for candidate in candidates:
            user_caps = uc_by_user.get(candidate.id, {})

            cap_score, breakdowns = self.calculate_capability_match(
                user_caps, required_caps
            )
            prac_score = self.calculate_practical_score(candidate.id, required_cap_ids)
            proj_score, relevant_projects = self.calculate_project_relevance(
                candidate.id, required_cap_ids
            )
            oral = self.calculate_oral_score(candidate.id, required_cap_ids)
            fresh = self.calculate_freshness(candidate.id, required_cap_ids)

            total = self.calculate_total_score(
                cap_score, prac_score, proj_score, oral, fresh
            )

            explanation = self.build_explanation(
                candidate.full_name, total, breakdowns, relevant_projects
            )

            results.append(
                MatchCandidateRead(
                    user_id=candidate.id,
                    user_name=candidate.full_name,
                    total_score=total,
                    capability_score=cap_score,
                    practical_score=prac_score,
                    project_relevance_score=proj_score,
                    oral_score=oral,
                    freshness_score=fresh,
                    explanation=explanation,
                    capability_breakdown=breakdowns,
                    matched_at=now,
                )
            )

        # 6. Rank by total_score descending
        results.sort(key=lambda r: r.total_score, reverse=True)

        # 7. Persist snapshots
        self._persist_results(problem_id, results, now)

        return MatchesResponse(
            problem_id=problem_id,
            problem_title=problem.title,
            total_candidates=len(results),
            weights=MATCHING_WEIGHTS,
            matches=results,
        )

    def recalculate_matches(self, problem_id: uuid.UUID) -> MatchesResponse:
        """Force recalculation of all match results for a problem.

        Clears existing MatchResult rows for this problem, then recomputes.
        """
        # Clear existing results
        stmt = select(MatchResult).where(MatchResult.problem_id == problem_id)
        existing = list(self.db.execute(stmt).scalars().all())
        for mr in existing:
            self.db.delete(mr)
        self.db.flush()

        return self.find_matches(problem_id)

    # ── Persistence ──────────────────────────────────────────────────────

    def _persist_results(
        self,
        problem_id: uuid.UUID,
        results: list[MatchCandidateRead],
        now: datetime,
    ) -> None:
        """Upserts MatchResult rows for each candidate."""
        for r in results:
            # Check for existing row
            stmt = select(MatchResult).where(
                MatchResult.problem_id == problem_id,
                MatchResult.user_id == r.user_id,
            )
            existing = self.db.execute(stmt).scalar_one_or_none()

            explanation_dict = r.explanation.model_dump()

            if existing:
                existing.total_score = r.total_score
                existing.capability_score = r.capability_score
                existing.practical_score = r.practical_score
                existing.project_relevance_score = r.project_relevance_score
                existing.oral_score = r.oral_score
                existing.freshness_score = r.freshness_score
                existing.explanation = explanation_dict
                existing.updated_at = now
            else:
                match_result = MatchResult(
                    problem_id=problem_id,
                    user_id=r.user_id,
                    total_score=r.total_score,
                    capability_score=r.capability_score,
                    practical_score=r.practical_score,
                    project_relevance_score=r.project_relevance_score,
                    oral_score=r.oral_score,
                    freshness_score=r.freshness_score,
                    explanation=explanation_dict,
                )
                self.db.add(match_result)

        self.db.flush()
