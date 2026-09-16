from fastapi import APIRouter
from app.core.config import settings
from app.models.schemas import HealthResponse

router = APIRouter(tags=["Health & Status"])


@router.get("/health", response_model=HealthResponse)
def health_check():
    """Liveness probe returning server status and infrastructure provider configuration."""
    return HealthResponse(
        status="ok",
        environment=settings.ENVIRONMENT,
        llm_provider=settings.LLM_PROVIDER,
        embedding_provider=settings.EMBEDDING_PROVIDER,
        vector_store_provider=settings.VECTOR_STORE_PROVIDER
    )


@router.get("/ready")
def readiness_check():
    """Readiness probe checking readiness for production traffic."""
    return {
        "status": "ready",
        "storage_dir": settings.STORAGE_DIR,
        "vector_store_path": settings.VECTOR_STORE_PATH
    }
