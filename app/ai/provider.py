import json
import logging
from abc import ABC, abstractmethod

from app.ai.prompts.problem_analysis import PROBLEM_ANALYSIS_SYSTEM_PROMPT
from app.schemas.problem import ProblemAnalysisResponse, RequiredCapabilityAnalysis

logger = logging.getLogger("qudra.ai")


class AIProvider(ABC):
    @abstractmethod
    async def analyze_problem(
        self, description: str, title: str | None = None, domain: str | None = None
    ) -> ProblemAnalysisResponse:
        """Analyze problem description and return validated structured analysis."""
        pass

    @abstractmethod
    async def generate_oral_question(
        self, capability_name: str, category: str | None = None
    ) -> str:
        """Generate a technical oral assessment question for a capability."""
        pass

    @abstractmethod
    async def evaluate_oral_answer(
        self, question: str, transcript: str, capability_name: str
    ) -> dict[str, float | str]:
        """Evaluate spoken transcript for correctness, depth, relevance, completeness."""
        pass

    @abstractmethod
    async def evaluate_practical_submission(
        self, challenge_title: str, description: str, answer: str | None, code: str | None
    ) -> dict[str, float | str]:
        """Evaluate practical challenge submission code/answer."""
        pass


class MockAIProvider(AIProvider):
    """Deterministic mock provider for unit testing and offline development."""

    async def analyze_problem(
        self, description: str, title: str | None = None, domain: str | None = None
    ) -> ProblemAnalysisResponse:
        logger.info("MockAIProvider analyzing problem: %s", title or description[:30])

        desc_lower = description.lower()
        title_lower = (title or "").lower()
        domain_val = domain or "Technology"

        req_capabilities: list[RequiredCapabilityAnalysis] = []

        if "audio" in desc_lower or "speech" in desc_lower or "reading" in desc_lower or "voice" in desc_lower:
            req_capabilities.append(
                RequiredCapabilityAnalysis(
                    name="Speech Processing",
                    category="Artificial Intelligence",
                    importance=95,
                    required_level="ADVANCED",
                    reason="The application needs to process student audio recording.",
                )
            )
            req_capabilities.append(
                RequiredCapabilityAnalysis(
                    name="NLP",
                    category="Artificial Intelligence",
                    importance=90,
                    required_level="INTERMEDIATE",
                    reason="The system needs to analyze and score textual feedback.",
                )
            )

        if "mobile" in desc_lower or "app" in desc_lower or "student" in desc_lower:
            req_capabilities.append(
                RequiredCapabilityAnalysis(
                    name="Mobile Development",
                    category="Software Engineering",
                    importance=80,
                    required_level="INTERMEDIATE",
                    reason="Front-end mobile interface for user interaction.",
                )
            )

        if not req_capabilities:
            req_capabilities = [
                RequiredCapabilityAnalysis(
                    name="Backend Development",
                    category="Software Engineering",
                    importance=85,
                    required_level="INTERMEDIATE",
                    reason="The application requires robust APIs and server processing.",
                ),
                RequiredCapabilityAnalysis(
                    name="Database Design",
                    category="Software Engineering",
                    importance=75,
                    required_level="INTERMEDIATE",
                    reason="Relational database setup to persist user data.",
                ),
            ]
        else:
            req_capabilities.append(
                RequiredCapabilityAnalysis(
                    name="Backend Development",
                    category="Software Engineering",
                    importance=85,
                    required_level="INTERMEDIATE",
                    reason="API endpoints and server side orchestration.",
                )
            )

        proj_type = (
            f"AI {domain_val} Application"
            if "ai" in desc_lower or "ai" in title_lower
            else f"{domain_val} Software Platform"
        )

        return ProblemAnalysisResponse(
            project_type=proj_type,
            domain=domain_val,
            target_users=["End Users", "Students", "Domain Practitioners"],
            problem_summary=f"Analysis of problem: {title or 'User Submission'}. {description[:100]}...",
            solution_direction=f"Develop a scalable system addressing: {description[:120]}...",
            required_capabilities=req_capabilities,
            technical_requirements=["Backend API", "Database Layer", "Client Interface"],
            potential_features=["User dashboard", "Core processing engine", "Analytics overview"],
            constraints=["Data privacy", "API performance", "System scalability"],
        )

    async def generate_oral_question(
        self, capability_name: str, category: str | None = None
    ) -> str:
        return (
            f"Explain the core architectural principles and best practices of {capability_name}. "
            f"How do you handle error handling, performance optimization, and edge cases?"
        )

    async def evaluate_oral_answer(
        self, question: str, transcript: str, capability_name: str
    ) -> dict[str, float | str]:
        t_len = len(transcript.strip())
        if t_len < 15:
            score = 30.0
            feedback = "Answer is too short to demonstrate strong capability comprehension."
        elif "explain" in transcript.lower() or "architecture" in transcript.lower() or "design" in transcript.lower() or t_len > 80:
            score = 88.0
            feedback = f"Strong oral evidence demonstrating deep practical knowledge of {capability_name}."
        else:
            score = 75.0
            feedback = f"Satisfactory oral answer providing good foundational understanding of {capability_name}."

        return {
            "correctness_score": score,
            "relevance_score": min(100.0, score + 5.0),
            "depth_score": max(0.0, score - 5.0),
            "completeness_score": score,
            "overall_score": score,
            "feedback": feedback,
        }

    async def evaluate_practical_submission(
        self, challenge_title: str, description: str, answer: str | None, code: str | None
    ) -> dict[str, float | str]:
        code_str = code or answer or ""
        c_len = len(code_str.strip())

        if c_len < 10:
            ai_score = 25.0
            test_score = 0.0
            final_score = 15.0
            feedback = "Submission lacks sufficient implementation code or solution text."
        else:
            ai_score = 85.0
            test_score = 90.0
            final_score = 87.5
            feedback = f"Excellent implementation solving '{challenge_title}'. Clean code structure and logic."

        return {
            "test_score": test_score,
            "ai_score": ai_score,
            "final_score": final_score,
            "feedback": feedback,
        }
