import logging
from abc import ABC, abstractmethod

logger = logging.getLogger("qudra.stt")


class SpeechToTextProvider(ABC):
    @abstractmethod
    async def transcribe(self, audio_bytes: bytes, content_type: str | None = None) -> str:
        """Transcribe audio bytes to text transcript."""
        pass


class MockSpeechToTextProvider(SpeechToTextProvider):
    async def transcribe(self, audio_bytes: bytes, content_type: str | None = None) -> str:
        logger.info("MockSpeechToTextProvider transcribing %d audio bytes", len(audio_bytes))
        if len(audio_bytes) < 10:
            return ""
        return (
            "I design and implement modular backend architectures with robust error handling, "
            "data persistence layer isolation, type safety, and automated test coverage to ensure high performance."
        )
