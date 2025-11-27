# Dar Al Achab - Restaurant Website

Full-stack web application for Dar Al Achab restaurant in Rabat, Morocco.

## Tech Stack

- **Frontend**: React (Create React App), Tailwind CSS, Shadcn/ui components
- **Backend**: FastAPI (Python)
- **Database**: MongoDB

## Features

- Restaurant website with menu, gallery, and contact information
- Online reservation system
- Email notifications for new reservations (configurable)
- SMS notifications via Twilio (configurable)
- Admin dashboard to view reservations
- Responsive design for mobile and desktop

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Python 3.11+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Dar-al-achab
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m pip install -r requirements.txt
   ```
   
   Create a `.env` file in the `backend/` directory (see `backend/.env.example`):
   ```env
   MONGO_URL=mongodb://localhost:27017
   DB_NAME=dar_al_achab
   CORS_ORIGINS=http://localhost:3000
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   # or
   yarn install
   ```

### Running the Application

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start Backend**
   ```bash
   cd backend
   python -m uvicorn server:app --reload --host 0.0.0.0 --port 8000
   ```

3. **Start Frontend**
   ```bash
   cd frontend
   npm start
   # or
   yarn start
   ```

The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:8000`.

## Environment Variables

See `backend/.env.example` for all available environment variables. Key variables include:

- `MONGO_URL`: MongoDB connection string
- `DB_NAME`: Database name
- `CORS_ORIGINS`: Allowed frontend origins (comma-separated)
- `EMAIL_ENABLED`: Enable/disable email notifications
- `SMS_ENABLED`: Enable/disable SMS notifications
- `ADMIN_API_KEY`: Secret key for admin dashboard access

## Documentation

- **Reservation Form**: See `RESERVATION_FORM_GUIDE.md`
- **Photo Upload**: See `PHOTO_UPLOAD_GUIDE.md`
- **Handover & Deployment**: See `HANDOVER_GUIDE.md`

## Admin Dashboard

Access the admin dashboard at `/admin` (e.g., `http://localhost:3000/admin`).

You'll need to enter the `ADMIN_API_KEY` configured in `backend/.env`.

The admin dashboard allows you to:
- View all reservations
- Filter by date (today, future, all)
- Search by name, phone, or email
- See statistics about reservations

## API Endpoints

- `POST /api/reservations` - Create a new reservation
- `GET /api/reservations` - Get all reservations (requires admin API key in `x-admin-key` header)

## Deployment

See `HANDOVER_GUIDE.md` for detailed deployment instructions, including:
- Setting up MongoDB Atlas
- Deploying FastAPI backend (Render, Railway, etc.)
- Deploying React frontend (Netlify, Vercel, etc.)
- Configuring domain and DNS

## License

© 2025 Restaurant Dar Al Achab – Tous droits réservés.
