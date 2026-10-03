# QUDRA Backend - Project Specification

## 1. Executive Summary & Vision
QUDRA is an enterprise capability management and skill verification system. The platform allows organizations to record member capabilities, match capabilities to active projects, and submit/verify evidence of technical competence.

## 2. Technical Stack
- **Framework**: FastAPI (Python 3.13)
- **Database**: PostgreSQL with SQLAlchemy 2.x ORM
- **Migrations**: Alembic
- **Validation & Settings**: Pydantic 2.x & Pydantic-Settings
- **Security & Auth**: JWT (pyjwt / python-jose), Passlib with Bcrypt password hashing
- **Deployment & Containerization**: Docker & Docker Compose
- **Testing**: Pytest & HTTPX TestClient

## 3. Phased Roadmap
- **Phase 1: Core System & User Authentication**
  - FastAPI application bootstrap with CORS & exception handlers
  - PostgreSQL integration via SQLAlchemy 2.x async/sync session management
  - Environment-based configuration with Pydantic BaseSettings
  - Docker & Docker-Compose configuration for app and PostgreSQL database
  - User model & migrations (UUID primary keys, email indexing, created/updated timestamps)
  - Authentication endpoints (`POST /api/v1/auth/register`, `POST /api/v1/auth/login`)
  - Authenticated user profile endpoint (`GET /api/v1/users/me`)
  - System health check endpoint (`GET /health`)
- **Phase 2: Capability Management & Skill Matrix** (Pending)
- **Phase 3: Project Allocation & Skill Matching** (Pending)
- **Phase 4: Evidence Submission & Verification Workflow** (Pending)
- **Phase 5: Analytics & Reporting** (Pending)

## 4. Security Principles
- All secrets and configuration read from environment variables (`.env`).
- Passwords stored exclusively using salted Bcrypt hashes.
- Bearer JWT tokens used for API authorization.
