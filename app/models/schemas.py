from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(..., description="User query or question")
    session_id: str = Field(default="default_session", description="Conversation session identifier")


class CitationItem(BaseModel):
    document_name: str
    page_number: int
    formatted_citation: str


class LatencyMetrics(BaseModel):
    retrieval_ms: float
    generation_ms: float
    total_ms: float


class ChatResponse(BaseModel):
    answer: str
    citations: List[CitationItem] = []
    sources: List[str] = []
    metrics: Optional[LatencyMetrics] = None


class DocumentInfo(BaseModel):
    document_id: str
    document_name: str
    file_hash: str
    total_pages: int
    total_chunks: int
    file_size_bytes: int
    status: str


class EvaluationResult(BaseModel):
    recall_at_k: float
    precision_at_k: float
    mrr: float
    ndcg: float
    top_k_accuracy: float
    groundedness: float
    answer_relevance: float
    correctness: float
    completeness: float
    latency: LatencyMetrics


class HealthResponse(BaseModel):
    status: str
    environment: str
    llm_provider: str
    embedding_provider: str
    vector_store_provider: str
