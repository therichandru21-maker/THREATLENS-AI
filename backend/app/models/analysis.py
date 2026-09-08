from datetime import datetime

from sqlalchemy import (
    DateTime,
    ForeignKey,
    Integer,
    JSON,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Analysis(Base):
    __tablename__ = "analyses"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    incident_id: Mapped[int] = mapped_column(
        ForeignKey(
            "incidents.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    threat_type: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    severity: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    confidence: Mapped[float | None] = mapped_column(
        nullable=True,
    )

    indicators: Mapped[list | None] = mapped_column(
        JSON,
        nullable=True,
    )

    impact: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    ai_analysis: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    response_plan: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    rag_sources: Mapped[list | None] = mapped_column(
        JSON,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )