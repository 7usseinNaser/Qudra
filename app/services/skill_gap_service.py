import uuid
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.exceptions import (
    ProblemAccessDeniedError,
    ProblemNotAnalyzedError,
    ProblemNotFoundError,
)
from app.db.models.problem import ProblemCapability, ProblemStatus
from app.db.models.user_capability import UserCapability
from app.repositories.problem_repository import ProblemRepository
from app.schemas.skill_gap import (
    SkillGapCapabilityRead,
    SkillGapResponse,
    SkillGapSummary,
)
from app.services.capability_scoring_service import CapabilityScoringService

# Centralized configuration for skill gap thresholds
SKILL_GAP_THRESHOLDS: dict[str, float] = {
    "covered": 70.0,
    "partial": 40.0,
}

# Centralized importance weights for overall problem readiness
IMPORTANCE_WEIGHTS: dict[str, float] = {
    "HIGH": 1.0,
    "MEDIUM": 0.7,
    "LOW": 0.4,
}

# Priority mapping based on required level and gap status
PRIORITY_MATRIX: dict[tuple[str, str], str] = {
    ("HIGH", "GAP"): "CRITICAL",
    ("HIGH", "PARTIAL"): "HIGH",
    ("HIGH", "COVERED"): "NONE",
    ("MEDIUM", "GAP"): "HIGH",
    ("MEDIUM", "PARTIAL"): "MEDIUM",
    ("MEDIUM", "COVERED"): "NONE",
    ("LOW", "GAP"): "LOW",
    ("LOW", "PARTIAL"): "LOW",
    ("LOW", "COVERED"): "NONE",
}


class SkillGapService:
    """Analyzes the gap between a problem's required capabilities and a user's verified capabilities.

    Integrates directly with Feature 2 (Problem Analysis) and Feature 5 (Capability Score).
    """

    def __init__(self, db: Session):
        self.db = db
        self.problem_repo = ProblemRepository(db)
        self.scoring_service = CapabilityScoringService(db)

    def normalize_required_level(
        self, required_level: str | None, importance: int | None = None
    ) -> str:
        """Normalizes requirement level to canonical HIGH, MEDIUM, or LOW."""
        if required_level:
            cleaned = required_level.strip().upper()
            if cleaned in ("HIGH", "CRITICAL", "ADVANCED"):
                return "HIGH"
            if cleaned in ("MEDIUM", "INTERMEDIATE", "MODERATE"):
                return "MEDIUM"
            if cleaned in ("LOW", "BEGINNER", "BASIC"):
                return "LOW"

        if importance is not None:
            if importance >= 75:
                return "HIGH"
            if importance >= 40:
                return "MEDIUM"
            return "LOW"

        return "MEDIUM"

    def classify_capability(self, current_score: float, required_level: str) -> str:
        """Classifies capability into COVERED (>=70), PARTIAL (40-69), or GAP (<40)."""
        covered_threshold = SKILL_GAP_THRESHOLDS["covered"]
        partial_threshold = SKILL_GAP_THRESHOLDS["partial"]

        if current_score >= covered_threshold:
            return "COVERED"
        if current_score >= partial_threshold:
            return "PARTIAL"
        return "GAP"

    def calculate_gap(self, current_score: float) -> float:
        """Calculates gap value: max(required_threshold - current_score, 0)."""
        covered_threshold = SKILL_GAP_THRESHOLDS["covered"]
        if current_score >= covered_threshold:
            return 0.0
        return max(0.0, round(covered_threshold - current_score, 1))

    def calculate_priority(self, required_level: str, status: str) -> str:
        """Determines gap priority from requirement level and status."""
        return PRIORITY_MATRIX.get(
            (required_level, status), "NONE" if status == "COVERED" else "LOW"
        )

    def calculate_problem_readiness(
        self, required_items: list[tuple[str, float]]
    ) -> float:
        """Calculates overall problem readiness as an importance-weighted average (0-100).

        Formula: sum(score * importance_weight) / sum(importance_weight)
        """
        if not required_items:
            return 0.0

        total_weighted_score = sum(
            score * IMPORTANCE_WEIGHTS.get(level, 0.7) for level, score in required_items
        )
        total_weights = sum(
            IMPORTANCE_WEIGHTS.get(level, 0.7) for level, score in required_items
        )

        if total_weights <= 0:
            return 0.0

        raw_readiness = total_weighted_score / total_weights
        return round(max(0.0, min(100.0, raw_readiness)), 1)

    def generate_explanation(
        self, capability_name: str, current_score: float, required_level: str, status: str
    ) -> str:
        """Generates deterministic, factual explanation for a capability's evaluation."""
        req_label = required_level.lower()
        if status == "COVERED":
            return (
                f"The user has verified evidence for {capability_name} with an evidence "
                f"score of {current_score}, meeting the {req_label} requirement."
            )
        if status == "PARTIAL":
            return (
                f"The user has partial verified evidence for {capability_name} (score: {current_score}). "
                f"Further evidence is recommended to fully cover this {req_label} requirement."
            )
        if current_score <= 0.0:
            return (
                f"The problem requires {capability_name} at {req_label} importance, "
                f"but the user currently has no verified evidence for this capability."
            )
        return (
            f"The user has an evidence score of {current_score} for {capability_name}, "
            f"which is below the threshold needed for this {req_label} requirement."
        )

    def analyze_skill_gap(
        self, user_id: uuid.UUID, problem_id: uuid.UUID
    ) -> SkillGapResponse:
        """Analyzes skill gap for a specific problem against the authenticated user."""
        # 1. Retrieve problem
        problem = self.problem_repo.get_by_id(problem_id)
        if not problem:
            raise ProblemNotFoundError()

        # 2. Authorization check
        if problem.user_id != user_id:
            raise ProblemAccessDeniedError()

        # 3. Ensure problem has been analyzed
        if problem.status != ProblemStatus.ANALYZED or not problem.analysis:
            raise ProblemNotAnalyzedError()

        # 4. Deduplicate required capabilities by capability_id (keep highest importance)
        required_caps_map: dict[uuid.UUID, ProblemCapability] = {}
        for pc in problem.capabilities:
            existing = required_caps_map.get(pc.capability_id)
            if not existing or pc.importance > existing.importance:
                required_caps_map[pc.capability_id] = pc

        required_caps = list(required_caps_map.values())
        if not required_caps:
            return SkillGapResponse(
                problem_id=problem_id,
                user_id=user_id,
                overall_readiness=0.0,
                summary=SkillGapSummary(covered=0, partial=0, gaps=0),
                capabilities=[],
            )

        # 5. Batch-fetch user's UserCapability records for these required capabilities
        cap_ids = [pc.capability_id for pc in required_caps]
        stmt = select(UserCapability).where(
            UserCapability.user_id == user_id,
            UserCapability.capability_id.in_(cap_ids),
        )
        user_caps = {uc.capability_id: uc for uc in self.db.execute(stmt).scalars().all()}

        # 6. Evaluate each required capability
        evaluations: list[SkillGapCapabilityRead] = []
        readiness_inputs: list[tuple[str, float]] = []
        covered_count = 0
        partial_count = 0
        gap_count = 0

        for pc in required_caps:
            cap_id = pc.capability_id
            cap_name = pc.capability.name if pc.capability else "Unknown Capability"
            req_level = self.normalize_required_level(pc.required_level, pc.importance)

            # Determine score from Feature 5
            uc = user_caps.get(cap_id)
            if uc is not None:
                # If evidence_strength is evaluated, use it; otherwise compute from Feature 5 engine
                if uc.last_evaluated_at is not None:
                    score = float(uc.evidence_strength)
                else:
                    score_res = self.scoring_service.calculate_capability_score(user_id, cap_id)
                    score = float(score_res["score"])
            else:
                score = 0.0

            status = self.classify_capability(score, req_level)
            gap_val = self.calculate_gap(score)
            priority = self.calculate_priority(req_level, status)
            reason = self.generate_explanation(cap_name, score, req_level, status)

            if status == "COVERED":
                covered_count += 1
            elif status == "PARTIAL":
                partial_count += 1
            else:
                gap_count += 1

            evaluations.append(
                SkillGapCapabilityRead(
                    capability_id=cap_id,
                    capability_name=cap_name,
                    required_level=req_level,
                    current_score=score,
                    status=status,
                    gap=gap_val,
                    priority=priority,
                    reason=reason,
                )
            )
            readiness_inputs.append((req_level, score))

        # 7. Compute overall problem readiness
        overall_readiness = self.calculate_problem_readiness(readiness_inputs)

        return SkillGapResponse(
            problem_id=problem_id,
            user_id=user_id,
            overall_readiness=overall_readiness,
            summary=SkillGapSummary(
                covered=covered_count,
                partial=partial_count,
                gaps=gap_count,
            ),
            capabilities=evaluations,
        )
