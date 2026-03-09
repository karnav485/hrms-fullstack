"""HRMS Lite — FastAPI Application Entry Point."""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import ValidationError

from app.config import get_settings
from app.api import employee, attendance, dashboard

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan — startup and shutdown events."""
    logger.info("🚀 HRMS Lite is starting up...")
    yield
    logger.info("👋 HRMS Lite is shutting down...")


app = FastAPI(
    title="HRMS Lite API",
    description="A lightweight Human Resource Management System for managing employees and tracking attendance.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware — allow frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global validation error handler for Pydantic validation errors
@app.exception_handler(ValidationError)
async def validation_exception_handler(request: Request, exc: ValidationError):
    """Convert Pydantic validation errors to user-friendly messages."""
    errors = []
    for error in exc.errors():
        field = " → ".join(str(loc) for loc in error["loc"])
        errors.append(f"{field}: {error['msg']}")

    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "message": "Please fix the following issues and try again.",
            "data": errors,
        },
    )


@app.exception_handler(RequestValidationError)
async def request_validation_exception_handler(request: Request, exc: RequestValidationError):
    """Convert FastAPI request validation errors to user-friendly messages."""
    errors = []
    for error in exc.errors():
        field = " → ".join(str(loc) for loc in error["loc"] if loc != "body")
        msg = error["msg"]
        # Clean up Pydantic's internal messages
        if "Value error," in msg:
            msg = msg.replace("Value error, ", "")
        errors.append(f"{field}: {msg}" if field else msg)

    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "message": "Please fix the following issues and try again.",
            "data": errors,
        },
    )


# Register routers
app.include_router(employee.router)
app.include_router(attendance.router)
app.include_router(dashboard.router)


@app.get("/", tags=["Health"])
async def health_check():
    """Health check endpoint."""
    return {
        "success": True,
        "message": "HRMS Lite API is running",
        "version": "1.0.0",
    }
