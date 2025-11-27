# Guide: How the Reservation Form Works

## Overview
The reservation form on the website allows customers to book a table at Dar Al Achab restaurant. When a customer submits the form, the reservation data is sent to the backend API and stored in MongoDB.

## How It Works

### Frontend (React)
1. **Form Location**: The reservation form is located in the "Contact" section of the website
2. **Form Fields**:
   - Nom Complet (Full Name) - Required
   - Téléphone (Phone) - Required
   - Email - Optional
   - Date - Required (minimum date is today)
   - Heure (Time) - Required (between 12:30 and 22:30)
   - Nombre de Personnes (Number of People) - Required (1-20)
   - Message - Optional

3. **Form Submission**:
   - When the user clicks "Envoyer la Réservation" (Send Reservation)
   - The form data is validated
   - Data is sent via POST request to: `http://localhost:8000/api/reservations`
   - On success, a success message is shown and the form is reset
   - On error, the error is logged but a success message is still shown (for better UX)

### Backend (FastAPI)
1. **API Endpoint**: `POST /api/reservations`
2. **Data Storage**: Reservations are stored in MongoDB in the `reservations` collection
3. **Data Structure**:
   ```json
   {
     "id": "unique-uuid",
     "name": "Customer Name",
     "phone": "Phone Number",
     "email": "email@example.com" (optional),
     "date": "2025-11-27",
     "time": "19:30",
     "persons": 4,
     "message": "Special requests" (optional),
     "timestamp": "2025-11-17T10:30:00Z"
   }
   ```

4. **Logging**: Each reservation is logged in the backend console with customer details

## Where Reservations Are Sent

### Current Implementation
- **Database**: MongoDB collection named `reservations`
- **Location**: The database is configured in `backend/.env` file
- **Access**: You can view reservations by:
  1. Accessing MongoDB directly
  2. Using the API endpoint: `GET http://localhost:8000/api/reservations`

### Email Notifications (Now Implemented)

Email notifications are now automatically sent when a reservation is created:

1. **Restaurant Owner Email**: Sent to the email configured in `EMAIL_TO` environment variable
2. **Customer Confirmation Email**: Optional confirmation email sent to the customer (if email is provided in the form)

**Configuration**:
To enable email notifications, add the following to your `backend/.env` file:
```env
EMAIL_ENABLED=true
EMAIL_FROM=noreply@daralachab.ma
EMAIL_TO=owner@daralachab.ma
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-password
```

**Email Content**:
- **Subject**: "Nouvelle Réservation – Dar Al Achab"
- **Body includes**: Name, phone, email, date, time, number of persons, message

**Note**: If email sending fails, the reservation is still saved successfully. Errors are logged but don't break the API.

### SMS Notifications (Now Implemented)

SMS notifications can be sent to the restaurant phone number when a reservation is created.

**Configuration**:
To enable SMS notifications, add the following to your `backend/.env` file:
```env
SMS_ENABLED=true
SMS_ACCOUNT_SID=your-twilio-account-sid
SMS_AUTH_TOKEN=your-twilio-auth-token
SMS_FROM_NUMBER=+1234567890
SMS_TO_NUMBER=+212612345678
```

**SMS Content**:
"Nouvelle réservation: {date} {time} - {persons} pers - {name} ({phone})"

**Note**: SMS notifications require a Twilio account. If SMS sending fails, the reservation is still saved successfully. Errors are logged but don't break the API.

### Admin Dashboard (Now Implemented)

An admin dashboard is now available at `/admin` to view all reservations.

**Features**:
- View all reservations in a table format
- Filter by date (today, future, all)
- Search by name, phone, or email
- View statistics about reservations
- Requires admin API key for access

**Access**: Navigate to `http://localhost:3000/admin` (or your production URL + `/admin`)

**Configuration**: Set `ADMIN_API_KEY` in `backend/.env` file. Use this key to log in to the admin dashboard.

See `HANDOVER_GUIDE.md` for more details on configuring and using the admin dashboard.

## Testing the Reservation Form

1. **Start the Backend**:
   ```bash
   cd backend
   python -m uvicorn server:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Start the Frontend**:
   ```bash
   cd frontend
   npm start
   ```

3. **Test the Form**:
   - Navigate to the Contact section
   - Fill out the form
   - Submit and check the backend console for the log message
   - Check MongoDB for the stored reservation

## Viewing Reservations

### Using the API
```bash
# Get all reservations
curl http://localhost:8000/api/reservations
```

### Using MongoDB
```bash
# Connect to MongoDB
mongosh

# Use the database
use dar_al_achab

# View reservations
db.reservations.find().pretty()
```

## Troubleshooting

1. **Form not submitting**:
   - Check browser console for errors
   - Verify backend is running on port 8000
   - Check CORS settings in `backend/server.py`

2. **Data not saving**:
   - Verify MongoDB is running
   - Check `backend/.env` file for correct MongoDB connection string
   - Check backend console for error messages

3. **CORS errors**:
   - Ensure `CORS_ORIGINS` in `.env` includes `http://localhost:3000`

