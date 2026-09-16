import re
from typing import Literal
from app.providers.llm import get_llm_provider
from app.core.logging import logger

IntentType = Literal["GREETING", "UNRELATED", "RAG_QUERY"]

def fast_regex_greeting_check(question: str) -> bool:
    """
    Ultra-fast heuristic to catch simple conversational greetings without hitting an LLM.
    """
    clean_q = question.strip().lower()
    # Simple regex for common one-word or short greetings
    if re.fullmatch(r"hi|hello|hey|greetings|how are you\?*|thanks|thank you", clean_q):
        return True
    return False

def route_intent(question: str) -> IntentType:
    """
    Determines the intent of the user's question before triggering the heavy RAG retrieval process.
    Returns one of: GREETING, UNRELATED, RAG_QUERY
    """
    if fast_regex_greeting_check(question):
        logger.info(f"Router: Fast regex matched GREETING for query: '{question}'")
        return "GREETING"

    prompt = f"""You are a query classifier for a RAG (Retrieval-Augmented Generation) document assistant.
Analyze the user's message and determine the intent.
Output ONLY one of the following exact labels: GREETING, UNRELATED, RAG_QUERY.

Rules:
- GREETING: Conversational greetings, pleasantries, or simple chitchat.
- UNRELATED: Specific questions that clearly have nothing to do with a generic document (e.g., "What is Python?", "How far is the moon?").
- RAG_QUERY: Any question that might be asking about the contents of a document (e.g., "What is the event date?", "Who organized it?", "What activities are planned?", "Tell me about the budget."). Also classify ambiguous follow-up questions as RAG_QUERY.

User Message: {question}
Intent Label:"""

    try:
        llm = get_llm_provider()
        response = llm.invoke([{"role": "user", "content": prompt}])
        raw_text = response.content.strip().upper()
        
        # Clean up in case the LLM returned extra text
        if "GREETING" in raw_text:
            return "GREETING"
        elif "UNRELATED" in raw_text:
            return "UNRELATED"
        else:
            return "RAG_QUERY"
            
    except Exception as e:
        logger.warning(f"Router LLM failed: {e}. Defaulting to RAG_QUERY.")
        return "RAG_QUERY"

def get_static_response(intent: IntentType) -> str:
    if intent == "GREETING":
        return "Hi! How can I help you with your document?"
    elif intent == "UNRELATED":
        return "I am a document assistant. Please ask questions related to the uploaded PDF."
    return ""
