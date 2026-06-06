"""
Aarambh Institute Backend — Validators
"""
import re
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

def validate_phone_number(value):
    """
    Validate that the phone number is 10-15 digits, optionally starting with +
    """
    pattern = re.compile(r'^\+?1?\d{9,15}$')
    if not pattern.match(value):
        raise ValidationError(
            _('%(value)s is not a valid phone number. It must be 10-15 digits.'),
            params={'value': value},
        )
