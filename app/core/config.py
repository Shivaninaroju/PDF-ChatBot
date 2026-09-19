import os
from pathlib import Path
from typing import Literal
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv

# Local .env only. Never override process env (Render sets GROQ_API_KEY there).
_PROJECT_ROOT_ENV = Path(__file__).resolve().parents[2] / ".env"
if _PROJECT_ROOT_ENV.is_file():
    load_dotenv(_PROJECT_ROOT_ENV, override=False)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        env_ignore_empty=True,
    )

    # Application
    APP_NAME: str = "Production RAG PDF Assistant"
    ENVIRONMENT: str = "production"  # local, staging, production
    LOG_LEVEL: str = "INFO"

    # Infrastructure Provider Configurations
    LLM_PROVIDER: Literal["groq", "ollama", "openai"] = "groq"
    EMBEDDING_PROVIDER: Literal["huggingface", "ollama", "openai"] = "huggingface"
    VECTOR_STORE_PROVIDER: Literal["faiss", "chroma"] = "faiss"

    # Groq Settings
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "groq/compound-mini"

    # Ollama Settings (Local Development)
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama3"

    # OpenAI Settings (Cloud Alternative)
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o-mini"
    OPENAI_EMBEDDING_MODEL: str = "text-embedding-3-small"

    # Local Embeddings Settings
    EMBEDDING_MODEL_NAME: str = "all-MiniLM-L6-v2"

    # Document & Ingestion Constraints
    MAX_FILE_SIZE_MB: int = 15
    ALLOWED_EXTENSIONS: list[str] = [".pdf"]
    STORAGE_DIR: str = "storage/pdfs"
    VECTOR_STORE_PATH: str = "vector_store"

    # RAG Retrieval & Chunking Parameters
    CHUNK_SIZE: int = 500
    CHUNK_OVERLAP: int = 50
    TOP_K: int = 4
    SIMILARITY_THRESHOLD: float = 0.25

    def get_groq_api_key(self) -> str:
        """Returns GROQ API key from the process environment, then Settings/.env."""
        raw = os.environ.get("GROQ_API_KEY") or self.GROQ_API_KEY or ""
        key = raw.strip()
        if (key.startswith('"') and key.endswith('"')) or (key.startswith("'") and key.endswith("'")):
            key = key[1:-1].strip()
        return key


settings = Settings()
