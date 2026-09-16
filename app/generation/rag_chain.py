import time
from typing import List, Dict, Any, Tuple
from langchain_core.documents import Document
from app.core.logging import logger
from app.providers.llm import get_llm_provider
from app.security.prompt_guard import SYSTEM_PROMPT, construct_rag_prompt
from app.retrieval.engine import retrieve_context_documents
from app.generation.memory import conversation_memory


def format_context_with_citations(docs: List[Document]) -> Tuple[str, List[Dict[str, Any]]]:
    """
    Formats context text for LLM prompt and extracts structured source citations.
    """
    context_blocks = []
    citations = []
    seen_sources = set()

    for idx, doc in enumerate(docs, start=1):
        doc_name = doc.metadata.get("document_name") or doc.metadata.get("source", "Document.pdf")
        page_num = doc.metadata.get("page_number", 1)
        chunk_text = doc.page_content.strip()

        context_blocks.append(f"[Snippet #{idx} - Source: {doc_name} (Page {page_num})]\n{chunk_text}")

        citation_key = f"{doc_name}_p{page_num}"
        if citation_key not in seen_sources:
            seen_sources.add(citation_key)
            citations.append({
                "document_name": doc_name,
                "page_number": page_num,
                "formatted_citation": f"{doc_name} — Page {page_num}"
            })

    formatted_context = "\n\n".join(context_blocks)
    return formatted_context, citations


from app.generation.router import route_intent, get_static_response

def execute_rag_pipeline(
    question: str,
    vector_store: Any,
    session_id: str = "default_session"
) -> Dict[str, Any]:
    """
    Executes complete RAG Pipeline:
    1. Pre-Retrieval Intent Routing
    2. Retrieve context chunks from vector store
    3. Format context and citations
    4. Construct secure, prompt-injection resistant prompt
    5. Generate LLM answer
    6. Update conversation memory
    7. Record latency breakdown
    """
    total_start = time.time()

    # 1. Pre-Retrieval Intent Routing
    intent = route_intent(question)
    if intent != "RAG_QUERY":
        static_answer = get_static_response(intent)
        return {
            "answer": static_answer,
            "citations": [],
            "sources": [],
            "metrics": {
                "retrieval_ms": 0.0,
                "generation_ms": 0.0,
                "total_ms": round((time.time() - total_start) * 1000, 2)
            }
        }

    # 2. Retrieval
    retrieved_docs, retrieval_ms = retrieve_context_documents(question, vector_store)

    if not retrieved_docs:
        return {
            "answer": "I couldn't find sufficient information about this in the uploaded document.",
            "citations": [],
            "sources": [],
            "metrics": {
                "retrieval_ms": round(retrieval_ms, 2),
                "generation_ms": 0.0,
                "total_ms": round((time.time() - total_start) * 1000, 2)
            }
        }

    # 2. Context & Citations Format
    formatted_context, citations = format_context_with_citations(retrieved_docs)

    # Add conversation history context if available
    history_str = conversation_memory.get_formatted_history(session_id)
    full_context_input = formatted_context
    if history_str:
        full_context_input = f"Previous Conversation History:\n{history_str}\n\nCurrent Document Context:\n{formatted_context}"

    # 3. Secure Prompt Construction
    prompt = construct_rag_prompt(question, full_context_input)

    # 4. LLM Generation
    gen_start = time.time()
    try:
        llm = get_llm_provider()
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt}
        ]
        response = llm.invoke(messages)
        answer_text = response.content.strip()
    except Exception as e:
        logger.error(f"LLM Generation failed: {e}")
        answer_text = f"⚠️ Generation error: {str(e)}"

    generation_ms = (time.time() - gen_start) * 1000
    total_ms = (time.time() - total_start) * 1000

    # 5. Record Memory Turn
    if not answer_text.startswith("⚠️"):
        conversation_memory.add_turn(session_id, question, answer_text)

    # Prepare sources list
    sources_list = [c["formatted_citation"] for c in citations]

    return {
        "answer": answer_text,
        "citations": citations,
        "sources": sources_list,
        "metrics": {
            "retrieval_ms": round(retrieval_ms, 2),
            "generation_ms": round(generation_ms, 2),
            "total_ms": round(total_ms, 2)
        }
    }
