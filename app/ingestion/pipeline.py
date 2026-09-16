import os
from typing import Dict, Any, List, Tuple
from app.core.config import settings
from app.core.logging import logger
from app.security.validation import validate_pdf_upload, sanitize_filename, compute_sha256
from app.ingestion.extractor import extract_text_from_pdf
from app.chunking.splitter import split_documents_with_metadata
from langchain_core.documents import Document


# In-memory document registry for tracking metadata and SHA-256 hashes
_INGESTED_DOCUMENTS: Dict[str, Dict[str, Any]] = {}


def process_and_ingest_pdf(
    filename: str,
    file_bytes: bytes,
    vector_store_instance: Any
) -> Tuple[bool, str, Dict[str, Any]]:
    """
    Complete idempotent PDF Ingestion Pipeline:
    1. Validate file (type, size, magic bytes)
    2. Compute SHA-256 hash & check duplicate
    3. Save file securely to storage
    4. Extract text with PyMuPDF / PyPDF dual engine
    5. Chunk text preserving metadata
    6. Index chunks into vector store
    Returns (success, message, metadata).
    """
    # 1. Validate
    is_valid, error_msg = validate_pdf_upload(filename, file_bytes)
    if not is_valid:
        return False, error_msg, {}

    clean_name = sanitize_filename(filename)
    doc_hash = compute_sha256(file_bytes)
    document_id = f"doc_{doc_hash[:12]}"

    # 2. Check for Duplicate Ingestion (Idempotent)
    if document_id in _INGESTED_DOCUMENTS:
        doc_info = _INGESTED_DOCUMENTS[document_id]
        logger.info(f"Duplicate document detected (Hash: {doc_hash[:8]}). Re-using existing index.")
        return True, f"Document '{clean_name}' already indexed.", doc_info

    # 3. Store PDF to storage directory safely
    os.makedirs(settings.STORAGE_DIR, exist_ok=True)
    stored_path = os.path.join(settings.STORAGE_DIR, f"{document_id}_{clean_name}")
    with open(stored_path, "wb") as f:
        f.write(file_bytes)

    # 4. Extract Text
    page_docs = extract_text_from_pdf(stored_path, clean_name)
    if not page_docs:
        return False, f"Failed to extract readable text from '{clean_name}'. The PDF may be empty or image-only.", {}

    # 5. Chunking
    chunks = split_documents_with_metadata(page_docs, document_id, clean_name)
    if not chunks:
        return False, f"No text chunks created from '{clean_name}'.", {}

    # 6. Embed & Index into Vector Store
    try:
        vector_store_instance.add_documents(chunks)
        vector_store_instance.save_local(settings.VECTOR_STORE_PATH)
    except Exception as e:
        logger.error(f"Vector store indexing failed for '{clean_name}': {e}")
        return False, f"Indexing failed: {str(e)}", {}

    metadata = {
        "document_id": document_id,
        "document_name": clean_name,
        "file_hash": doc_hash,
        "total_pages": len(page_docs),
        "total_chunks": len(chunks),
        "file_size_bytes": len(file_bytes),
        "status": "indexed"
    }

    _INGESTED_DOCUMENTS[document_id] = metadata
    logger.info(f"Ingestation complete for '{clean_name}' ({len(page_docs)} pages, {len(chunks)} chunks)")

    return True, f"Document '{clean_name}' processed and indexed successfully!", metadata


def get_ingested_documents() -> List[Dict[str, Any]]:
    return list(_INGESTED_DOCUMENTS.values())
