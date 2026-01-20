# app/routes/__init__.py
# This makes the routes directory a package

# Import all routers to make them available
from .auth import router as auth_router
from .teachers import router as teachers_router
from .approvals import router as approvals_router
from .training import router as training_router

__all__ = ["auth_router", "teachers_router", "approvals_router", "training_router"]