from collections import Counter

from fastapi import (
    APIRouter,
    Depends,
)
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.incident import Incident
from app.models.user import User
from app.utils.dependencies import (
    get_current_user,
)


router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
)


@router.get("/summary")
def analytics_summary(
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    incidents = (
        db.query(Incident)
        .filter(
            Incident.user_id ==
            current_user.id
        )
        .all()
    )

    severity = Counter(
        (
            incident.severity or
            "medium"
        ).lower()
        for incident in incidents
    )

    status = Counter(
        (
            incident.status or
            "open"
        ).lower()
        for incident in incidents
    )

    threats = Counter(
        incident.threat_type or
        "Unclassified"
        for incident in incidents
    )

    confidence_values = [
        incident.confidence
        for incident in incidents
        if incident.confidence is not None
    ]

    average_confidence = (
        sum(confidence_values) /
        len(confidence_values)
        if confidence_values
        else 0
    )

    return {
        "total_incidents": len(
            incidents
        ),
        "severity": dict(severity),
        "status": dict(status),
        "threat_types": dict(threats),
        "ai_analyzed": sum(
            bool(
                incident.ai_analysis
            )
            for incident in incidents
        ),
        "average_confidence": round(
            average_confidence,
            4,
        ),
    }