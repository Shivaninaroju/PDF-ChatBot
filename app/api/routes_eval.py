import numpy as np
from fastapi import APIRouter
from app.evaluation.dataset import load_golden_dataset
from app.evaluation.metrics import (
    calculate_recall_at_k,
    calculate_precision_at_k,
    calculate_mrr,
    calculate_ndcg,
    calculate_top_k_accuracy
)
from app.evaluation.judge import evaluate_with_llm_judge
from app.providers.vectorstore import get_vector_store
from app.generation.rag_chain import execute_rag_pipeline

router = APIRouter(prefix="/api/v1", tags=["RAG Evaluation"])


@router.post("/evaluate")
def run_rag_evaluation():
    """
    Executes automated RAG evaluation framework against the Golden Dataset.
    Calculates Retrieval Metrics (Recall@K, Precision@K, MRR, NDCG, Top-K Accuracy),
    Generation Metrics (Groundedness, Relevance, Correctness, Completeness),
    and Latency Percentiles (P50, P95).
    """
    dataset = load_golden_dataset()
    vector_store = get_vector_store()

    recall_scores = []
    precision_scores = []
    mrr_scores = []
    ndcg_scores = []
    top_k_acc_scores = []

    groundedness_scores = []
    relevance_scores = []
    correctness_scores = []
    completeness_scores = []

    retrieval_latencies = []
    generation_latencies = []
    total_latencies = []

    details = []

    for item in dataset:
        q = item["question"]
        exp_ans = item["expected_answer"]
        rel_pages = item.get("relevant_pages", [])

        # Execute RAG Pipeline
        rag_res = execute_rag_pipeline(q, vector_store)
        answer = rag_res["answer"]
        citations = rag_res["citations"]
        metrics = rag_res["metrics"]

        # Extracted retrieved page numbers
        retrieved_pages = [c["page_number"] for c in citations]

        # Calculate Retrieval Metrics
        r = calculate_recall_at_k(retrieved_pages, rel_pages)
        p = calculate_precision_at_k(retrieved_pages, rel_pages)
        mrr = calculate_mrr(retrieved_pages, rel_pages)
        ndcg = calculate_ndcg(retrieved_pages, rel_pages)
        top_k_acc = calculate_top_k_accuracy(retrieved_pages, rel_pages)

        recall_scores.append(r)
        precision_scores.append(p)
        mrr_scores.append(mrr)
        ndcg_scores.append(ndcg)
        top_k_acc_scores.append(top_k_acc)

        # Track Latencies
        retrieval_latencies.append(metrics["retrieval_ms"])
        generation_latencies.append(metrics["generation_ms"])
        total_latencies.append(metrics["total_ms"])

        # LLM-as-a-Judge Evaluation
        context_str = "\n".join([c["formatted_citation"] for c in citations])
        judge_res = evaluate_with_llm_judge(q, context_str, answer, exp_ans)

        groundedness_scores.append(judge_res["groundedness"])
        relevance_scores.append(judge_res["answer_relevance"])
        correctness_scores.append(judge_res["correctness"])
        completeness_scores.append(judge_res["completeness"])

        details.append({
            "id": item["id"],
            "category": item["category"],
            "question": q,
            "retrieved_pages": retrieved_pages,
            "relevant_pages": rel_pages,
            "recall_at_k": round(r, 4),
            "precision_at_k": round(p, 4),
            "mrr": round(mrr, 4),
            "ndcg": round(ndcg, 4),
            "judge_scores": judge_res
        })

    # Summary Report
    report = {
        "summary": {
            "total_test_cases": len(dataset),
            "retrieval_metrics": {
                "recall_at_k": round(float(np.mean(recall_scores)), 4),
                "precision_at_k": round(float(np.mean(precision_scores)), 4),
                "mrr": round(float(np.mean(mrr_scores)), 4),
                "ndcg": round(float(np.mean(ndcg_scores)), 4),
                "top_k_accuracy": round(float(np.mean(top_k_acc_scores)), 4),
            },
            "generation_metrics": {
                "groundedness": round(float(np.mean(groundedness_scores)), 4),
                "answer_relevance": round(float(np.mean(relevance_scores)), 4),
                "correctness": round(float(np.mean(correctness_scores)), 4),
                "completeness": round(float(np.mean(completeness_scores)), 4),
            },
            "latency_ms": {
                "retrieval_p50": round(float(np.percentile(retrieval_latencies, 50)), 2),
                "retrieval_p95": round(float(np.percentile(retrieval_latencies, 95)), 2),
                "generation_p50": round(float(np.percentile(generation_latencies, 50)), 2),
                "generation_p95": round(float(np.percentile(generation_latencies, 95)), 2),
                "total_p50": round(float(np.percentile(total_latencies, 50)), 2),
                "total_p95": round(float(np.percentile(total_latencies, 95)), 2),
            }
        },
        "details": details
    }

    return report
