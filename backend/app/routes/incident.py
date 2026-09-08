from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.incident import Incident
from app.models.agent_run import AgentRun
from app.models.analysis import Analysis
from app.models.user import User

from app.schemas.incident import (
    IncidentCreate,
    IncidentResponse,
    IncidentUpdate,
)

from app.services.agent_service import (
    run_incident_response_agent,
)

from app.services.ai_service import (
    analyze_security_incident,
)

from app.utils.dependencies import (
    get_current_user,
)


router = APIRouter(
    prefix="/incidents",
    tags=["Incidents"],
)


def get_user_incident(
    incident_id: int,
    user_id: int,
    db: Session,
):
    return (
        db.query(Incident)
        .filter(
            Incident.id == incident_id,
            Incident.user_id == user_id,
        )
        .first()
    )


@router.post(
    "/",
    response_model=IncidentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_incident(
    incident_data: IncidentCreate,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    incident = Incident(
        user_id=current_user.id,
        title=incident_data.title.strip(),
        description=incident_data.description.strip(),
        source=incident_data.source,
    )

    db.add(incident)
    db.commit()
    db.refresh(incident)

    return incident


@router.get(
    "/",
    response_model=list[IncidentResponse],
)
def get_incidents(
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    return (
        db.query(Incident)
        .filter(
            Incident.user_id ==
            current_user.id
        )
        .order_by(
            Incident.created_at.desc()
        )
        .all()
    )


@router.get(
    "/{incident_id}",
    response_model=IncidentResponse,
)
def get_incident(
    incident_id: int,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    incident = get_user_incident(
        incident_id,
        current_user.id,
        db,
    )

    if incident is None:
        raise HTTPException(
            status_code=404,
            detail="Incident not found",
        )

    return incident


@router.put(
    "/{incident_id}",
    response_model=IncidentResponse,
)
def update_incident(
    incident_id: int,
    incident_data: IncidentUpdate,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    incident = get_user_incident(
        incident_id,
        current_user.id,
        db,
    )

    if incident is None:
        raise HTTPException(
            status_code=404,
            detail="Incident not found",
        )

    update_data = incident_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(
            incident,
            field,
            value,
        )

    db.commit()
    db.refresh(incident)

    return incident


@router.post(
    "/{incident_id}/analyze",
    response_model=IncidentResponse,
)
def analyze_incident(
    incident_id: int,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    incident = get_user_incident(
        incident_id,
        current_user.id,
        db,
    )

    if incident is None:
        raise HTTPException(
            status_code=404,
            detail="Incident not found",
        )

    try:
        result = analyze_security_incident(
            title=incident.title,
            description=incident.description,
        )

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

        analysis = Analysis(
            incident_id=incident.id,
            user_id=current_user.id,
            threat_type=incident.threat_type,
            severity=incident.severity,
            confidence=incident.confidence,
            indicators=incident.indicators,
            impact=incident.impact,
            ai_analysis=incident.ai_analysis,
            response_plan=incident.response_plan,
            rag_sources=result.get(
                "_rag_sources",
                [],
            ),
        )

        db.add(analysis)
        db.commit()
        db.refresh(incident)

        return incident

    except Exception as exc:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"AI analysis failed: {exc}",
        )


@router.post(
    "/{incident_id}/agent-run",
)
def run_incident_agent(
    incident_id: int,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    incident = get_user_incident(
        incident_id,
        current_user.id,
        db,
    )

    if incident is None:
        raise HTTPException(
            status_code=404,
            detail="Incident not found",
        )

    try:
        agent_result =run_incident_response_agent(
                title=incident.title,
                description=incident.description,
            )

        analysis =agent_result.get(
                "analysis",
                {},
            )

        incident.threat_type = analysis.get(
            "threat_type",
            incident.threat_type,
        )

        incident.severity = analysis.get(
            "severity",
            incident.severity,
        )

        incident.indicators = analysis.get(
            "indicators",
            incident.indicators or [],
        )

        incident.impact = analysis.get(
            "impact",
            incident.impact,
        )

        incident.confidence = analysis.get(
            "confidence",
            incident.confidence,
        )

        incident.ai_analysis = analysis.get(
            "ai_analysis",
            incident.ai_analysis,
        )

        incident.response_plan = analysis.get(
            "response_plan",
            incident.response_plan,
        )

        incident.status = "investigating"


        agent_run = AgentRun(
            incident_id=incident.id,
            user_id=current_user.id,
            status="completed",
            steps=agent_result.get(
                "agent_steps",
                [],
            ),
            rag_sources=agent_result.get(
                "rag",
                {},
            ).get(
                "sources",
                [],
            ),
            result=agent_result,
        )

        db.add(agent_run)

        db.commit()
        db.refresh(incident)


        agent_result["incident_id"] = (
            incident.id
        )

        agent_result[
            "agent_run_id"
        ] = agent_run.id

        agent_result[
            "saved_to_database"
        ] = True

        return agent_result

    except Exception as exc:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=(
                "AI agent execution failed: "
                f"{exc}"
            ),
        )


@router.delete(
    "/{incident_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_incident(
    incident_id: int,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    incident = get_user_incident(
        incident_id,
        current_user.id,
        db,
    )

    if incident is None:
        raise HTTPException(
            status_code=404,
            detail="Incident not found",
        )

    db.delete(incident)
    db.commit()

    return None