"""
Aarambh Institute Backend — Storage Helpers
"""
import os
import uuid
from django.utils import timezone

def get_upload_path(instance, filename):
    """
    Generates a secure UUID-based upload path.
    Example: profiles/2026/06/f47ac10b-58cc-4372-a567-0e02b2c3d479.pdf
    """
    ext = filename.split('.')[-1]
    new_filename = f"{uuid.uuid4()}.{ext}"
    
    # Get model name for base directory
    model_name = instance.__class__.__name__.lower()
    
    # Append Year/Month
    date_path = timezone.now().strftime("%Y/%m")
    
    return os.path.join(model_name, date_path, new_filename)
