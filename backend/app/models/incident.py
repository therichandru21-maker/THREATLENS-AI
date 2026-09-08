from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Incident(Base):
    __tablename__ = "incidents"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    source: Mapped[str] = mapped_column(
        String(100),
        default="manual",
        nullable=False,
    )

    threat_type: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    severity: Mapped[str] = mapped_column(
        String(20),
        default="medium",
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="open",
        nullable=False,
    )

    indicators: Mapped[list | None] = mapped_column(
        JSON,
        nullable=True,
    )

    impact: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    confidence: Mapped[float | None] = mapped_column(
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

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )