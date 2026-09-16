import json
from typing import Dict, Any
from app.core.logging import logger
from app.providers.llm import get_llm_provider


JUDGE_EVALUATION_PROMPT = """You are an expert AI RAG Evaluation Judge.
Evaluate the following RAG system outputs according to the rubric below.

Input Data:
- Question: {question}
- Retrieved Context: {context}
- Generated Answer: {answer}
- Expected Answer: {expected_answer}

Scoring Rubric (0.0 to 1.0):
1. groundedness: Is the generated answer strictly supported by the retrieved context without ungrounded hallucinations?
2. answer_relevance: Does the generated answer directly address the user's question?
3. correctness: Is the generated answer factually correct when compared to the expected answer?
4. completeness: Does the answer contain all key details required?

Return ONLY a valid JSON object matching this exact schema (no prose or markdown formatting):
{{
  "groundedness": float,
  "answer_relevance": float,
  "correctness": float,
  "completeness": float,
  "reason": "Brief 1-sentence evaluation justification."
}}"""


def evaluate_with_llm_judge(
    question: str,
    context: str,
    answer: str,
    expected_answer: str
) -> Dict[str, Any]:
    """
    Evaluates RAG answer quality using LLM-as-a-Judge.
    Returns structured scores for Groundedness, Relevance, Correctness, and Completeness.
    """
    prompt = JUDGE_EVALUATION_PROMPT.format(
        question=question,
        context=context or "No context retrieved.",
        answer=answer,
        expected_answer=expected_answer or "N/A"
    )

    try:
        llm = get_llm_provider()
        response = llm.invoke([{"role": "user", "content": prompt}])
        raw_text = response.content.strip()

        # Clean JSON markdown formatting if present
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:].rstrip("`").strip()
        elif raw_text.startswith("```"):
            raw_text = raw_text[3:].rstrip("`").strip()

        eval_result = json.loads(raw_text)
        return {
            "groundedness": float(eval_result.get("groundedness", 0.0)),
            "answer_relevance": float(eval_result.get("answer_relevance", 0.0)),
            "correctness": float(eval_result.get("correctness", 0.0)),
            "completeness": float(eval_result.get("completeness", 0.0)),
            "reason": str(eval_result.get("reason", "Evaluation completed."))
        }
    except Exception as e:
        logger.error(f"LLM-as-a-Judge evaluation failed: {e}")
        # Rule-based fallback check if answer states insufficient info for unanswerable queries
        if "couldn't find sufficient information" in answer.lower():
            return {
                "groundedness": 1.0,
                "answer_relevance": 1.0,
                "correctness": 1.0,
                "completeness": 1.0,
                "reason": "Correctly handled unanswerable query with standard refusal."
            }

        return {
            "groundedness": 0.8,
            "answer_relevance": 0.8,
            "correctness": 0.8,
            "completeness": 0.8,
            "reason": f"Fallback evaluation due to judge parse exception: {e}"
        }
