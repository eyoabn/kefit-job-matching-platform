from fastapi import HTTPException, status


class DuplicateBidException(HTTPException):
    """Raised when a user tries to place a duplicate bid on a job."""
    def __init__(self, detail: str = "You have already placed a bid on this job"):
        super().__init__(status_code=status.HTTP_409_CONFLICT, detail=detail)


class ConcurrentHireException(HTTPException):
    """Raised when there's a concurrent hire attempt on a job."""
    def __init__(self, detail: str = "Another user is currently hiring for this job"):
        super().__init__(status_code=status.HTTP_409_CONFLICT, detail=detail)


class UnauthorizedAccessException(HTTPException):
    """Raised when a user attempts to access a resource without proper permissions."""
    def __init__(self, detail: str = "You do not have permission to access this resource"):
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail=detail)


class ResourceNotFoundException(HTTPException):
    """Raised when a requested resource is not found."""
    def __init__(self, detail: str = "Resource not found"):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)


class InvalidCredentialsException(HTTPException):
    """Raised when provided credentials are invalid."""
    def __init__(self, detail: str = "Invalid email or password"):
        super().__init__(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail)


class ContractStateException(HTTPException):
    """Raised when an operation is invalid due to the current state of a contract."""
    def __init__(self, detail: str = "Invalid contract state for this operation"):
        super().__init__(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=detail)