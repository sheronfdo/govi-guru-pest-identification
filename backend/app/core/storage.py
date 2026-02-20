from pathlib import Path
from uuid import uuid4

UPLOAD_DIR = Path("uploads")


def ensure_upload_dir() -> None:
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def save_upload_file(filename: str, content: bytes) -> str:
    ensure_upload_dir()
    ext = Path(filename).suffix
    new_name = f"{uuid4().hex}{ext}"
    path = UPLOAD_DIR / new_name
    path.write_bytes(content)
    return f"/uploads/{new_name}"
