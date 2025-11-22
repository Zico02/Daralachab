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

### B. Backend (.env file)
1. Create a production `.env` file inside `backend/`:
   ```
   MONGO_URL=<cloud mongo connection string>
   DB_NAME=dar_al_achab
   CORS_ORIGINS=https://www.dar-al-achab.com
   ```
2. Deploy the FastAPI app (options):
   - Docker container on a VPS (DigitalOcean, AWS EC2, etc.)
   - Managed service like Render, Railway, or Deta
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

## 3. Checklist Before Handover
- [ ] Backend `.env` file is configured for production
- [ ] MongoDB Atlas (or other database) is provisioned
- [ ] Frontend build tested with production API URL
- [ ] Domain DNS points to the live frontend (and backend if applicable)
- [ ] SSL certificates issued (Netlify/Vercel handle this automatically; on a VPS use Let’s Encrypt)
- [ ] All docs updated with current URLs and credentials
- [ ] Owner has access to:
  - Code repository
  - Hosting dashboard(s)
  - Domain registrar (or at least DNS control)
  - Database dashboard

With these steps the restaurant owner can fully operate, update, and monitor the website once you hand it off. Good luck with the delivery!

