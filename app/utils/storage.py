import os
import uuid
from abc import ABC, abstractmethod


class StorageService(ABC):
    @abstractmethod
    def save_file(self, file_bytes: bytes, filename: str, content_type: str | None = None) -> str:
        """Save file bytes and return access URL/path."""
        pass


class LocalStorageService(StorageService):
    def __init__(self, upload_dir: str = "uploads"):
        self.upload_dir = upload_dir
        os.makedirs(self.upload_dir, exist_ok=True)

    def save_file(self, file_bytes: bytes, filename: str, content_type: str | None = None) -> str:
        ext = os.path.splitext(filename)[1] or ".bin"
        unique_name = f"{uuid.uuid4().hex}{ext}"
        filepath = os.path.join(self.upload_dir, unique_name)
        with open(filepath, "wb") as f:
            f.write(file_bytes)
        return f"/static/uploads/{unique_name}"
