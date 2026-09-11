from typing import Any

from app.services.ai_service import analyze_security_incident
from app.services.rag_service import get_rag_context


def run_incident_response_agent(
    title: str,
    description: str,
) -> dict[str, Any]:
    """
    ThreatLens AI incident-response agent.

    Agent workflow:

    1. Receive incident
    2. Retrieve relevant cybersecurity knowledge
    3. Analyze threat using Groq
    4. Determine severity and confidence
    5. Generate defensive response plan
    6. Return structured investigation result
    """

    # ---------------------------------------------------------
    # STEP 1: Normalize incident input
    # ---------------------------------------------------------

    normalized_title = title.strip()
    normalized_description = description.strip()

    if not normalized_title:
        raise ValueError("Incident title cannot be empty.")

    if not normalized_description:
        raise ValueError("Incident description cannot be empty.")

    # ---------------------------------------------------------
    # STEP 2: Retrieve relevant knowledge
    # ---------------------------------------------------------

    rag_query = (
        f"{normalized_title}. "
        f"{normalized_description}"
    )

    rag_result = get_rag_context(
        query=rag_query,
        top_k=3,
    )

    # ---------------------------------------------------------
    # STEP 3: Run AI threat analysis
    # ---------------------------------------------------------

    analysis = analyze_security_incident(
        title=normalized_title,
        description=normalized_description,
    )

    # ---------------------------------------------------------
    # STEP 4: Extract agent decision information
    # ---------------------------------------------------------

    severity = str(
        analysis.get(
            "severity",
            "medium",
        )
    ).lower()

    confidence = analysis.get(
        "confidence",
        0.0,
    )

    threat_type = analysis.get(
        "threat_type",
        "Unknown",
    )

    # ---------------------------------------------------------
    # STEP 5: Determine recommended next action
    # ---------------------------------------------------------

    if severity == "critical":
        next_action = (
            "Immediate containment and security-team escalation required."
        )

    elif severity == "high":
        next_action = (
            "Prioritize containment, investigation, and security-team review."
        )

    elif severity == "medium":
        next_action = (
            "Investigate the incident, apply defensive controls, and monitor."
        )

    else:
        next_action = (
            "Continue monitoring and document the incident for review."
        )

    # ---------------------------------------------------------
    # STEP 6: Build agent execution summary
    # ---------------------------------------------------------

    agent_steps = [
        {
            "step": 1,
            "name": "Incident Intake",
            "status": "completed",
            "description": (
                "Incident title and description validated."
            ),
        },
        {
            "step": 2,
            "name": "Knowledge Retrieval",
            "status": "completed",
            "description": (
                "Relevant cybersecurity knowledge retrieved "
                "from the ThreatLens AI knowledge base."
            ),
        },
        {
            "step": 3,
            "name": "Threat Analysis",
            "status": "completed",
            "description": (
                f"Potential threat classified as {threat_type}."
            ),
        },
        {
            "step": 4,
            "name": "Risk Assessment",
            "status": "completed",
            "description": (
                f"Incident severity assessed as {severity} "
                f"with confidence {confidence}."
            ),
        },
        {
            "step": 5,
            "name": "Response Planning",
            "status": "completed",
            "description": (
                "Defensive response recommendations generated."
            ),
        },
    ]

    # ---------------------------------------------------------
    # STEP 7: Return final agent result
    # ---------------------------------------------------------

    return {
        "agent_status": "completed",
        "incident": {
            "title": normalized_title,
            "description": normalized_description,
        },
        "analysis": analysis,
        "rag": {
            "sources": rag_result["sources"],
            "retrieved_chunks": len(
                rag_result["results"]
            ),
        },
        "risk": {
            "threat_type": threat_type,
            "severity": severity,
            "confidence": confidence,
        },
        "next_action": next_action,
        "agent_steps": agent_steps,
    }