# QUDRA Backend Architecture

## System Architecture

```
                    +-----------------------+
                    |      HTTP Client      |
                    +-----------+-----------+
                                |
                                v
                    +-----------------------+
                    |    FastAPI Router     |
                    +-----------+-----------+
                                |
                                v
                    +-----------------------+
                    |    Service Layer      |
                    +-----------+-----------+
                                |
                                v
                    +-----------------------+
                    |   Repository Layer    |
                    +-----------+-----------+
                                |
                                v
                    +-----------------------+
                    | SQLAlchemy 2.0 ORM    |
                    +-----------+-----------+
                                |
                                v
                    +-----------------------+
                    |  PostgreSQL Database  |
                    +-----------------------+
```

## Directory & Module Design
- `app/core/`: Application settings, security utilities (JWT, password hashing), and custom exception handlers.
- `app/db/`: Database configuration, session generator, Base model, and SQLAlchemy models.
- `app/dependencies/`: Reusable FastAPI dependencies (e.g., DB session injection, JWT authentication context).
- `app/repositories/`: Data access layer for database queries.
- `app/routers/`: API endpoints grouped by domain resources.
- `app/schemas/`: Pydantic models for request validation and response schemas.
- `app/services/`: Domain business logic and transaction boundaries.
- `tests/`: Automated unit and integration tests using Pytest and HTTPX.
