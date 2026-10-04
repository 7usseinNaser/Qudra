import uuid
from datetime import datetime, timezone
from typing import Any

from sqlalchemy.orm import Session

from app.core.exceptions import CapabilityNotFoundError
from app.db.models.evidence import Evidence, EvidenceType, VerificationStatus
from app.db.models.user_capability import UserCapability
from app.repositories.capability_repository import CapabilityRepository
from app.repositories.evidence_repository import EvidenceRepository
from app.repositories.user_capability_repository import UserCapabilityRepository

# Centralized scoring configuration (weights can be adjusted without rewriting the engine)
CAPABILITY_SCORE_WEIGHTS: dict[str, float] = {
    "practical": 0.40,
    "project": 0.30,
    "oral": 0.20,
    "freshness": 0.10,
}


class CapabilityScoringService:
    """Computes the Capability Score for a (user, capability) pair based strictly on verified evidence.

    Formula:
        score = practical_score * 0.40 + project_score * 0.30 + oral_score * 0.20 + freshness_score * 0.10

    Capability Score represents the STRENGTH OF AVAILABLE EVIDENCE for a capability,
    not an absolute measure of human ability.
    """

    def __init__(self, db: Session, weights: dict[str, float] | None = None):
        self.db = db
        self.weights = weights or CAPABILITY_SCORE_WEIGHTS
        self.evidence_repo = EvidenceRepository(db)
        self.capability_repo = CapabilityRepository(db)
        self.user_capability_repo = UserCapabilityRepository(db)

    def calculate_project_score(self, project_items: list[Evidence]) -> float:
        """Calculate project evidence score (0-100) before applying weight.

        Aggregation strategy:
        Average of the strongest relevant verified project evidence (top 3)
        to prevent minor/side projects from diluting deep proven expertise.
        """
        if not project_items:
            return 0.0

        scores: list[float] = []
        for e in project_items:
            meta = e.evidence_metadata or {}
            if e.score and e.score > 0:
                score = float(e.score)
            elif "overall_score" in meta and meta["overall_score"] is not None:
                score = float(meta["overall_score"])
            elif any(k in meta for k in ("relevance", "relevance_score", "complexity", "contribution")):
                relevance = float(meta.get("relevance") or meta.get("relevance_score", 100.0))
                contribution = float(meta.get("contribution") or meta.get("user_contribution", 100.0))
                complexity = float(meta.get("complexity") or meta.get("project_complexity", 100.0))
                tech_relevance = float(meta.get("technology_relevance") or meta.get("tech_relevance", 100.0))
                score = (
                    relevance * 0.30
                    + contribution * 0.30
                    + complexity * 0.25
                    + tech_relevance * 0.15
                )
            else:
                score = float(e.strength)
            scores.append(max(0.0, min(100.0, score)))

        if not scores:
            return 0.0

        # Take average of top 3 strongest projects
        scores.sort(reverse=True)
        top_k = scores[:3]
        return round(sum(top_k) / len(top_k), 1)

    def calculate_practical_score(self, practical_items: list[Evidence]) -> float:
        """Calculate practical challenge evidence score (0-100).

        Aggregation strategy:
        Average of top 3 strongest verified practical challenge submissions.
        """
        if not practical_items:
            return 0.0

        scores: list[float] = []
        for e in practical_items:
            meta = e.evidence_metadata or {}
            if e.score and e.score > 0:
                score = float(e.score)
            elif "overall_score" in meta and meta["overall_score"] is not None:
                score = float(meta["overall_score"])
            elif "score" in meta and meta["score"] is not None:
                score = float(meta["score"])
            else:
                score = float(e.strength)
            scores.append(max(0.0, min(100.0, score)))

        if not scores:
            return 0.0

        scores.sort(reverse=True)
        top_k = scores[:3]
        return round(sum(top_k) / len(top_k), 1)

    def calculate_oral_score(self, oral_items: list[Evidence]) -> float:
        """Calculate oral assessment evidence score (0-100).

        Prefers overall_score if present, or calculates fallback:
        correctness * 0.35 + relevance * 0.25 + depth * 0.25 + clarity * 0.15.
        """
        if not oral_items:
            return 0.0

        scores: list[float] = []
        for e in oral_items:
            meta = e.evidence_metadata or {}
            if e.score and e.score > 0:
                score = float(e.score)
            elif "overall_score" in meta and meta["overall_score"] is not None:
                score = float(meta["overall_score"])
            elif any(k in meta for k in ("correctness", "correctness_score")):
                correctness = float(meta.get("correctness") or meta.get("correctness_score", 0.0))
                relevance = float(meta.get("relevance") or meta.get("relevance_score", 0.0))
                depth = float(meta.get("depth") or meta.get("depth_score", 0.0))
                clarity = float(meta.get("clarity") or meta.get("clarity_score", 0.0))
                score = (
                    correctness * 0.35
                    + relevance * 0.25
                    + depth * 0.25
                    + clarity * 0.15
                )
            else:
                score = float(e.strength)

            scores.append(max(0.0, min(100.0, score)))

        if not scores:
            return 0.0

        scores.sort(reverse=True)
        top_k = scores[:3]
        return round(sum(top_k) / len(top_k), 1)

    def calculate_freshness_score(self, verified_items: list[Evidence]) -> float:
        """Calculate evidence freshness score (0-100) based on the most recent verified evidence.

        Age schedule:
            0-6 months (<= 180 days)   -> 100
            6-12 months (181-365 days) -> 90
            1-2 years (366-730 days)   -> 75
            2-3 years (731-1095 days)  -> 60
            > 3 years (> 1095 days)    -> 40
        """
        if not verified_items:
            return 0.0

        # Find newest evidence timestamp
        newest = max(verified_items, key=lambda e: e.created_at)
        now = datetime.now(timezone.utc)
        created_at = newest.created_at
        if created_at.tzinfo is None:
            created_at = created_at.replace(tzinfo=timezone.utc)

        days_ago = max(0, (now - created_at).days)

        if days_ago <= 180:
            return 100.0
        elif days_ago <= 365:
            return 90.0
        elif days_ago <= 730:
            return 75.0
        elif days_ago <= 1095:
            return 60.0
        else:
            return 40.0

    def calculate_capability_score(
        self, user_id: uuid.UUID, capability_id: uuid.UUID
    ) -> dict[str, Any]:
        """Calculates deterministic Capability Score and breakdown from verified evidence."""
        if self.capability_repo.get_by_id(capability_id) is None:
            raise CapabilityNotFoundError()

        # Fetch only VERIFIED evidence for this user + capability
        all_items = self.evidence_repo.list_for_user_and_capability(user_id, capability_id)
        verified_items = [
            e for e in all_items
            if getattr(e, "verification_status", VerificationStatus.VERIFIED) == VerificationStatus.VERIFIED
        ]

        if not verified_items:
            return {
                "score": 0.0,
                "components": {
                    "practical": 0.0,
                    "project": 0.0,
                    "oral": 0.0,
                    "freshness": 0.0,
                },
                "weights": dict(self.weights),
                "evidence_count": 0,
                "last_evaluated_at": datetime.now(timezone.utc),
            }

        practical_items = [e for e in verified_items if e.type == EvidenceType.PRACTICAL]
        project_items = [e for e in verified_items if e.type == EvidenceType.PROJECT]
        oral_items = [e for e in verified_items if e.type == EvidenceType.ORAL]

        practical_score = self.calculate_practical_score(practical_items)
        project_score = self.calculate_project_score(project_items)
        oral_score = self.calculate_oral_score(oral_items)
        freshness_score = self.calculate_freshness_score(verified_items)

        # Standard weighted composite formula
        raw_score = (
            practical_score * self.weights.get("practical", 0.40)
            + project_score * self.weights.get("project", 0.30)
            + oral_score * self.weights.get("oral", 0.20)
            + freshness_score * self.weights.get("freshness", 0.10)
        )

        final_score = max(0.0, min(100.0, round(raw_score, 1)))

        return {
            "score": final_score,
            "components": {
                "practical": practical_score,
                "project": project_score,
                "oral": oral_score,
                "freshness": freshness_score,
            },
            "weights": dict(self.weights),
            "evidence_count": len(verified_items),
            "last_evaluated_at": datetime.now(timezone.utc),
        }

    def recalculate_user_capability(
        self, user_id: uuid.UUID, capability_id: uuid.UUID
    ) -> UserCapability:
        """Calculates score and updates the UserCapability entity in the database."""
        result = self.calculate_capability_score(user_id, capability_id)

        user_cap = self.user_capability_repo.update_capability_score(
            user_id=user_id,
            capability_id=capability_id,
            score=result["score"],
            evidence_count=result["evidence_count"],
            breakdown=result["components"],
            evaluated_at=result["last_evaluated_at"],
        )
        return user_cap

    def recalculate_user_capabilities(self, user_id: uuid.UUID) -> list[UserCapability]:
        """Recalculates all capabilities for a given user."""
        rows = self.user_capability_repo.list_for_user_with_capability(user_id)
        updated: list[UserCapability] = []
        for uc, _ in rows:
            updated_uc = self.recalculate_user_capability(user_id, uc.capability_id)
            updated.append(updated_uc)
        return updated
