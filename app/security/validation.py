import hashlib
import os
import re
from typing import Tuple
from app.core.config import settings


def sanitize_filename(filename: str) -> str:
    """
    Sanitize filename against path traversal attacks (e.g., ../../etc/passwd).
    Returns a clean, safe filename.
    """
    basename = os.path.basename(filename)
    # Remove any character that is not alphanumeric, underscore, hyphen, or dot
    safe_name = re.sub(r"[^\w\.-]", "_", basename)
    return safe_name or "document.pdf"


def compute_sha256(content: bytes) -> str:
    """Compute SHA-256 hash of file content for unique document identification & duplicate detection."""
    return hashlib.sha256(content).hexdigest()


def validate_pdf_upload(filename: str, content: bytes) -> Tuple[bool, str]:
    """
    Validates uploaded PDF file size, file extension, and magic header bytes (%PDF).
    Returns (is_valid, error_message).
    """
    # 1. Check extension
    if not filename.lower().endswith(".pdf"):
        return False, "Invalid file format. Only PDF documents (.pdf) are allowed."

    # 2. Check file size limit
    max_bytes = settings.MAX_FILE_SIZE_MB * 1024 * 1024
    if len(content) > max_bytes:
        return False, f"File size exceeds maximum allowed limit of {settings.MAX_FILE_SIZE_MB}MB."

    if len(content) == 0:
        return False, "Uploaded file is empty (0 bytes)."

    # 3. Check PDF Magic Bytes (%PDF-)
    if not content.startswith(b"%PDF"):
        return False, "File content is corrupted or not a valid PDF binary."

    return True, ""
