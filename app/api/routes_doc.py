from fastapi import APIRouter, UploadFile, File, HTTPException
from app.ingestion.pipeline import process_and_ingest_pdf, get_ingested_documents
from app.providers.vectorstore import get_vector_store

router = APIRouter(prefix="/api/v1", tags=["Document Ingestion"])


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    """
    Upload and ingest a PDF document.
    Executes file validation, SHA-256 duplicate checking, text extraction, chunking, and indexing.
    """
    file_bytes = await file.read()
    vector_store = get_vector_store()

    success, message, meta = process_and_ingest_pdf(
        filename=file.filename,
        file_bytes=file_bytes,
        vector_store_instance=vector_store
    )

    if not success:
        raise HTTPException(status_code=400, detail=message)

    return {
        "success": True,
        "message": message,
        "data": meta
    }


@router.get("/documents")
def list_documents():
    """List all ingested documents and processing metadata."""
    docs = get_ingested_documents()
    return {"documents": docs, "count": len(docs)}
