"""
Aarambh Institute Backend — Standard JSON Renderer & Exception Handler
All API responses follow the format:
  Success: { "success": true, "data": {...}, "message": "...", "pagination": {...} }
  Error:   { "success": false, "error": { "code": "...", "message": "...", "details": {...} } }
"""
import logging

from rest_framework import status
from rest_framework.exceptions import (
    AuthenticationFailed,
    MethodNotAllowed,
    NotAuthenticated,
    NotFound,
    PermissionDenied,
    Throttled,
    ValidationError,
)
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.views import exception_handler

logger = logging.getLogger(__name__)


class StandardJSONRenderer(JSONRenderer):
    """
    Wraps all DRF responses in a standard envelope:
    { "success": bool, "data": ..., "message": str, "pagination": {...} }
    """

    def render(self, data, accepted_media_type=None, renderer_context=None):
        renderer_context = renderer_context or {}
        response = renderer_context.get("response")

        if response is None:
            return super().render(data, accepted_media_type, renderer_context)

        status_code = response.status_code
        is_success = status.is_success(status_code)

        if is_success:
            # Check if paginated response
            if isinstance(data, dict) and "results" in data and "count" in data:
                envelope = {
                    "success": True,
                    "data": data["results"],
                    "message": None,
                    "pagination": {
                        "count": data.get("count"),
                        "next": data.get("next"),
                        "previous": data.get("previous"),
                        "page_size": len(data["results"]) if data.get("results") else 0,
                    },
                }
            else:
                envelope = {
                    "success": True,
                    "data": data,
                    "message": None,
                }
        else:
            # Error response
            if isinstance(data, dict):
                detail = data.get("detail", data)
                message = str(detail) if not isinstance(detail, dict) else "Request failed"
                error_details = data if isinstance(data, dict) else {"detail": str(data)}
            else:
                message = str(data)
                error_details = {}

            envelope = {
                "success": False,
                "error": {
                    "code": _get_error_code(status_code),
                    "message": message,
                    "details": error_details,
                },
            }

        return super().render(envelope, accepted_media_type, renderer_context)


def _get_error_code(status_code: int) -> str:
    """Map HTTP status codes to error codes."""
    codes = {
        400: "VALIDATION_ERROR",
        401: "UNAUTHORIZED",
        403: "FORBIDDEN",
        404: "NOT_FOUND",
        405: "METHOD_NOT_ALLOWED",
        409: "CONFLICT",
        429: "RATE_LIMIT_EXCEEDED",
        500: "INTERNAL_SERVER_ERROR",
    }
    return codes.get(status_code, f"HTTP_{status_code}")


def custom_exception_handler(exc, context):
    """
    Custom DRF exception handler that ensures all errors
    go through StandardJSONRenderer format.
    """
    response = exception_handler(exc, context)

    if response is not None:
        return response

    # Handle unexpected exceptions
    logger.exception("Unhandled exception: %s", exc)
    return Response(
        {"detail": "An unexpected error occurred. Please try again."},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
