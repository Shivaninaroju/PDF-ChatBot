import os
from typing import Any, List, Optional
from langchain_core.documents import Document
from langchain_community.vectorstores import FAISS
from app.core.config import settings
from app.core.logging import logger
from app.providers.embeddings import get_embedding_provider


_vectorstore_instance = None

def get_vector_store(path: str = None) -> Any:
    """
    Loads or initializes a persistent FAISS vector store. Caches it globally.
    If vector_store directory exists and contains index files, loads it.
    Otherwise creates an empty vector store instance ready for document ingestion.
    """
    global _vectorstore_instance
    if _vectorstore_instance is not None:
        return _vectorstore_instance

    db_path = path or settings.VECTOR_STORE_PATH
    embeddings = get_embedding_provider()

    if os.path.exists(db_path) and os.listdir(db_path):
        try:
            logger.info(f"Loading existing vector store from '{db_path}'")
            _vectorstore_instance = FAISS.load_local(db_path, embeddings, allow_dangerous_deserialization=True)
            return _vectorstore_instance
        except Exception as e:
            logger.warning(f"Could not load existing vector store from '{db_path}': {e}. Creating new instance.")

    # Create dummy initial document to initialize index structure safely if needed
    logger.info("Initializing new empty FAISS vector store instance...")
    dummy_doc = Document(
        page_content="System initialized.",
        metadata={"source": "system", "document_name": "system", "page_number": 0}
    )
    _vectorstore_instance = FAISS.from_documents([dummy_doc], embedding=embeddings)
    _vectorstore_instance.save_local(db_path)
    return _vectorstore_instance
