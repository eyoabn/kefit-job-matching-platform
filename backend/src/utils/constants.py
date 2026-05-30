# API version prefix
API_V1_PREFIX = "/api/v1"

# Token types
TOKEN_TYPE_ACCESS = "access"
TOKEN_TYPE_REFRESH = "refresh"

# Pagination defaults
DEFAULT_PAGE = 1
DEFAULT_LIMIT = 20
MAX_LIMIT = 100

# File upload limits
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
ALLOWED_MIME_TYPES = {
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
    "text/plain",
}