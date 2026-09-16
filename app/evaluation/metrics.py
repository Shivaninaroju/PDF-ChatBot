import math
from typing import List, Set, Dict, Any


def calculate_recall_at_k(retrieved_pages: List[int], relevant_pages: List[int]) -> float:
    """
    Recall@K: Measures the proportion of relevant document pages that were retrieved in top K.
    Formula: |Retrieved ∩ Relevant| / |Relevant|
    """
    if not relevant_pages:
        return 1.0  # If no relevant pages exist (e.g. unanswerable query), recall is trivially 1.0
    retrieved_set = set(retrieved_pages)
    relevant_set = set(relevant_pages)
    hits = len(retrieved_set.intersection(relevant_set))
    return hits / len(relevant_set)


def calculate_precision_at_k(retrieved_pages: List[int], relevant_pages: List[int]) -> float:
    """
    Precision@K: Measures the proportion of retrieved chunks/pages that are actually relevant.
    Formula: |Retrieved ∩ Relevant| / K
    """
    if not retrieved_pages:
        return 0.0
    retrieved_set = set(retrieved_pages)
    relevant_set = set(relevant_pages)
    hits = len(retrieved_set.intersection(relevant_set))
    return hits / len(retrieved_pages)


def calculate_mrr(retrieved_pages: List[int], relevant_pages: List[int]) -> float:
    """
    MRR (Mean Reciprocal Rank): 1 / rank of the first relevant retrieved result.
    Returns 0.0 if no relevant page is found in retrieved results.
    """
    relevant_set = set(relevant_pages)
    if not relevant_set:
        return 1.0

    for rank, page in enumerate(retrieved_pages, start=1):
        if page in relevant_set:
            return 1.0 / rank
    return 0.0


def calculate_ndcg(retrieved_pages: List[int], relevant_pages: List[int]) -> float:
    """
    NDCG (Normalized Discounted Cumulative Gain): Measures ranking quality by placing
    higher emphasis on relevant items appearing at the top of the ranked list.
    """
    relevant_set = set(relevant_pages)
    if not relevant_set:
        return 1.0

    dcg = 0.0
    for rank, page in enumerate(retrieved_pages, start=1):
        if page in relevant_set:
            dcg += 1.0 / math.log2(rank + 1)

    # Ideal DCG: perfect ranking where all relevant items come first
    idcg = sum(1.0 / math.log2(rank + 1) for rank in range(1, len(relevant_set) + 1))
    return dcg / idcg if idcg > 0 else 0.0


def calculate_top_k_accuracy(retrieved_pages: List[int], relevant_pages: List[int]) -> float:
    """
    Top-K Accuracy: Binary 1.0 if AT LEAST ONE relevant page appears in top K, else 0.0.
    Note: For single-item target queries, Top-K Accuracy is mathematically identical to Recall@K.
    """
    relevant_set = set(relevant_pages)
    if not relevant_set:
        return 1.0
    for page in retrieved_pages:
        if page in relevant_set:
            return 1.0
    return 0.0
