from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.analysis import Analysis
from app.models.incident import Incident
from app.models.user import User
from app.schemas.analysis import AnalysisResponse
from app.services.ai_service import (
    analyze_security_incident,
)
from app.utils.dependencies import (
    get_current_user,
)


router = APIRouter(
    prefix="/analysis",
    tags=["AI Analysis"],
)


@router.post(
    "/incidents/{incident_id}",
    response_model=AnalysisResponse,
)
def create_analysis(
    incident_id: int,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    incident = (
        db.query(Incident)
        .filter(
            Incident.id == incident_id,
            Incident.user_id ==
            current_user.id,
        )
        .first()
    )

    if incident is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Incident not found",
        )

    try:
        result = analyze_security_incident(
            title=incident.title,
            description=incident.description,
        )

        analysis = Analysis(
            incident_id=incident.id,
            user_id=current_user.id,
            threat_type=result.get(
                "threat_type"
            ),
            severity=result.get(
                "severity",
                "medium",
            ),
            confidence=result.get(
                "confidence"
            ),
            indicators=result.get(
                "indicators",
                [],
            ),
            impact=result.get(
                "impact"
            ),
            ai_analysis=result.get(
                "ai_analysis"
            ),
            response_plan=result.get(
                "response_plan"
            ),
            rag_sources=result.get(
                "_rag_sources",
                [],
            ),
        )

        db.add(analysis)

        incident.threat_type = result.get(
            "threat_type"
        )
        incident.severity = result.get(
            "severity",
            "medium",
        )
        incident.indicators = result.get(
            "indicators",
            [],
        )
        incident.impact = result.get(
            "impact"
        )
        incident.confidence = result.get(
            "confidence"
        )
        incident.ai_analysis = result.get(
            "ai_analysis"
        )
        incident.response_plan = result.get(
            "response_plan"
        )
        incident.status = "investigating"

        db.commit()
        db.refresh(analysis)

        return analysis

    except Exception as exc:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"AI analysis failed: {exc}",
        )