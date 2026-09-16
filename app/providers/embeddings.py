from abc import ABC, abstractmethod
from langchain_core.embeddings import Embeddings
from app.core.config import settings
from app.core.logging import logger

try:
    from langchain_community.embeddings import HuggingFaceEmbeddings
    HF_AVAILABLE = True
except ImportError:
    HF_AVAILABLE = False

try:
    from langchain_community.embeddings import OllamaEmbeddings
    OLLAMA_AVAILABLE = True
except ImportError:
    OLLAMA_AVAILABLE = False

try:
    from langchain_openai import OpenAIEmbeddings
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False


class BaseEmbeddingProvider(ABC):
    @abstractmethod
    def get_embeddings(self) -> Embeddings:
        pass


class HuggingFaceEmbeddingProvider(BaseEmbeddingProvider):
    def get_embeddings(self) -> Embeddings:
        if not HF_AVAILABLE:
            raise ImportError("langchain-community is required for HuggingFace embeddings.")
        return HuggingFaceEmbeddings(model_name=settings.EMBEDDING_MODEL_NAME)


class OllamaEmbeddingProvider(BaseEmbeddingProvider):
    def get_embeddings(self) -> Embeddings:
        if not OLLAMA_AVAILABLE:
            raise ImportError("langchain-community is required for Ollama embeddings.")
        return OllamaEmbeddings(
            base_url=settings.OLLAMA_BASE_URL,
            model=settings.OLLAMA_MODEL
        )


class OpenAIEmbeddingProvider(BaseEmbeddingProvider):
    def get_embeddings(self) -> Embeddings:
        if not OPENAI_AVAILABLE:
            raise ImportError("langchain-openai is required for OpenAI embeddings.")
        return OpenAIEmbeddings(
            api_key=settings.OPENAI_API_KEY,
            model=settings.OPENAI_EMBEDDING_MODEL
        )


_embedding_instance = None

def get_embedding_provider() -> Embeddings:
    """Factory function returning active Embeddings based on provider setting. Caches the instance globally."""
    global _embedding_instance
    if _embedding_instance is not None:
        return _embedding_instance

    provider = settings.EMBEDDING_PROVIDER.lower()
    logger.info(f"Initializing Embedding provider: {provider}")

    if provider == "huggingface":
        _embedding_instance = HuggingFaceEmbeddingProvider().get_embeddings()
    elif provider == "ollama":
        _embedding_instance = OllamaEmbeddingProvider().get_embeddings()
    elif provider == "openai":
        _embedding_instance = OpenAIEmbeddingProvider().get_embeddings()
    else:
        logger.warning(f"Unknown Embedding provider '{provider}'. Falling back to HuggingFace.")
        _embedding_instance = HuggingFaceEmbeddingProvider().get_embeddings()
        
    return _embedding_instance
