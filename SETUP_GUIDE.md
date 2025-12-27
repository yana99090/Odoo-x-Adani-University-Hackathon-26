# 🚀 GearGuard Setup Guide

## ✅ Prerequisites Check

Before starting, make sure you have:

### **1. Python 3.8 or higher**
```bash
python --version
```
Should show: `Python 3.8.x` or higher

If not installed: Download from https://www.python.org/downloads/

### **2. Node.js 18 or higher**
```bash
node --version
```
Should show: `v18.x.x` or higher

If not installed: Download from https://nodejs.org/

---

## 🎯 Installation Steps

### **Step 1: Install Backend Dependencies**

Open PowerShell or Command Prompt:

```bash
cd D:\Odoo\gearguard\backend
pip install -r requirements.txt
```

This will install:
- FastAPI
- Uvicorn
- SQLAlchemy
- Pydantic
- And other dependencies

**Wait for installation to complete** (may take 2-3 minutes)

### **Step 2: Initialize Database**

```bash
python init_data.py
```

You should see:
```
🔧 Initializing database...
✅ Created default stages
✅ Created admin user (admin@gearguard.com / admin123)
✅ Created sample users
✅ Created sample categories
✅ Created sample teams
🎉 Database initialized successfully!
```

### **Step 3: Start Backend Server**

```bash
python main.py
```

You should see:
```
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Keep this terminal open!**

### **Step 4: Install Frontend Dependencies**

Open a **NEW** terminal:

```bash
cd D:\Odoo\gearguard\frontend
npm install
```

This will install all Node.js packages (may take 3-5 minutes)

### **Step 5: Start Frontend Server**

```bash
npm run dev
```

You should see:
```
  ▲ Next.js 14.1.0
  - Local:        http://localhost:3000
```

**Keep this terminal open too!**

### **Step 6: Open Browser**

Go to: **http://localhost:3000**

Login with:
- **Email:** admin@gearguard.com
- **Password:** admin123

---

## 🎉 You're Done!

You should now see the GearGuard dashboard!

---

## 🔧 Troubleshooting

### **Problem: "pip: command not found"**

**Solution:** Python not in PATH. Try:
```bash
python -m pip install -r requirements.txt
```

### **Problem: "npm: command not found"**

**Solution:** Node.js not installed or not in PATH.
- Reinstall Node.js from https://nodejs.org/
- Make sure to check "Add to PATH" during installation

### **Problem: "Port 8000 already in use"**

**Solution:** Another process is using port 8000.
- Find and stop the process
- Or change port in `backend/main.py` (last line)

### **Problem: "Port 3000 already in use"**

**Solution:** Another process is using port 3000.
- Stop the process
- Or run: `npm run dev -- -p 3001` (use port 3001)

### **Problem: Frontend can't connect to backend**

**Solution:**
1. Make sure backend is running (check terminal)
2. Backend should be on http://localhost:8000
3. Check browser console for errors

### **Problem: "Module not found" errors**

**Solution:**
- Backend: Run `pip install -r requirements.txt` again
- Frontend: Run `npm install` again

---

## 📝 Quick Reference

### **Start Backend**
```bash
cd D:\Odoo\gearguard\backend
python main.py
```

### **Start Frontend**
```bash
cd D:\Odoo\gearguard\frontend
npm run dev
```

### **Reset Database**
```bash
cd D:\Odoo\gearguard\backend
del gearguard.db
python init_data.py
```

### **View API Documentation**
Open: http://localhost:8000/docs

---

## 🎯 Next Steps

1. ✅ Create equipment categories
2. ✅ Create maintenance teams
3. ✅ Add equipment
4. ✅ Create maintenance requests
5. ✅ Try the Kanban board

---

## 💡 Tips

- **Keep both terminals open** while using GearGuard
- **Backend terminal** shows API requests
- **Frontend terminal** shows page loads
- **Press Ctrl+C** in terminals to stop servers
- **Refresh browser** if something doesn't load

---

## 🆘 Still Having Issues?

Check:
1. Python version: `python --version`
2. Node version: `node --version`
3. Backend running: http://localhost:8000
4. Frontend running: http://localhost:3000
5. Browser console for errors (F12)

---

**Happy maintenance tracking! 🎉**

