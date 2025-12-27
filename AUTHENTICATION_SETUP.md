# 🔐 Authentication System - Setup Complete!

GearGuard now has a complete authentication system with login, signup, and Google OAuth support!

---

## ✅ What Was Added

### **Backend (FastAPI)**
- ✅ JWT token authentication
- ✅ Password hashing with bcrypt
- ✅ User registration endpoint
- ✅ User login endpoint
- ✅ Google OAuth endpoint
- ✅ Protected routes with token verification
- ✅ Updated User model with Google OAuth support

### **Frontend (Next.js)**
- ✅ Login page (`/login`)
- ✅ Signup page (`/signup`)
- ✅ Authentication context
- ✅ Protected routes
- ✅ Token management
- ✅ Auto-redirect to login if not authenticated
- ✅ User profile display
- ✅ Logout functionality

---

## 🚀 How to Run with Authentication

### **Step 1: Stop Current Servers**

Close the two PowerShell windows that are running the backend and frontend.

### **Step 2: Reset Database**

The User model has changed, so we need to recreate the database:

```bash
cd backend
del gearguard.db
python init_data.py
```

### **Step 3: Start Backend**

```bash
cd backend
python main.py
```

### **Step 4: Start Frontend**

Open a new terminal:

```bash
cd frontend
npm run dev
```

### **Step 5: Open Browser**

Go to: **http://localhost:3000**

You'll be automatically redirected to the login page!

---

## 🔑 Login Options

### **Option 1: Use Default Admin Account**

- Email: `admin@gearguard.com`
- Password: `admin123`

### **Option 2: Create New Account**

1. Click "Sign up" on the login page
2. Fill in your details
3. Click "Create Account"
4. You'll be automatically logged in!

### **Option 3: Google Sign-In (Optional)**

See `GOOGLE_OAUTH_SETUP.md` for instructions on setting up Google OAuth.

---

## 🎯 Features

### **Login Page** (`/login`)
- Email/password login
- Google Sign-In button
- Link to signup page
- Error handling
- Loading states

### **Signup Page** (`/signup`)
- Name, email, password fields
- Password confirmation
- Password strength validation
- Google Sign-Up button
- Link to login page
- Error handling

### **Protected Routes**
- All pages except `/login` and `/signup` require authentication
- Automatic redirect to login if not authenticated
- Token stored in localStorage
- Token sent with every API request

### **User Profile**
- User name displayed in header
- Profile picture support (for Google users)
- Logout button
- User info persisted across page refreshes

---

## 🔒 Security Features

### **Password Security**
- Passwords hashed with bcrypt
- Minimum 6 characters required
- Never stored in plain text

### **JWT Tokens**
- Secure token-based authentication
- 7-day expiration
- Automatic token refresh
- Token validation on every request

### **Protected API**
- All API endpoints require authentication
- Token verification middleware
- 401 errors handled gracefully

---

## 📝 API Endpoints

### **Authentication**

```
POST /api/auth/register
Body: { name, email, password }
Returns: { access_token, token_type, user }

POST /api/auth/login
Body: { email, password }
Returns: { access_token, token_type, user }

POST /api/auth/google
Body: { token }
Returns: { access_token, token_type, user }

GET /api/auth/me
Headers: Authorization: Bearer <token>
Returns: { id, name, email, ... }
```

---

## 🎨 User Flow

### **First Visit**
1. User goes to http://localhost:3000
2. Not authenticated → Redirected to `/login`
3. User can login or signup
4. After authentication → Redirected to dashboard

### **Subsequent Visits**
1. User goes to http://localhost:3000
2. Token found in localStorage
3. Token validated with backend
4. User sees dashboard immediately

### **Logout**
1. User clicks logout button
2. Token removed from localStorage
3. Redirected to `/login`

---

## 🔧 Configuration

### **Backend Configuration** (`backend/auth.py`)

```python
# Change these in production!
SECRET_KEY = "your-secret-key-change-this-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# For Google OAuth
GOOGLE_CLIENT_ID = "your-google-client-id.apps.googleusercontent.com"
```

### **Frontend Configuration**

Create `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id-here
```

---

## 🐛 Troubleshooting

### **"Could not validate credentials"**
- Token expired or invalid
- Clear localStorage and login again
- Check that backend is running

### **"Email already registered"**
- User already exists
- Use login instead of signup
- Or use a different email

### **Redirected to login immediately**
- Token expired
- Backend not running
- Check browser console for errors

### **Google Sign-In not working**
- See `GOOGLE_OAUTH_SETUP.md`
- Make sure Client ID is configured
- Check browser console for errors

---

## 📚 Files Modified/Created

### **Backend**
- ✅ `backend/auth.py` - NEW! Authentication utilities
- ✅ `backend/models.py` - Updated User model
- ✅ `backend/schemas.py` - Added auth schemas
- ✅ `backend/main.py` - Added auth endpoints
- ✅ `backend/init_data.py` - Updated for new User model
- ✅ `backend/requirements.txt` - Added Google auth packages

### **Frontend**
- ✅ `frontend/src/app/login/page.tsx` - NEW! Login page
- ✅ `frontend/src/app/signup/page.tsx` - NEW! Signup page
- ✅ `frontend/src/lib/auth-context.tsx` - NEW! Auth context
- ✅ `frontend/src/components/ProtectedRoute.tsx` - NEW! Route protection
- ✅ `frontend/src/lib/api.ts` - Added auth methods
- ✅ `frontend/src/app/providers.tsx` - Added AuthProvider
- ✅ `frontend/src/app/page.tsx` - Added user profile & logout

---

## ✨ Next Steps

1. **Reset the database** (see Step 2 above)
2. **Restart both servers**
3. **Visit http://localhost:3000**
4. **Login or signup**
5. **Enjoy your secure GearGuard app!**

Optional:
- Set up Google OAuth (see `GOOGLE_OAUTH_SETUP.md`)
- Change SECRET_KEY in production
- Add password reset functionality
- Add email verification

---

**Your GearGuard app is now secure! 🎉**

