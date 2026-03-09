"""Dashboard API endpoint — thin route layer delegating to handler."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.response import APIResponse
from app.utils.decorators import handle_exceptions
from app.handlers.dashboard import handle_get_dashboard_summary

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/summary", response_model=APIResponse)
@handle_exceptions
async def get_dashboard_summary(db: AsyncSession = Depends(get_db)):
    """Get dashboard summary with employee count, today's attendance, and department breakdown."""
    return await handle_get_dashboard_summary(db)
