# 🔧 Fix Instructions - Step by Step

## Problem 1: Backend Won't Start (Motor/Pymongo Version Issue)

The error shows: `ImportError: cannot import name '_QUERY_OPTIONS' from 'pymongo.cursor'`

This is a version compatibility issue. Let's fix it:

### Run This Command:

**In the backend terminal, run:**
```powershell
cd backend
python -m pip uninstall motor pymongo -y
python -m pip install motor==3.3.2 pymongo==4.6.0
```

**Then try starting the server again:**
```powershell
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

---

## Problem 2: Admin Password Field

The password field is **supposed to show dots** (not the actual text) - that's normal for password fields!

**To verify it's working:**
1. Paste your admin key: `565a5c291acc64fad8446dcc53daa564316ceab139335c37a14a7372e6e414e0`
2. You should see dots/asterisks (that's normal!)
3. Click "Se connecter"
4. It should work!

**If it still doesn't work after fixing the backend**, the backend needs to be running first.

---

## Complete Fix Steps:

### STEP 1: Fix Backend Dependencies

**Open terminal in VS Code (make sure you're in the project root):**

```powershell
cd backend
python -m pip uninstall motor pymongo -y
python -m pip install motor==3.3.2 pymongo==4.6.0
```

**Expected output:**
```
Successfully uninstalled motor
Successfully uninstalled pymongo
Successfully installed motor-3.3.2 pymongo-4.6.0
```

### STEP 2: Fix the .env File

**The `.env` file in `backend` folder needs to be fixed!**

Open `backend/.env` and make sure it looks EXACTLY like this:

```env
MONGO_URL=mongodb+srv://ahajizakariae2_db_user:zico*2002@cluster0.dwgxduy.mongodb.net/?appName=Cluster0
DB_NAME=dar_al_achab
CORS_ORIGINS=http://localhost:3000
ADMIN_API_KEY=565a5c291acc64fad8446dcc53daa564316ceab139335c37a14a7372e6e414e0
EMAIL_ENABLED=false
SMS_ENABLED=false
```

**⚠️ Important:** Each line must start with the variable name, then `=`, then the value.

**If the password `zico*2002` doesn't work, try URL-encoding it:**
Change `zico*2002` to `zico%2A2002` in the MONGO_URL

### STEP 3: Start Backend

```powershell
cd backend
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

**✅ Success looks like:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

**❌ If you still see errors:**
- Check the `.env` file format (must be `KEY=VALUE` on each line)
- Check MongoDB Atlas Network Access (allow your IP or 0.0.0.0/0)

### STEP 4: Test Admin Dashboard

1. Make sure backend is running (STEP 3)
2. Make sure frontend is running (`npm start` in frontend folder)
3. Go to: `http://localhost:3000/admin`
4. Paste admin key: `565a5c291acc64fad8446dcc53daa564316ceab139335c37a14a7372e6e414e0`
5. Click "Se connecter"
6. ✅ Should work now!

---

## Quick Summary:

**Run these commands in order:**

```powershell
# 1. Fix dependencies
cd backend
python -m pip uninstall motor pymongo -y
python -m pip install motor==3.3.2 pymongo==4.6.0

# 2. Start backend
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

**Then in another terminal:**
```powershell
# 3. Start frontend (if not already running)
cd frontend
npm start
```

---

**Need help?** Share the error message you see after running these commands!

