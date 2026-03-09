# HRMS Lite — Full-Stack Human Resource Management System

A lightweight HRMS application for managing employee records and tracking daily attendance.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React + Vite, Vanilla CSS |
| **Backend** | Python FastAPI (async), SQLAlchemy |
| **Database** | PostgreSQL (asyncpg) |
| **Migrations** | Alembic |
| **Dependency Mgmt** | uv (backend), npm (frontend) |

## Project Structure

```
├── backend_hrms/       # FastAPI backend
│   ├── app/
│   │   ├── api/        # Route definitions
│   │   ├── handlers/   # Business logic
│   │   ├── models/     # SQLAlchemy ORM models
│   │   ├── schemas/    # Pydantic validation schemas
│   │   └── utils/      # Decorators, messages
│   └── alembic/        # Database migrations
├── frontend_hrms/      # React frontend
│   └── src/
│       ├── api/        # Axios API client
│       ├── components/ # Reusable UI components
│       ├── hooks/      # Custom React hooks
│       ├── context/    # Toast notification context
│       └── pages/      # Route-level pages
```

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- [uv](https://docs.astral.sh/uv/) (Python package manager)

### Backend Setup

```bash
cd backend_hrms

# Install dependencies
uv sync

# Create .env from example
cp .env.example .env
# Edit .env with your DB credentials

# Run database migrations
uv run alembic upgrade head

# Start the server
uv run uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend_hrms

# Install dependencies
npm install

# Create .env from example (optional)
cp .env.example .env

# Start dev server
npm run dev
```

### Access the App
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## Features

- ✅ Employee CRUD (Create, Read, Delete)
- ✅ Daily attendance tracking (Present / Absent)
- ✅ Dashboard with real-time statistics
- ✅ Department-wise employee breakdown
- ✅ Search & filter employees
- ✅ Date & status filters for attendance
- ✅ Async APIs with connection pooling
- ✅ Centralized error handling decorator
- ✅ User-friendly validation messages
- ✅ Responsive dark-themed UI
