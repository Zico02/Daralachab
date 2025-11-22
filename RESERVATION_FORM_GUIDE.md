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

### Future Enhancements (Recommended)
You can enhance the reservation system by:

1. **Email Notifications**:
   - Send email to restaurant when a new reservation is made
   - Send confirmation email to customer
   - Add email service (e.g., SendGrid, AWS SES) in `backend/server.py`

2. **SMS Notifications**:
   - Send SMS to restaurant phone number
   - Use services like Twilio

3. **Admin Dashboard**:
   - Create a web interface to view and manage reservations
   - Add features like: approve/reject, mark as confirmed, etc.

4. **Calendar Integration**:
   - Integrate with Google Calendar
   - Automatically create calendar events for reservations

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

