# Step-by-Step Setup Instructions - Dar Al Achab

## ✅ Completed Steps

1. **Backend Dependencies**: ✅ Installed (including Twilio)
2. **Frontend Dependencies**: ✅ Installed (using --legacy-peer-deps)
3. **Environment File**: ✅ Created (`backend/.env`)
4. **Admin API Key**: ✅ Generated and saved

## 📝 Next Steps

### Step 1: Configure MongoDB Connection

**Option A: Local MongoDB (if you have it installed)**
- The `.env` file already has `MONGO_URL=mongodb://localhost:27017`
- Make sure MongoDB is running on your machine

**Option B: MongoDB Atlas (Cloud - Recommended for production)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a free cluster (M0)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Update `backend/.env`:
   ```env
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 2: Start the Backend Server

Open a terminal and run:
```bash
cd backend
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
```

**Keep this terminal open!**

### Step 3: Start the Frontend Server

Open a **NEW** terminal window and run:
```bash
cd frontend
npm start
```

The browser should automatically open to `http://localhost:3000`

**Keep this terminal open too!**

### Step 4: Test the Application

1. **Test the Website**:
   - Browse the website at `http://localhost:3000`
   - Check all sections (Home, About, Menu, Gallery, Contact)

2. **Test the Reservation Form**:
   - Scroll to the Contact section
   - Fill out the reservation form
   - Submit it
   - Check the backend terminal for the log message

3. **Test the Admin Dashboard**:
   - Navigate to `http://localhost:3000/admin`
   - Enter your Admin API Key: `565a5c291acc64fad8446dcc53daa564316ceab139335c37a14a7372e6e414e0`
   - Click "Se connecter"
   - You should see your test reservation in the table

## ⚙️ Optional Configuration

### Enable Email Notifications

1. **Choose an Email Provider**:

   **Gmail Setup**:
   - Go to your Google Account settings
   - Enable "2-Step Verification"
   - Generate an "App Password" (not your regular password)
   - Use this app password in `SMTP_PASSWORD`

   **SendGrid Setup**:
   - Sign up at https://sendgrid.com/
   - Create an API key
   - Use `apikey` as `SMTP_USERNAME` and your API key as `SMTP_PASSWORD`
   - Use `smtp.sendgrid.net` as `SMTP_HOST`

2. **Update `backend/.env`**:
   ```env
   EMAIL_ENABLED=true
   EMAIL_FROM=noreply@daralachab.ma
   EMAIL_TO=owner@daralachab.ma  # Restaurant owner email
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USERNAME=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   ```

3. **Test**: Create a test reservation and check the emails

### Enable SMS Notifications (Twilio)

1. **Create Twilio Account**:
   - Sign up at https://www.twilio.com/
   - Get your Account SID and Auth Token from the dashboard
   - Purchase a phone number (or use trial number for testing)

2. **Update `backend/.env`**:
   ```env
   SMS_ENABLED=true
   SMS_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   SMS_AUTH_TOKEN=your-auth-token-here
   SMS_FROM_NUMBER=+1234567890  # Your Twilio number
   SMS_TO_NUMBER=+212612345678  # Restaurant phone number
   ```

3. **Test**: Create a test reservation and check the phone for SMS

## 🔑 Important: Admin API Key

Your Admin API Key is:
```
565a5c291acc64fad8446dcc53daa564316ceab139335c37a14a7372e6e414e0
```

**⚠️ Keep this secure!** This is used to:
- Log into the admin dashboard at `/admin`
- Access the `GET /api/reservations` API endpoint

**Save this key somewhere safe** - you'll need it to access the admin dashboard.

## 📂 File Locations

- **Backend config**: `backend/.env`
- **Backend code**: `backend/server.py`, `backend/email_utils.py`, `backend/sms_utils.py`
- **Frontend code**: `frontend/src/App.js`, `frontend/src/Admin.js`
- **Admin dashboard**: Access at `http://localhost:3000/admin`

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB is running (if using local MongoDB)
- Verify `MONGO_URL` in `backend/.env` is correct
- Check if port 8000 is already in use

### Frontend won't start
- Make sure you're in the `frontend` directory
- Try deleting `node_modules` and running `npm install --legacy-peer-deps` again

### Admin dashboard shows "Invalid key"
- Verify you copied the full Admin API Key from `backend/.env`
- Check that the `ADMIN_API_KEY` in `.env` matches what you're entering
- Make sure backend server is running

### Can't see reservations in admin dashboard
- Make sure you've created at least one test reservation
- Click the "Actualiser" (Refresh) button
- Check backend terminal for errors

### Email/SMS not working
- Verify `EMAIL_ENABLED=true` or `SMS_ENABLED=true` in `.env`
- Check all credentials are correct (username, password, API keys)
- Look at backend terminal logs for error messages
- Remember: Email/SMS failures won't break reservation saving

## 🚀 Next: Production Deployment

Once everything works locally, see `HANDOVER_GUIDE.md` for:
- Deploying to MongoDB Atlas
- Deploying backend to Render/Railway
- Deploying frontend to Netlify/Vercel
- Connecting domain (daralachab.ma)
- Setting up production environment variables

## 📚 Documentation

- **Reservation Form Guide**: `RESERVATION_FORM_GUIDE.md`
- **Photo Upload Guide**: `PHOTO_UPLOAD_GUIDE.md`
- **Handover Guide**: `HANDOVER_GUIDE.md`
- **Implementation Summary**: `IMPLEMENTATION_SUMMARY.md`

## ✅ Quick Checklist

- [ ] MongoDB is running/configured
- [ ] Backend server is running on port 8000
- [ ] Frontend server is running on port 3000
- [ ] Website loads at http://localhost:3000
- [ ] Reservation form works and saves to database
- [ ] Admin dashboard accessible at /admin
- [ ] Can log into admin with API key
- [ ] Can see reservations in admin dashboard
- [ ] (Optional) Email notifications configured and tested
- [ ] (Optional) SMS notifications configured and tested

---

**Need Help?** Check the documentation files or review the backend terminal logs for error messages.

