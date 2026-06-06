"""
Aarambh Institute Backend — SMS Abstraction
"""
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

def send_sms(phone_number, message):
    """
    Sends an SMS via the configured backend.
    """
    backend = getattr(settings, 'SMS_BACKEND', 'console')
    
    if backend == 'console':
        logger.info(f"--- SMS TO {phone_number} ---")
        logger.info(message)
        logger.info("---------------------------")
        return True
    
    elif backend == 'twilio':
        try:
            from twilio.rest import Client
            client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
            
            # Twilio requires E.164 format. Ensure it starts with '+'
            if not phone_number.startswith('+'):
                 phone_number = f"+91{phone_number}" # Default to India
                 
            client.messages.create(
                body=message,
                from_=settings.TWILIO_FROM_NUMBER,
                to=phone_number
            )
            return True
        except Exception as e:
            logger.error(f"Failed to send SMS to {phone_number}: {e}")
            return False
            
    else:
        logger.warning(f"Unknown SMS backend: {backend}")
        return False
