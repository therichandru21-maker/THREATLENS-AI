import json

from groq import Groq

from app.config import settings
from app.services.rag_service import get_rag_context


client = Groq(
    api_key=settings.GROQ_API_KEY
)

MODEL_NAME = "openai/gpt-oss-20b"


def analyze_security_incident(
    title: str,
    description: str,
) -> dict:
    """
    Analyze a cybersecurity incident using:
    1. Local RAG knowledge retrieval
    2. Groq LLM
    """

    # ---------------------------------------------------------
    # STEP 1: Retrieve relevant cybersecurity knowledge
    # ---------------------------------------------------------

    rag_query = f"{title}. {description}"

    rag_result = get_rag_context(
        query=rag_query,
        top_k=3,
    )

    rag_context = rag_result["context"]
    rag_sources = rag_result["sources"]

    # ---------------------------------------------------------
    # STEP 2: Build AI prompt
    # ---------------------------------------------------------

    system_prompt = """
You are CyberSentinel AI, a defensive cybersecurity
incident analysis system.

Your responsibility is to help security analysts understand
and respond to cybersecurity incidents.

IMPORTANT SAFETY RULES:

- Focus only on defensive cybersecurity.
- Do not provide instructions for attacking systems.
- Do not provide exploit payloads.
- Do not provide malware creation instructions.
- Do not provide credential theft instructions.
- Recommend investigation, containment, remediation,
  monitoring, and recovery actions.
- Use the retrieved knowledge-base information when relevant.
- Do not invent evidence that is not present in the incident.
- Confidence must be between 0 and 1.

Return ONLY a valid JSON object.

Required JSON fields:

{
  "threat_type": "string",
  "severity": "low | medium | high | critical",
  "indicators": ["string"],
  "impact": "string",
  "confidence": 0.0,
  "ai_analysis": "string",
  "response_plan": "string"
}
"""

    user_prompt = f"""
Analyze this cybersecurity incident.

INCIDENT TITLE:
{title}

INCIDENT DESCRIPTION:
{description}

RETRIEVED KNOWLEDGE BASE:

{rag_context}

Analysis requirements:

1. Identify the most likely threat type.
2. Determine severity.
3. Extract indicators directly supported by the incident.
4. Explain potential impact.
5. Provide a confidence score from 0 to 1.
6. Explain your reasoning in a concise defensive analysis.
7. Provide a practical defensive response plan.
8. Use the knowledge base as supporting context.
"""

    # ---------------------------------------------------------
    # STEP 3: Call Groq
    # ---------------------------------------------------------

    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": user_prompt,
            },
        ],
        temperature=0.2,
        max_completion_tokens=1500,
        response_format={
            "type": "json_object"
        },
    )

    # ---------------------------------------------------------
    # STEP 4: Extract response
    # ---------------------------------------------------------

    text = response.choices[0].message.content

    if not text:
        raise ValueError(
            "Groq returned an empty response."
        )

    text = text.strip()

    # ---------------------------------------------------------
    # STEP 5: Parse JSON
    # ---------------------------------------------------------

    try:
        analysis = json.loads(text)
    except json.JSONDecodeError as exc:
        raise ValueError(
            f"Groq returned invalid JSON: {text}"
        ) from exc

    # ---------------------------------------------------------
    # STEP 6: Attach RAG source information
    # ---------------------------------------------------------

    analysis["_rag_sources"] = rag_sources

    return analysis