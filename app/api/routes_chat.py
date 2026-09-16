from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from app.models.schemas import ChatRequest, ChatResponse
from app.providers.vectorstore import get_vector_store
from app.ingestion.pipeline import process_and_ingest_pdf
from app.generation.rag_chain import execute_rag_pipeline

router = APIRouter(tags=["RAG Chat & Generation"])


@router.post("/chat")
async def chat_with_uploaded_pdf(
    file: UploadFile = File(None),
    question: str = Form(...)
):
    """
    Main Chat & Ingestion Endpoint.
    Supports uploading a PDF file + question in multipart/form-data.
    If question is 'start', returns upload confirmation metadata.
    """
    vector_store = get_vector_store()

    if file and file.filename:
        file_bytes = await file.read()
        success, msg, meta = process_and_ingest_pdf(
            filename=file.filename,
            file_bytes=file_bytes,
            vector_store_instance=vector_store
        )
        if not success:
            return JSONResponse(status_code=400, content={"answer": f"⚠️ {msg}"})

        # Handle initial upload handshake
        if question.strip().lower() in ["start", "init", "hello", "hi"]:
            pages_cnt = meta.get("total_pages", 1)
            chunks_cnt = meta.get("total_chunks", 1)
            return {
                "answer": f"Document '{file.filename}' uploaded and analyzed successfully! ({pages_cnt} page(s) parsed, {chunks_cnt} chunks embedded). Ask me any question about its contents!",
                "sources": [],
                "citations": []
            }

    # Execute RAG Pipeline for query
    rag_result = execute_rag_pipeline(question, vector_store)
    return rag_result


@router.post("/api/v1/chat", response_model=ChatResponse)
async def api_v1_chat(request: ChatRequest):
    """
    JSON API v1 Endpoint for sending queries to ingested document collection.
    """
    vector_store = get_vector_store()
    rag_result = execute_rag_pipeline(request.message, vector_store, session_id=request.session_id)
    return rag_result
