import uuid
from typing import List
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.core.config import settings


def split_documents_with_metadata(
    documents: List[Document],
    document_id: str,
    document_name: str,
    chunk_size: int = None,
    chunk_overlap: int = None,
) -> List[Document]:
    """
    Splits document pages into chunks while preserving and attaching rich metadata:
    document_id, document_name, page_number, chunk_id, chunk_index, source.
    """
    c_size = chunk_size or settings.CHUNK_SIZE
    c_overlap = chunk_overlap or settings.CHUNK_OVERLAP

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=c_size,
        chunk_overlap=c_overlap,
        separators=["\n\n", "\n", " ", ""]
    )

    split_chunks: List[Document] = []
    chunk_index = 0

    for doc in documents:
        page_num = doc.metadata.get("page_number", 1)
        raw_chunks = splitter.split_text(doc.page_content)

        for sub_chunk in raw_chunks:
            if not sub_chunk.strip():
                continue
            chunk_index += 1
            chunk_id = f"{document_id}_p{page_num}_c{chunk_index}"

            enriched_meta = {
                "document_id": document_id,
                "document_name": document_name,
                "source": document_name,
                "page_number": page_num,
                "chunk_id": chunk_id,
                "chunk_index": chunk_index,
            }

            split_chunks.append(
                Document(
                    page_content=sub_chunk.strip(),
                    metadata=enriched_meta
                )
            )

    return split_chunks
