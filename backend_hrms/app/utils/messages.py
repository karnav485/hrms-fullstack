"""Centralized user-friendly messages for the entire application."""


class SuccessMessages:
    """User-friendly success messages."""

    EMPLOYEE_CREATED = "Employee '{}' has been added successfully"
    EMPLOYEE_DELETED = "Employee '{}' has been removed successfully"
    ATTENDANCE_MARKED = "Attendance marked as '{}' for {} on {}"


class ErrorMessages:
    """User-friendly error messages."""

    # Employee errors
    EMPLOYEE_NOT_FOUND = "We couldn't find an employee with ID '{}'. Please check and try again."
    EMPLOYEE_ID_EXISTS = "An employee with ID '{}' already exists. Please use a different Employee ID."
    EMAIL_EXISTS = "The email address '{}' is already registered with another employee."
    EMPLOYEE_HAS_ATTENDANCE = "Cannot delete employee '{}' as they have attendance records. Please remove their attendance records first."

    # Validation errors
    INVALID_EMAIL = "Please enter a valid email address (e.g., name@company.com)."
    REQUIRED_FIELD = "The field '{}' is required and cannot be empty."
    NAME_TOO_SHORT = "Full name must be at least 2 characters long."

    # Attendance errors
    ATTENDANCE_EXISTS = "Attendance for '{}' on {} has already been recorded. Each employee can only have one record per day."
    INVALID_STATUS = "Status must be either 'Present' or 'Absent'."
    FUTURE_DATE = "Attendance cannot be marked for a future date. Please select today or an earlier date."
    INVALID_DATE_FORMAT = "Please enter a valid date in YYYY-MM-DD format."

    # General errors
    INTERNAL_ERROR = "Something went wrong on our end. Please try again later."
    INVALID_REQUEST = "The request could not be processed. Please check your input and try again."
