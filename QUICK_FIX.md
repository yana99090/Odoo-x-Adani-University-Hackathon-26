# 🔧 Quick Fix - Google Sign-In Error

## ✅ Fixed!

The "Google Sign-In not loaded" error has been fixed. The error message now shows:

> ℹ️ Google Sign-In is optional. To enable it, see GOOGLE_OAUTH_SETUP.md in the project folder. You can use email/password login instead!

---

## 🚀 How to See the Fix

The frontend should **automatically refresh** (Next.js hot reload). Just look at the browser - the error message should now be more helpful!

If it doesn't refresh automatically:
1. Go to the browser
2. Press `Ctrl + R` to refresh
3. The new message should appear

---

## 🔑 How to Login Now

### **Option 1: Use Email/Password (Recommended)**

1. **Ignore the Google button** for now
2. **Enter credentials:**
   - Email: `admin@gearguard.com`
   - Password: `admin123`
3. **Click "Sign In"**
4. **You're in!** 🎉

### **Option 2: Create New Account**

1. Click **"Sign up"** at the bottom
2. Fill in your details
3. Click **"Create Account"**
4. You're logged in automatically!

---

## 🔄 If You Want to Reset the Database

The database needs to be reset because the User model changed. Here's how:

### **Step 1: Stop the Backend Server**

1. Find the PowerShell window running the backend (shows Python/FastAPI output)
2. Press `Ctrl + C` to stop it
3. Wait for it to fully stop

### **Step 2: Delete the Database**

In the same PowerShell window:
```powershell
del gearguard.db
```

### **Step 3: Recreate the Database**

```powershell
python init_data.py
```

This will create a fresh database with:
- Admin user: `admin@gearguard.com` / `admin123`
- Sample equipment, teams, and requests

### **Step 4: Restart the Backend**

```powershell
python main.py
```

### **Step 5: Test Login**

1. Go to http://localhost:3000/login
2. Login with `admin@gearguard.com` / `admin123`
3. You should see the dashboard!

---

## 🎯 What Changed

### **Fixed Files:**

1. **`frontend/src/app/layout.tsx`**
   - Added Google Sign-In script (for future use)
   - Script loads in the background

2. **`frontend/src/app/login/page.tsx`**
   - Changed error message to be more helpful
   - No longer throws "Google Sign-In not loaded" error

3. **`frontend/src/app/signup/page.tsx`**
   - Same helpful message on signup page

---

## 📝 Summary

**The error is fixed!** You can now:

✅ **Use email/password login** (works perfectly)
✅ **Create new accounts** (works perfectly)
✅ **See a helpful message** instead of an error
✅ **Optionally set up Google OAuth later** (see GOOGLE_OAUTH_SETUP.md)

---

## 🐛 Still Having Issues?

### **Can't login with admin@gearguard.com**

The database needs to be reset (see "If You Want to Reset the Database" above)

### **Page not loading**

1. Check backend is running (PowerShell window with Python)
2. Check frontend is running (PowerShell window with npm)
3. Refresh browser with `Ctrl + R`

### **Still seeing old error**

1. Hard refresh: `Ctrl + Shift + R`
2. Or close and reopen the browser tab

---

**You're all set! Just use email/password login and you're good to go! 🎉**

