"""
SMS utility for sending reservation notifications via Twilio.
"""
import os
import logging
from typing import Dict, Optional

logger = logging.getLogger(__name__)

# Try to import Twilio, but don't fail if it's not installed
try:
    from twilio.rest import Client
    TWILIO_AVAILABLE = True
except ImportError:
    TWILIO_AVAILABLE = False
    logger.warning("Twilio not installed. SMS functionality will be disabled. Install with: pip install twilio")


def send_reservation_sms(reservation: Dict) -> bool:
    """
    Send SMS notification for a new reservation using Twilio.
    
    Args:
        reservation: Dictionary containing reservation data (name, phone, email, date, time, persons, message)
    
    Returns:
        bool: True if SMS was sent successfully, False otherwise.
    """
    # Check if SMS is enabled
    if os.environ.get('SMS_ENABLED', 'false').lower() != 'true':
        logger.info("SMS notifications are disabled (SMS_ENABLED=false)")
        return False
    
    # Check if Twilio is available
    if not TWILIO_AVAILABLE:
        logger.warning("Twilio library not installed. SMS notifications disabled.")
        return False
    
    # Get SMS configuration from environment variables
    account_sid = os.environ.get('SMS_ACCOUNT_SID')
    auth_token = os.environ.get('SMS_AUTH_TOKEN')
    sms_from = os.environ.get('SMS_FROM_NUMBER')
    sms_to = os.environ.get('SMS_TO_NUMBER')  # Restaurant phone number
    
    # Validate required configuration
    if not all([account_sid, auth_token, sms_from, sms_to]):
        logger.warning("SMS configuration incomplete. Missing required environment variables.")
        return False
    
    try:
        # Initialize Twilio client
        client = Client(account_sid, auth_token)
        
        # Build SMS message (keep it short - SMS has 160 character limit)
        name = reservation.get('name', 'N/A')
        date = reservation.get('date', 'N/A')
        time = reservation.get('time', 'N/A')
        persons = reservation.get('persons', 'N/A')
        phone = reservation.get('phone', 'N/A')
        
        # Format date for better readability (YYYY-MM-DD -> DD/MM/YYYY)
        try:
            date_parts = date.split('-')
            if len(date_parts) == 3:
                formatted_date = f"{date_parts[2]}/{date_parts[1]}/{date_parts[0]}"
            else:
                formatted_date = date
        except:
            formatted_date = date
        
        message_body = f"Nouvelle réservation: {formatted_date} {time} - {persons} pers - {name} ({phone})"
        
        # Send SMS
        message = client.messages.create(
            body=message_body,
            from_=sms_from,
            to=sms_to
        )
        
        logger.info(f"SMS notification sent successfully to {sms_to}. Message SID: {message.sid}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send SMS notification: {str(e)}")
        return False

