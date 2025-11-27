# 🚀 Quick Start Guide - Step by Step

## ✅ What's Already Done
- ✅ Backend dependencies installed
- ✅ Frontend dependencies installed  
- ✅ Code fixed (verify_admin_key moved to correct location)

## 📝 What You Need to Do Now

### STEP 1: Create the `.env` file in the `backend` folder

**Location:** `C:\Users\DELL\IdeaProjects\Dar-al-achab\backend\.env`

**Open VS Code and:**
1. Go to the `backend` folder in the file explorer
2. Right-click → "New File" → name it `.env`
3. Copy and paste this EXACT content:

```env
MONGO_URL=mongodb+srv://ahajizakariae2_db_user:zico*2002@cluster0.dwgxduy.mongodb.net/?appName=Cluster0
DB_NAME=dar_al_achab
CORS_ORIGINS=http://localhost:3000
ADMIN_API_KEY=565a5c291acc64fad8446dcc53daa564316ceab139335c37a14a7372e6e414e0
EMAIL_ENABLED=false
SMS_ENABLED=false
```

**⚠️ IMPORTANT:** The password `zico*2002` has a `*` character. If MongoDB connection fails, you may need to URL-encode it as `zico%2A2002` instead.

---

### STEP 2: Start the Backend Server

**Open a NEW terminal in VS Code:**
1. Click "Terminal" → "New Terminal" (or press `` Ctrl+` ``)
2. Make sure you're in the project root: `C:\Users\DELL\IdeaProjects\Dar-al-achab`

**Run this command:**
```powershell
cd backend
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

**✅ Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**⚠️ If you see an error:**
- "MONGO_URL not found" → Check that `.env` file exists in `backend` folder
- "Authentication failed" → Check your MongoDB password
- "IP not allowed" → Go to MongoDB Atlas → Network Access → Add IP Address → "Allow Access From Anywhere"

**Keep this terminal open!** Don't close it.

---

### STEP 3: Start the Frontend Server

**Open ANOTHER NEW terminal in VS Code:**
1. Click "Terminal" → "New Terminal" (or press `` Ctrl+Shift+` ``)
2. Make sure you're in the project root: `C:\Users\DELL\IdeaProjects\Dar-al-achab`

**Run this command:**
```powershell
cd frontend
npm start
```

**✅ Expected Output:**
```
Compiled successfully!

You can now view frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

**The browser should open automatically to `http://localhost:3000`**

**Keep this terminal open too!**

---

### STEP 4: Test Everything

1. **Browse the website** at `http://localhost:3000`
   - Check all sections work (Home, About, Menu, Gallery, Contact)

2. **Test the Reservation Form:**
   - Scroll to "Contact" section
   - Fill out the form:
     - Name: Test User
     - Phone: 0612345678
     - Email: test@example.com
     - Date: (pick any date, not Friday)
     - Time: 19:00
     - Persons: 2
   - Click "Envoyer la Réservation"
   - ✅ You should see a success message

3. **Test the Admin Dashboard:**
   - Go to: `http://localhost:3000/admin`
   - Enter Admin Key: `565a5c291acc64fad8446dcc53daa564316ceab139335c37a14a7372e6e414e0`
   - Click "Se connecter"
   - ✅ You should see your test reservation in the table

---

## 🐛 Troubleshooting

### Backend won't start
**Error: "MONGO_URL not found"**
- Make sure `.env` file is in `backend` folder (not `frontend`)
- Check the file name is exactly `.env` (not `.env.txt`)

**Error: "Authentication failed"**
- Your MongoDB password might be wrong
- Check MongoDB Atlas → Database Access → verify username and password

**Error: "IP not allowed"**
- Go to MongoDB Atlas → Network Access
- Click "Add IP Address"
- Choose "Allow Access From Anywhere" (0.0.0.0/0)
- Wait 1-2 minutes for it to take effect

### Frontend won't start
**Error: "npm start failed"**
- Make sure you're in the `frontend` folder
- Try: `npm install --legacy-peer-deps` again

### Can't see reservations in admin
- Make sure you created a test reservation first
- Click "Actualiser" (Refresh) button in admin dashboard
- Check backend terminal for errors

---

## 📍 Current Status

✅ **Backend Code:** Fixed and ready
✅ **Frontend Code:** Ready
⏳ **Waiting for you to:**
   1. Create `.env` file (STEP 1)
   2. Start backend server (STEP 2)
   3. Start frontend server (STEP 3)
   4. Test everything (STEP 4)

---

## 🔑 Your Admin API Key (Save This!)

```
565a5c291acc64fad8446dcc53daa564316ceab139335c37a14a7372e6e414e0
```

Use this to log into `/admin` dashboard.

---

**Need help?** Check the error message in the terminal and let me know what it says!

