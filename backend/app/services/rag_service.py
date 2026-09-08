from pathlib import Path
from typing import Any

from sklearn.feature_extraction.text import (
    TfidfVectorizer,
)
from sklearn.metrics.pairwise import (
    cosine_similarity,
)


PROJECT_ROOT = Path(
    __file__
).resolve().parents[3]

KNOWLEDGE_BASE_DIR = (
    PROJECT_ROOT / "knowledge_base"
)

if not KNOWLEDGE_BASE_DIR.exists():
    KNOWLEDGE_BASE_DIR = (
        Path("/app") / "knowledge_base"
)


SUPPORTED_EXTENSIONS = {
    ".md",
    ".txt",
}


def load_documents() -> list[dict[str, str]]:
    documents = []

    if not KNOWLEDGE_BASE_DIR.exists():
        return documents

    for file_path in sorted(
        KNOWLEDGE_BASE_DIR.iterdir()
    ):
        if not file_path.is_file():
            continue

        if (
            file_path.suffix.lower()
            not in SUPPORTED_EXTENSIONS
        ):
            continue

        try:
            content = file_path.read_text(
                encoding="utf-8"
            ).strip()
        except UnicodeDecodeError:
            continue

        if not content:
            continue

        documents.append(
            {
                "source": file_path.name,
                "content": content,
            }
        )

    return documents


def split_into_chunks(
    text: str,
    chunk_size: int = 800,
    overlap: int = 150,
) -> list[str]:

    if not text.strip():
        return []

    if overlap >= chunk_size:
        raise ValueError(
            "overlap must be smaller than chunk_size"
        )

    words = text.split()

    chunks = []
    start = 0

    while start < len(words):
        end = min(
            start + chunk_size,
            len(words),
        )

        chunk = " ".join(
            words[start:end]
        ).strip()

        if chunk:
            chunks.append(chunk)

        if end >= len(words):
            break

        start = end - overlap

    return chunks


def build_knowledge_chunks():
    documents = load_documents()

    chunks = []

    for document in documents:
        document_chunks = split_into_chunks(
            document["content"]
        )

        for index, chunk in enumerate(
            document_chunks
        ):
            chunks.append(
                {
                    "source": document["source"],
                    "chunk_id": index,
                    "content": chunk,
                }
            )

    return chunks


def retrieve_relevant_context(
    query: str,
    top_k: int = 3,
):
    query = query.strip()

    if not query:
        return []

    chunks = build_knowledge_chunks()

    if not chunks:
        return []

    texts = [
        chunk["content"]
        for chunk in chunks
    ]

    vectorizer = TfidfVectorizer(
        lowercase=True,
        stop_words="english",
        ngram_range=(1, 2),
    )

    document_vectors = (
        vectorizer.fit_transform(texts)
    )

    query_vector = vectorizer.transform(
        [query]
    )

    similarities = cosine_similarity(
        query_vector,
        document_vectors,
    )[0]

    ranked_indexes = (
        similarities.argsort()[::-1]
    )

    results = []

    for index in ranked_indexes:
        score = float(
            similarities[index]
        )

        if score <= 0:
            continue

        result = chunks[index].copy()
        result["score"] = round(
            score,
            4,
        )

        results.append(result)

        if len(results) >= top_k:
            break

    return results


def format_rag_context(
    retrieved_chunks,
):
    if not retrieved_chunks:
        return (
            "No relevant knowledge-base "
            "information was found."
        )

    context_parts = []

    for index, chunk in enumerate(
        retrieved_chunks,
        start=1,
    ):
        context_parts.append(
            (
                f"SOURCE {index}: "
                f"{chunk['source']}\n"
                f"RELEVANCE SCORE: "
                f"{chunk['score']}\n\n"
                f"{chunk['content']}"
            )
        )

    return "\n\n---\n\n".join(
        context_parts
    )


def get_rag_context(
    query: str,
    top_k: int = 3,
) -> dict[str, Any]:

    retrieved_chunks = (
        retrieve_relevant_context(
            query,
            top_k,
        )
    )

    context = format_rag_context(
        retrieved_chunks
    )

    sources = list(
        dict.fromkeys(
            chunk["source"]
            for chunk in retrieved_chunks
        )
    )

    return {
        "context": context,
        "sources": sources,
        "results": retrieved_chunks,
    }