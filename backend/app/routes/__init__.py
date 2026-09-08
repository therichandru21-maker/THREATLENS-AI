from app.routes.auth import (
    router as auth_router,
)

from app.routes.incident import (
    router as incident_router,
)

from app.routes.analysis import (
    router as analysis_router,
)

from app.routes.analytics import (
    router as analytics_router,
)


__all__ = [
    "auth_router",
    "incident_router",
    "analysis_router",
    "analytics_router",
]