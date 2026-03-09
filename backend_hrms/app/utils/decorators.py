"""
Exception handler decorator for all API endpoints.

This decorator wraps every route handler to provide:
- Consistent error response format
- User-friendly error messages
- Proper HTTP status codes
- Centralized logging of unexpected errors
"""

import logging
from functools import wraps
from typing import Callable

from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError

from app.utils.messages import ErrorMessages

logger = logging.getLogger(__name__)


def handle_exceptions(func: Callable) -> Callable:
    """
    Decorator that catches all exceptions in API route handlers
    and converts them to user-friendly HTTP responses.

    Usage:
        @router.post("/employees")
        @handle_exceptions
        async def create_employee(...):
            ...
    """

    @wraps(func)
    async def wrapper(*args, **kwargs):
        try:
            return await func(*args, **kwargs)

        except HTTPException:
            # Re-raise FastAPI HTTPExceptions as-is (already user-friendly)
            raise

        except IntegrityError as e:
            error_msg = str(e.orig) if e.orig else str(e)
            logger.warning(f"Integrity error in {func.__name__}: {error_msg}")

            # Parse the constraint violation to give a user-friendly message
            if "employee_id" in error_msg.lower() or "uq_employee_id" in error_msg.lower():
                raise HTTPException(
                    status_code=409,
                    detail=ErrorMessages.EMPLOYEE_ID_EXISTS.format("provided")
                )
            elif "email" in error_msg.lower():
                raise HTTPException(
                    status_code=409,
                    detail=ErrorMessages.EMAIL_EXISTS.format("provided")
                )
            elif "attendance" in error_msg.lower() or "uq_employee_date" in error_msg.lower():
                raise HTTPException(
                    status_code=409,
                    detail=ErrorMessages.ATTENDANCE_EXISTS.format("employee", "the given date")
                )
            else:
                raise HTTPException(
                    status_code=409,
                    detail="A record with the same unique value already exists."
                )

        except ValueError as e:
            logger.warning(f"Validation error in {func.__name__}: {str(e)}")
            raise HTTPException(
                status_code=400,
                detail=str(e)
            )

        except Exception as e:
            logger.error(f"Unexpected error in {func.__name__}: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=500,
                detail=ErrorMessages.INTERNAL_ERROR
            )

    return wrapper
