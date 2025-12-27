# 🚀 How to Run GearGuard (Standalone Version)

## ⚡ Quick Start (For First Time)

### **Step 1: Install Backend**
```bash
cd backend
pip install -r requirements.txt
python init_data.py
```

### **Step 2: Install Frontend**
```bash
cd frontend
npm install
```

### **Step 3: Run Both Servers**

**Terminal 1 (Backend):**
```bash
cd backend
python main.py
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

### **Step 4: Open Browser**
Go to: **http://localhost:3000**

Login:
- Email: `admin@gearguard.com`
- Password: `admin123`

---

## 🔄 Daily Use (After First Setup)

Just run these two commands in separate terminals:

**Terminal 1:**
```bash
cd backend && python main.py
```

**Terminal 2:**
```bash
cd frontend && npm run dev
```

Then open: **http://localhost:3000**

---

## 🪟 Windows Users (Easiest Way)

### **Option 1: One-Click Start**
Double-click: **`START_HERE.bat`**

This automatically:
- Starts backend
- Starts frontend
- Opens browser

### **Option 2: Manual Start**
Double-click: **`start_backend.bat`**
Double-click: **`start_frontend.bat`**

---

## 🐧 Linux/Mac Users

### **Backend:**
```bash
cd backend
pip3 install -r requirements.txt
python3 init_data.py
python3 main.py
```

### **Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## ✅ What You Should See

### **Backend Terminal:**
```
INFO:     Started server process [12345]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

### **Frontend Terminal:**
```
  ▲ Next.js 14.1.0
  - Local:        http://localhost:3000
  - Ready in 2.3s
```

### **Browser:**
- GearGuard dashboard
- Statistics cards
- Quick action buttons

---

## 🛑 How to Stop

Press **Ctrl+C** in both terminals

Or close the terminal windows

---

## 🔧 Troubleshooting

### **"Module not found" (Backend)**
```bash
cd backend
pip install -r requirements.txt
```

### **"Module not found" (Frontend)**
```bash
cd frontend
npm install
```

### **"Port already in use"**
- Backend (8000): Stop other Python processes
- Frontend (3000): Stop other Node processes

### **"Can't connect to API"**
- Make sure backend is running
- Check http://localhost:8000 in browser
- Should see: `{"message": "Welcome to GearGuard API"}`

---

## 📍 Important URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

---

## 💾 Database Location

The SQLite database is stored at:
```
backend/gearguard.db
```

To reset database:
```bash
cd backend
del gearguard.db        # Windows
rm gearguard.db         # Linux/Mac
python init_data.py
```

---

## 🎯 What to Do First

1. ✅ Login with admin credentials
2. ✅ Explore the dashboard
3. ✅ Go to "Requests" to see Kanban board
4. ✅ Try creating a new request
5. ✅ Check out the API docs at /docs

---

## 📚 More Help

- **Setup Guide:** See `SETUP_GUIDE.md`
- **Features:** See `STANDALONE_README.md`
- **Complete Info:** See `CONVERSION_COMPLETE.md`

---

**That's it! Enjoy GearGuard! 🎉**

