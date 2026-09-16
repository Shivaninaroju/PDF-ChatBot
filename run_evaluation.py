import os
import sys
from typing import Dict, Any, List

# Ensure the root directory is in the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.evaluation.dataset import load_golden_dataset
from app.evaluation.judge import evaluate_with_llm_judge
from app.evaluation.metrics import calculate_recall_at_k, calculate_precision_at_k, calculate_mrr
from app.generation.rag_chain import execute_rag_pipeline
from app.providers.vectorstore import get_vector_store
from app.core.logging import logger

def run_evaluation_suite():
    print("Starting RAG Evaluation Suite...")
    dataset = load_golden_dataset()
    vector_store = get_vector_store()

    results = []
    
    total_recall = 0.0
    total_precision = 0.0
    total_mrr = 0.0
    
    total_groundedness = 0.0
    total_relevance = 0.0
    total_correctness = 0.0
    total_completeness = 0.0

    print(f"Evaluating {len(dataset)} examples...")

    for i, data in enumerate(dataset, 1):
        print(f"\n--- Example {i}/{len(dataset)}: {data['id']} ---")
        question = data["question"]
        expected_answer = data["expected_answer"]
        relevant_pages = data["relevant_pages"]
        unanswerable = data["unanswerable"]

        print(f"Question: {question}")
        
        # 1. Execute RAG
        rag_res = execute_rag_pipeline(question, vector_store)
        answer = rag_res["answer"]
        context_docs = rag_res.get("context_docs", [])
        
        print(f"Generated Answer: {answer}")

        # Extract retrieved pages from context documents
        retrieved_pages = []
        context_texts = []
        for doc in context_docs:
            context_texts.append(doc.page_content)
            page_num = doc.metadata.get("page_number")
            if page_num and page_num not in retrieved_pages:
                retrieved_pages.append(page_num)
                
        context_str = "\n".join(context_texts)

        # 2. Compute Retrieval Metrics
        recall = calculate_recall_at_k(retrieved_pages, relevant_pages)
        precision = calculate_precision_at_k(retrieved_pages, relevant_pages)
        mrr = calculate_mrr(retrieved_pages, relevant_pages)
        
        print(f"Retrieval Metrics - Recall: {recall:.2f}, Precision: {precision:.2f}, MRR: {mrr:.2f}")

        # 3. Compute LLM-as-a-Judge Metrics
        judge_scores = evaluate_with_llm_judge(question, context_str, answer, expected_answer)
        
        print(f"Judge Metrics - Groundedness: {judge_scores['groundedness']:.2f}, Relevance: {judge_scores['answer_relevance']:.2f}, Correctness: {judge_scores['correctness']:.2f}, Completeness: {judge_scores['completeness']:.2f}")
        print(f"Judge Reason: {judge_scores['reason']}")

        # Accumulate
        total_recall += recall
        total_precision += precision
        total_mrr += mrr
        total_groundedness += judge_scores["groundedness"]
        total_relevance += judge_scores["answer_relevance"]
        total_correctness += judge_scores["correctness"]
        total_completeness += judge_scores["completeness"]

    n = len(dataset)
    
    # 4. Generate Final Report
    print("\n==================================================")
    print("FINAL EVALUATION METRICS REPORT")
    print("==================================================")
    print(f"Total Examples Evaluated: {n}")
    print("\n--- Retrieval Metrics ---")
    print(f"Mean Recall:     {total_recall / n:.2f}")
    print(f"Mean Precision:  {total_precision / n:.2f}")
    print(f"Mean MRR:        {total_mrr / n:.2f}")
    
    print("\n--- Generation Metrics (LLM-as-a-Judge) ---")
    print(f"Mean Groundedness: {total_groundedness / n:.2f}")
    print(f"Mean Relevance:    {total_relevance / n:.2f}")
    print(f"Mean Correctness:  {total_correctness / n:.2f}")
    print(f"Mean Completeness: {total_completeness / n:.2f}")
    print("==================================================\n")


if __name__ == "__main__":
    run_evaluation_suite()
