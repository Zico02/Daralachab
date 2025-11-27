"""
Email utility for sending reservation notifications.
Supports standard SMTP (smtplib) and can be extended to use services like SendGrid.
"""
import os
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional, Dict

logger = logging.getLogger(__name__)


def send_reservation_email(reservation: Dict, recipient_email: Optional[str] = None) -> bool:
    """
    Send email notification for a new reservation.
    
    Args:
        reservation: Dictionary containing reservation data (name, phone, email, date, time, persons, message)
        recipient_email: Optional customer email for confirmation. If None, sends to restaurant owner only.
    
    Returns:
        bool: True if email was sent successfully, False otherwise.
    """
    # Check if email is enabled
    if os.environ.get('EMAIL_ENABLED', 'false').lower() != 'true':
        logger.info("Email notifications are disabled (EMAIL_ENABLED=false)")
        return False
    
    # Get email configuration from environment variables
    email_from = os.environ.get('EMAIL_FROM')
    email_to = os.environ.get('EMAIL_TO')  # Restaurant owner email
    smtp_host = os.environ.get('SMTP_HOST')
    smtp_port = int(os.environ.get('SMTP_PORT', '587'))
    smtp_username = os.environ.get('SMTP_USERNAME')
    smtp_password = os.environ.get('SMTP_PASSWORD')
    
    # Validate required configuration
    if not all([email_from, email_to, smtp_host, smtp_username, smtp_password]):
        logger.warning("Email configuration incomplete. Missing required environment variables.")
        return False
    
    try:
        # Prepare email content
        subject = "Nouvelle Réservation – Dar Al Achab"
        
        # Build email body
        body = f"""
Nouvelle réservation reçue :

Nom : {reservation.get('name', 'N/A')}
Téléphone : {reservation.get('phone', 'N/A')}
Email : {reservation.get('email', 'Non fourni')}
Date : {reservation.get('date', 'N/A')}
Heure : {reservation.get('time', 'N/A')}
Nombre de personnes : {reservation.get('persons', 'N/A')}
Message : {reservation.get('message', 'Aucun message')}

---
Restaurant Dar Al Achab
"""
        
        # Create message
        msg = MIMEMultipart()
        msg['From'] = email_from
        msg['To'] = email_to
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain', 'utf-8'))
        
        # Send email to restaurant owner
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()  # Enable TLS encryption
            server.login(smtp_username, smtp_password)
            server.send_message(msg)
        
        logger.info(f"Email notification sent successfully to {email_to}")
        
        # Optionally send confirmation email to customer if email is provided
        if recipient_email and recipient_email.strip():
            try:
                customer_subject = "Confirmation de Réservation – Dar Al Achab"
                customer_body = f"""
Bonjour {reservation.get('name', '')},

Merci pour votre réservation au Restaurant Dar Al Achab.

Détails de votre réservation :
Date : {reservation.get('date', 'N/A')}
Heure : {reservation.get('time', 'N/A')}
Nombre de personnes : {reservation.get('persons', 'N/A')}

Nous avons hâte de vous accueillir !

Pour toute modification ou annulation, n'hésitez pas à nous contacter au 05 37 20 20 37.

Cordialement,
L'équipe Dar Al Achab
"""
                customer_msg = MIMEMultipart()
                customer_msg['From'] = email_from
                customer_msg['To'] = recipient_email
                customer_msg['Subject'] = customer_subject
                customer_msg.attach(MIMEText(customer_body, 'plain', 'utf-8'))
                
                with smtplib.SMTP(smtp_host, smtp_port) as server:
                    server.starttls()
                    server.login(smtp_username, smtp_password)
                    server.send_message(customer_msg)
                
                logger.info(f"Confirmation email sent successfully to {recipient_email}")
            except Exception as e:
                logger.error(f"Failed to send confirmation email to customer: {str(e)}")
                # Don't fail the whole process if customer email fails
        
        return True
        
    except Exception as e:
        logger.error(f"Failed to send email notification: {str(e)}")
        return False

