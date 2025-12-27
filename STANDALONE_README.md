# 🔧 GearGuard - Standalone Version

**No Odoo Required!** This is a complete standalone web application.

---

## 🚀 Quick Start (3 Steps)

### **Step 1: Start Backend**

```bash
cd backend
pip install -r requirements.txt
python init_data.py
python main.py
```

✅ Backend running at: **http://localhost:8000**

### **Step 2: Start Frontend**

Open a NEW terminal:

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend running at: **http://localhost:3000**

### **Step 3: Open Browser**

Go to: **http://localhost:3000**

Login:
- Email: `admin@gearguard.com`
- Password: `admin123`

---

## ✨ What You Get

- ✅ Equipment management
- ✅ Maintenance requests
- ✅ Kanban board
- ✅ Teams & users
- ✅ Dashboard with stats
- ✅ Auto-assignment
- ✅ Scrap workflow

---

## 📁 Structure

```
backend/     → Python FastAPI server
frontend/    → Next.js React app
models/      → Old Odoo models (ignore)
views/       → Old Odoo views (ignore)
```

---

## 🎯 Features

### **Dashboard**
- Total equipment count
- Active equipment
- Open requests
- Urgent requests

### **Equipment**
- Add/edit equipment
- Assign to teams
- Track warranty
- Mark as scrapped

### **Maintenance Requests**
- Create corrective (breakdown) requests
- Create preventive (scheduled) requests
- Kanban board workflow
- Auto-assign to teams

### **Teams**
- Create maintenance teams
- Assign team leaders
- Add team members

---

## 🛠️ Tech Stack

**Backend:**
- FastAPI (Python)
- SQLAlchemy ORM
- SQLite database

**Frontend:**
- Next.js 14
- TypeScript
- Tailwind CSS
- React Query

---

## 📝 API Documentation

Once backend is running, visit:
**http://localhost:8000/docs**

Interactive API documentation with all endpoints!

---

## 🎉 That's It!

No Odoo, no PostgreSQL, no complex setup.

Just Python + Node.js and you're ready to go!

**Questions?** Check the code - it's clean and well-commented!

