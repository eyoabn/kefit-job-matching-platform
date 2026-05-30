from typing import Union
import re

def validate_budget(value: Union[int, float]) -> float:
    """
    Validate budget value.
    Must be a positive number.
    """
    try:
        budget = float(value)
    except (ValueError, TypeError):
        raise ValueError("Budget must be a number")
    
    if budget <= 0:
        raise ValueError("Budget must be greater than zero")
    
    return budget


def validate_rating(value: Union[int, float]) -> int:
    """
    Validate rating value.
    Must be an integer between 1 and 5 inclusive.
    """
    try:
        rating = int(value)
    except (ValueError, TypeError):
        raise ValueError("Rating must be an integer")
    
    if rating < 1 or rating > 5:
        raise ValueError("Rating must be between 1 and 5")
    
    return rating


def validate_email_format(email: str) -> str:
    """
    Validate email format.
    Returns the email if valid, otherwise raises ValueError.
    """
    # Basic email regex pattern
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(pattern, email):
        raise ValueError("Invalid email format")
    return email


def validate_file_type(mime: str) -> bool:
    """
    Validate file MIME type.
    Returns True if MIME type is allowed, False otherwise.
    """
    from src.utils.constants import ALLOWED_MIME_TYPES
    return mime in ALLOWED_MIME_TYPES