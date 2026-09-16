import os
import pytest
from app.ingestion.pipeline import process_and_ingest_pdf
from app.providers.vectorstore import get_vector_store
from app.generation.rag_chain import execute_rag_pipeline


from unittest.mock import patch
from langchain_core.documents import Document

def test_full_rag_pipeline_integration(tmp_path):
    # 1. Create temporary sample PDF content
    sample_pdf_bytes = b"%PDF-1.4 sample pdf binary data for integration testing"

    # Initialize test vector store
    test_db_dir = str(tmp_path / "test_vector_store")
    vector_store = get_vector_store(path=test_db_dir)

    # 2. Ingest document using a patched extractor to avoid real PDF parsing errors
    dummy_doc = Document(
        page_content="This is some sample text for integration testing. We will see if RAG can answer questions about this test.",
        metadata={"page_number": 1}
    )
    with patch("app.ingestion.pipeline.extract_text_from_pdf", return_value=[dummy_doc]):
        success, msg, meta = process_and_ingest_pdf(
            filename="integration_test.pdf",
            file_bytes=sample_pdf_bytes,
            vector_store_instance=vector_store
        )

    assert success
    assert meta["document_name"] == "integration_test.pdf"
    assert "file_hash" in meta
    assert meta["status"] == "indexed"

    # 3. Execute query retrieval
    rag_res = execute_rag_pipeline("What is this test about?", vector_store)
    assert "answer" in rag_res
    assert "metrics" in rag_res
    assert "retrieval_ms" in rag_res["metrics"]
