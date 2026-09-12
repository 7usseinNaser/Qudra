class AppError(Exception):
    """Base class for all expected, handled application errors."""

    status_code: int = 400
    detail: str = "An error occurred."

    def __init__(self, detail: str | None = None):
        if detail:
            self.detail = detail
        super().__init__(self.detail)


class EmailAlreadyRegisteredError(AppError):
    status_code = 409
    detail = "A user with this email already exists."


class InvalidCredentialsError(AppError):
    status_code = 401
    detail = "Incorrect email or password."


class InactiveUserError(AppError):
    status_code = 403
    detail = "This user account is inactive."


class NotAuthenticatedError(AppError):
    status_code = 401
    detail = "Could not validate credentials."


class CapabilityNotFoundError(AppError):
    status_code = 404
    detail = "Capability not found."


class CapabilityAlreadyExistsError(AppError):
    status_code = 409
    detail = "A capability with this name already exists."


class ProjectNotFoundError(AppError):
    status_code = 404
    detail = "Project not found."


class ProjectAccessDeniedError(AppError):
    status_code = 403
    detail = "You do not have access to this project."


class ProjectCapabilityAlreadyExistsError(AppError):
    status_code = 409
    detail = "This capability is already tagged on the project."


class EvidenceValidationError(AppError):
    status_code = 422
    detail = "Invalid evidence payload."


class ProblemNotFoundError(AppError):
    status_code = 404
    detail = "Problem not found."


class ProblemAccessDeniedError(AppError):
    status_code = 403
    detail = "You do not have access to this problem."


class ProblemAnalysisFailedError(AppError):
    status_code = 422
    detail = "Failed to analyze problem."

