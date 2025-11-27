# Dar Al Achab – Handover & Reservation Guide

## 1. Reservation Workflow

| Step | What happens | Where the data goes |
| --- | --- | --- |
| 1 | Visitor fills the reservation form and clicks **“Envoyer la Réservation”** | Frontend validates required fields and ensures the selected date is not a Friday (the restaurant is closed) |
| 2 | Browser sends a `POST` request to `http://localhost:8000/api/reservations` | FastAPI backend receives the payload |
| 3 | Backend validates, adds timestamps, and stores the record | MongoDB collection `reservations` |
| 4 | Backend logs the reservation in the console | You can monitor the server log for quick confirmation |

### Fields stored
```json
{
  "id": "uuid",
  "name": "Nom complet",
  "phone": "Téléphone",
  "email": "optionnel",
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "persons": 6,
  "message": "optionnel",
  "timestamp": "ISO 8601"
}
```

### How to view reservations
1. **API endpoint**:  
   ```bash
   curl http://localhost:8000/api/reservations
   ```
2. **MongoDB shell**:
   ```bash
   mongosh
   use dar_al_achab
   db.reservations.find().pretty()
   ```
3. **Future enhancements** (optional):
   - Send an email to the owner each time a reservation is created (e.g., using SendGrid or AWS SES)
   - Build an admin dashboard that calls `GET /api/reservations`

## 2. Deploying / Selling the Website

### A. Code base
1. Push the repository to a private GitHub/GitLab/Bitbucket project
2. Invite the restaurant owner (or their developer) with admin access
3. Provide documentation:
   - `README.md`
   - `RESERVATION_FORM_GUIDE.md`
   - `PHOTO_UPLOAD_GUIDE.md`
   - This `HANDOVER_GUIDE.md`
4. Share the `ADMIN_API_KEY` securely with the restaurant owner (for admin dashboard access)

### B. Backend (.env file)
1. Create a production `.env` file inside `backend/` with all required variables:
   ```env
   # MongoDB Configuration
   MONGO_URL=<cloud mongo connection string>
   DB_NAME=dar_al_achab
   
   # CORS Configuration
   CORS_ORIGINS=https://daralachab.ma,https://www.daralachab.ma
   
   # Email Notifications (optional)
   EMAIL_ENABLED=true
   EMAIL_FROM=noreply@daralachab.ma
   EMAIL_TO=owner@daralachab.ma
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USERNAME=your-email@gmail.com
   SMTP_PASSWORD=your-password
   
   # SMS Notifications (optional)
   SMS_ENABLED=true
   SMS_ACCOUNT_SID=your-twilio-account-sid
   SMS_AUTH_TOKEN=your-twilio-auth-token
   SMS_FROM_NUMBER=+1234567890
   SMS_TO_NUMBER=+212612345678
   
   # Admin API Key (required for admin dashboard)
   ADMIN_API_KEY=<generate-a-secure-random-key>
   ```
   
   **Generate Admin API Key**: Use a secure random string generator:
   ```bash
   openssl rand -hex 32
   ```
   Or use an online generator to create a secure random string (at least 32 characters).

2. Deploy the FastAPI app (options):
   - Docker container on a VPS (DigitalOcean, AWS EC2, etc.)
   - Managed service like Render, Railway, or Deta (see "Production Deployment" section below)
3. Ensure MongoDB is reachable (Atlas or self-hosted)

### C. Frontend build
1. From `frontend/`, run:
   ```bash
   npm install
   npm run build
   ```
2. Deploy the `build/` folder to:
   - Netlify / Vercel / Cloudflare Pages
   - Nginx or Apache on the same VPS as the backend
3. Update the backend `CORS_ORIGINS` to include the deployed domain.

### D. Domain name
You mentioned that you already own a domain. To transfer or delegate it:
1. **If you keep ownership**: update DNS records to point to the final hosting server.
2. **If you want to transfer**: ask your registrar for the EPP/Auth code and unlock the domain; give both to the restaurant owner so they can transfer it to their registrar.
3. Create the following DNS records:
   - `A` record pointing to the frontend host (if using a VPS)
   - Or `CNAME` pointing to the provider (e.g., Netlify/Vercel)
   - If backend uses a different domain/subdomain (e.g., `api.dar-al-achab.com`), add a second record for it.

### E. Giving full control
1. Deliver the Git repository and documentation.
2. Share credentials (or temporary passwords) for:
   - Hosting provider(s)
   - MongoDB Atlas (or whichever DB you use)
   - Domain registrar (if transferring)
3. Walk them through:
   - How to deploy new versions (git pull + npm run build + restart backend)
   - How to update images (refer to `PHOTO_UPLOAD_GUIDE.md`)
   - How to retrieve reservations (API or MongoDB)

## 3. Email Notifications Setup

### Configuration

1. **Enable Email Notifications**:
   Add the following to `backend/.env`:
   ```env
   EMAIL_ENABLED=true
   EMAIL_FROM=noreply@daralachab.ma
   EMAIL_TO=owner@daralachab.ma
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USERNAME=your-email@gmail.com
   SMTP_PASSWORD=your-password
   ```

2. **SMTP Providers**:
   - **Gmail**: Use `smtp.gmail.com` with port 587 (requires app password, not regular password)
   - **SendGrid**: Use `smtp.sendgrid.net` with port 587, username `apikey`, password is your API key
   - **AWS SES**: Use your SES SMTP endpoint
   - Other providers: Check their documentation for SMTP settings

3. **Email Content**:
   - **To Restaurant**: Includes all reservation details (name, phone, email, date, time, persons, message)
   - **To Customer**: Confirmation email sent if customer provides email address

4. **Testing**:
   - Create a test reservation via the website
   - Check restaurant owner email inbox
   - Check customer email inbox (if email provided)
   - Check backend logs for any errors

## 4. SMS Notifications Setup (Twilio)

### Configuration

1. **Create Twilio Account**:
   - Sign up at https://www.twilio.com/
   - Get your Account SID and Auth Token from the dashboard
   - Purchase a phone number (or use trial number for testing)

2. **Configure Environment Variables**:
   Add to `backend/.env`:
   ```env
   SMS_ENABLED=true
   SMS_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   SMS_AUTH_TOKEN=your-auth-token-here
   SMS_FROM_NUMBER=+1234567890
   SMS_TO_NUMBER=+212612345678
   ```

3. **Phone Number Format**:
   - Use E.164 format: `+[country code][number]`
   - Example: `+212612345678` (Morocco)
   - Example: `+1234567890` (US)

4. **SMS Content**:
   - Format: "Nouvelle réservation: {date} {time} - {persons} pers - {name} ({phone})"
   - Example: "Nouvelle réservation: 15/01/2025 19:30 - 4 pers - Ahmed Benali (+212612345678)"

5. **Testing**:
   - Create a test reservation via the website
   - Check the configured phone number for SMS
   - Check backend logs for any errors

## 5. Admin Dashboard

### Access

1. **URL**: Navigate to `https://daralachab.ma/admin` (or your production URL + `/admin`)
2. **Login**: Enter the `ADMIN_API_KEY` configured in `backend/.env`
3. **Features**:
   - View all reservations in a table
   - Filter by date (today, future, all)
   - Search by name, phone, or email
   - View statistics (total, today, future, displayed)
   - Refresh to get latest reservations

### Using the Admin API Key

**To access the admin dashboard**:
1. Navigate to `/admin`
2. Enter the `ADMIN_API_KEY` value from `backend/.env`
3. Click "Se connecter"

**To use the API directly** (e.g., with curl):
```bash
curl -H "x-admin-key: YOUR_ADMIN_API_KEY" https://api.daralachab.ma/api/reservations
```

**Security Note**: 
- The admin key is stored in browser sessionStorage (cleared when browser closes)
- Keep the `ADMIN_API_KEY` secure and don't commit it to version control
- Change it periodically for security
- The `/admin` route is not linked in the main navigation (semi-private)

## 6. Production Deployment (Example with Render or Railway)

### A. MongoDB Atlas Setup

1. **Create Account**: Sign up at https://www.mongodb.com/cloud/atlas
2. **Create Cluster**: Choose free tier (M0) for small applications
3. **Get Connection String**:
   - Go to "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

4. **Network Access**:
   - Add IP address `0.0.0.0/0` to allow connections from anywhere (for cloud hosting)
   - Or add specific IPs for better security

### B. Backend Deployment (Render Example)

1. **Create New Web Service**:
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configuration**:
   - **Name**: `dar-al-achab-api`
   - **Environment**: `Python 3`
   - **Build Command**: `cd backend && pip install -r requirements.txt`
   - **Start Command**: `cd backend && uvicorn server:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free tier (or paid for better performance)

3. **Environment Variables** (add in Render dashboard):
   ```
   MONGO_URL=<your-mongodb-atlas-connection-string>
   DB_NAME=dar_al_achab
   CORS_ORIGINS=https://daralachab.ma,https://www.daralachab.ma
   EMAIL_ENABLED=true
   EMAIL_FROM=noreply@daralachab.ma
   EMAIL_TO=owner@daralachab.ma
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USERNAME=your-email@gmail.com
   SMTP_PASSWORD=your-password
   SMS_ENABLED=true
   SMS_ACCOUNT_SID=your-twilio-account-sid
   SMS_AUTH_TOKEN=your-twilio-auth-token
   SMS_FROM_NUMBER=+1234567890
   SMS_TO_NUMBER=+212612345678
   ADMIN_API_KEY=<your-generated-admin-key>
   ```

4. **Get Backend URL**: Render will provide a URL like `https://dar-al-achab-api.onrender.com`

### C. Backend Deployment (Docker Alternative)

If deploying with Docker:

1. **Build Docker Image**:
   ```bash
   cd backend
   docker build -t dar-al-achab-backend .
   ```

2. **Run Container**:
   ```bash
   docker run -d \
     -p 8000:8000 \
     --env-file .env \
     --name dar-al-achab-api \
     dar-al-achab-backend
   ```

3. **Or Use Docker Compose** (create `docker-compose.yml`):
   ```yaml
   version: '3.8'
   services:
     backend:
       build: ./backend
       ports:
         - "8000:8000"
       env_file:
         - ./backend/.env
       restart: unless-stopped
   ```

### D. Frontend Deployment (Netlify Example)

1. **Build Frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Create Netlify Site**:
   - Go to https://app.netlify.com
   - Drag and drop the `frontend/build` folder
   - Or connect GitHub repository and set build command: `cd frontend && npm install && npm run build`
   - Set publish directory: `frontend/build`

3. **Environment Variables** (optional, if API URL is different):
   - Add `REACT_APP_API_URL=https://dar-al-achab-api.onrender.com` (or your backend URL)

4. **Get Frontend URL**: Netlify will provide a URL like `https://dar-al-achab.netlify.app`

### E. Update Frontend API URL

If your backend is deployed to a different URL:

1. **Option 1**: Set environment variable in build:
   - Add `REACT_APP_API_URL=https://your-backend-url.com` to Netlify/Vercel environment variables
   - Update `frontend/src/Admin.js` and `frontend/src/App.js` to use `process.env.REACT_APP_API_URL || 'http://localhost:8000'`

2. **Option 2**: Update code directly:
   - Change API URLs in `frontend/src/App.js` (line ~61) and `frontend/src/Admin.js` (line ~7)
   - Rebuild and redeploy

## 7. Domain & DNS Setup

### Your Domain: daralachab.ma

You mentioned the domain is purchased from https://my.hostino.com/. Here's how to connect it:

### A. Frontend Domain Setup

1. **Point Domain to Frontend** (Netlify/Vercel):

   **For Netlify**:
   - Go to Site Settings → Domain Management
   - Add custom domain: `daralachab.ma` and `www.daralachab.ma`
   - Follow Netlify's DNS instructions

   **DNS Records to Add** (at Hostino):
   - **CNAME Record**: 
     - Name: `@` (or leave empty for root domain)
     - Value: `dar-al-achab.netlify.app` (or your Netlify subdomain)
   - **CNAME Record** (for www):
     - Name: `www`
     - Value: `dar-al-achab.netlify.app`
   
   **Alternative (A Record)**:
   - Get Netlify's IP address (check Netlify docs or support)
   - Add **A Record**:
     - Name: `@`
     - Value: `<netlify-ip-address>`

2. **SSL Certificate**:
   - Netlify/Vercel automatically provisions SSL certificates via Let's Encrypt
   - Wait 5-30 minutes after DNS propagation for SSL to activate

### B. Backend Subdomain Setup (Optional)

If you want to use a subdomain for the API (e.g., `api.daralachab.ma`):

1. **Get Backend URL**: Note your backend service URL (e.g., `https://dar-al-achab-api.onrender.com`)

2. **Add DNS Record** (at Hostino):
   - **CNAME Record**:
     - Name: `api`
     - Value: `dar-al-achab-api.onrender.com` (or your backend hostname)
     - Note: Some providers require just the domain, not the full URL

3. **Update CORS_ORIGINS** in backend `.env`:
   ```env
   CORS_ORIGINS=https://daralachab.ma,https://www.daralachab.ma,https://api.daralachab.ma
   ```

4. **Update Frontend API URL**:
   - Change `REACT_APP_API_URL=https://api.daralachab.ma` in frontend environment variables

### C. DNS Configuration at Hostino

1. **Log in to Hostino**: https://my.hostino.com/
2. **Navigate to Domain Management**: Find `daralachab.ma`
3. **Access DNS Management**: Look for "DNS Management" or "Zone Editor"
4. **Add Records**:
   - For frontend (CNAME): Point to your hosting provider
   - For backend (optional, CNAME): Point to API subdomain
5. **Wait for Propagation**: DNS changes take 5 minutes to 48 hours (usually 1-2 hours)

### D. Verify DNS Setup

1. **Check DNS Propagation**:
   - Use https://www.whatsmydns.net/ to check if DNS records are propagated
   - Search for `daralachab.ma` and `www.daralachab.ma`

2. **Test Website**:
   - Visit `https://daralachab.ma` (wait for SSL certificate)
   - Test reservation form
   - Check if it connects to the backend API

3. **Test Backend** (if using subdomain):
   - Visit `https://api.daralachab.ma/api/` (should return `{"message": "Hello World"}`)

### E. CORS Configuration

Ensure `CORS_ORIGINS` in backend includes your production domains:

```env
CORS_ORIGINS=https://daralachab.ma,https://www.daralachab.ma
```

Or if using API subdomain:
```env
CORS_ORIGINS=https://daralachab.ma,https://www.daralachab.ma,https://api.daralachab.ma
```

## 8. Checklist Before Handover

- [ ] Backend `.env` file is configured for production with all required variables
- [ ] MongoDB Atlas (or other database) is provisioned and accessible
- [ ] Frontend build tested with production API URL
- [ ] Domain DNS points to the live frontend (and backend if applicable)
- [ ] SSL certificates issued and active (Netlify/Vercel handle this automatically; on a VPS use Let's Encrypt)
- [ ] Email notifications tested and working
- [ ] SMS notifications tested and working (if enabled)
- [ ] Admin dashboard accessible and functional
- [ ] Admin API key shared securely with restaurant owner
- [ ] All docs updated with current URLs and credentials
- [ ] Owner has access to:
  - Code repository
  - Hosting dashboard(s) (Netlify, Render, etc.)
  - Domain registrar (Hostino) with DNS control
  - Database dashboard (MongoDB Atlas)
  - Email account (for notifications)
  - Twilio account (if SMS enabled)

With these steps the restaurant owner can fully operate, update, and monitor the website once you hand it off. Good luck with the delivery!

