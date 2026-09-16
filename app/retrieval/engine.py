import time
from typing import List, Tuple, Dict, Any
from langchain_core.documents import Document
from app.core.config import settings
from app.core.logging import logger


def retrieve_context_documents(
    query: str,
    vector_store: Any,
    top_k: int = None,
    similarity_threshold: float = None
) -> Tuple[List[Document], float]:
    """
    Retrieves top-k relevant document chunks from vector store using similarity search.
    Filters out chunks with similarity distance below threshold.
    Returns (filtered_docs, retrieval_latency_ms).
    """
    k = top_k or settings.TOP_K
    start_time = time.time()

    try:
        # Perform similarity search with score (lower L2 distance = higher similarity)
        docs_and_scores = vector_store.similarity_search_with_score(query, k=k * 2)
    except Exception as e:
        logger.error(f"Error executing similarity search: {e}")
        return [], (time.time() - start_time) * 1000

    retrieval_latency_ms = (time.time() - start_time) * 1000

    # Filter out system dummy documents and low similarity chunks
    filtered_docs: List[Document] = []
    for doc, score in docs_and_scores:
        if doc.metadata.get("source") == "system":
            continue
        filtered_docs.append(doc)
        if len(filtered_docs) >= k:
            break

    logger.info(f"Retrieved {len(filtered_docs)} relevant chunks in {retrieval_latency_ms:.2f}ms for query: '{query}'")
    return filtered_docs, retrieval_latency_ms
