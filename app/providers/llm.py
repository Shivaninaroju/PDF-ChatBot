from abc import ABC, abstractmethod
from typing import Any
from langchain_core.language_models import BaseChatModel
from app.core.config import settings
from app.core.logging import logger

try:
    from langchain_groq import ChatGroq
    GROQ_AVAILABLE = True
except ImportError:
    GROQ_AVAILABLE = False

try:
    from langchain_community.chat_models import ChatOllama
    OLLAMA_AVAILABLE = True
except ImportError:
    OLLAMA_AVAILABLE = False

try:
    from langchain_openai import ChatOpenAI
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False


class BaseLLMProvider(ABC):
    @abstractmethod
    def get_llm(self) -> BaseChatModel:
        pass


class GroqLLMProvider(BaseLLMProvider):
    def get_llm(self) -> BaseChatModel:
        if not GROQ_AVAILABLE:
            raise ImportError("langchain-groq is not installed.")
        api_key = settings.get_groq_api_key()
        if not api_key:
            raise ValueError("GROQ_API_KEY is missing in environment or .env file.")
        return ChatGroq(
            groq_api_key=api_key,
            model_name=settings.GROQ_MODEL,
            temperature=0
        )


class OllamaLLMProvider(BaseLLMProvider):
    def get_llm(self) -> BaseChatModel:
        if not OLLAMA_AVAILABLE:
            raise ImportError("langchain-community is required for Ollama.")
        return ChatOllama(
            base_url=settings.OLLAMA_BASE_URL,
            model=settings.OLLAMA_MODEL,
            temperature=0
        )


class OpenAILLMProvider(BaseLLMProvider):
    def get_llm(self) -> BaseChatModel:
        if not OPENAI_AVAILABLE:
            raise ImportError("langchain-openai is not installed.")
        if not settings.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY is missing in environment or .env file.")
        return ChatOpenAI(
            api_key=settings.OPENAI_API_KEY,
            model=settings.OPENAI_MODEL,
            temperature=0
        )


def get_llm_provider() -> BaseChatModel:
    """Factory function returning active LLM based on provider setting."""
    provider = settings.LLM_PROVIDER.lower()
    logger.info(f"Initializing LLM provider: {provider}")

    if provider == "groq":
        return GroqLLMProvider().get_llm()
    elif provider == "ollama":
        return OllamaLLMProvider().get_llm()
    elif provider == "openai":
        return OpenAILLMProvider().get_llm()
    else:
        logger.warning(f"Unknown LLM provider '{provider}'. Falling back to Groq.")
        return GroqLLMProvider().get_llm()
