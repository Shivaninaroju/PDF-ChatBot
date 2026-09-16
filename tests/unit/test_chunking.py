import pytest
from langchain_core.documents import Document
from app.chunking.splitter import split_documents_with_metadata


def test_split_documents_with_metadata():
    doc1 = Document(
        page_content="Header section.\n\n" + "This is a sentence inside page 1 of document. " * 30,
        metadata={"page_number": 1}
    )
    doc2 = Document(
        page_content="Section 2.\n\n" + "This is content inside page 2 of document. " * 30,
        metadata={"page_number": 2}
    )

    chunks = split_documents_with_metadata(
        documents=[doc1, doc2],
        document_id="doc_12345",
        document_name="sample.pdf",
        chunk_size=200,
        chunk_overlap=20
    )

    assert len(chunks) > 0
    for chunk in chunks:
        assert chunk.metadata["document_id"] == "doc_12345"
        assert chunk.metadata["document_name"] == "sample.pdf"
        assert "page_number" in chunk.metadata
        assert "chunk_id" in chunk.metadata
        assert "chunk_index" in chunk.metadata
