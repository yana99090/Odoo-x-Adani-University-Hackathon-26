# GearGuard - Features Documentation

## Overview
GearGuard is a comprehensive Equipment Maintenance Management System built with FastAPI (backend) and Next.js (frontend). It provides a modern, user-friendly interface for managing equipment, maintenance requests, teams, and analytics.

## Core Features

### 1. Authentication & User Management
- **Email/Password Authentication**: Secure login with JWT tokens
- **User Roles**: Admin and regular user roles
- **Pre-configured Users**: 5 test users for easy testing
  - admin@gearguard.com / admin123 (Admin)
  - john.smith@company.com / password123
  - alice.brown@company.com / password123
  - mike.johnson@company.com / password123

### 2. Equipment Management
- **Equipment Tracking**: Manage all equipment with detailed information
  - Name, Serial Number, Model
  - Category, Department, Location
  - Purchase Date and Value
  - Maintenance Team and Technician assignment
- **Equipment Detail Page**: View comprehensive equipment information
- **Smart Button**: Quick access to maintenance requests for specific equipment
- **Scrap Management**: Mark equipment as scrapped with automatic workflow

### 3. Maintenance Request Management
- **Request Types**:
  - Preventive Maintenance (scheduled)
  - Corrective Maintenance (on-demand)
- **Priority Levels**: Low, Medium, High, Urgent
- **Stage-based Workflow**: New → In Progress → Repaired/Scrap
- **Auto-population**: Automatically fill team, technician, and category when equipment is selected
- **Assign to Me**: Quick assignment button with team member validation
- **Duration Tracking**: Track time spent on maintenance
- **Scheduled Dates**: Plan preventive maintenance in advance

### 4. Kanban Board View
- **Drag-and-Drop Interface**: Move requests between stages
- **Visual Indicators**:
  - Overdue requests highlighted in red
  - Priority color coding
  - Request type badges (Preventive/Corrective)
  - Assigned technician display
- **Stage Columns**: Organized by workflow stages
- **Real-time Updates**: Automatic refresh after changes

### 5. Calendar View
- **Preventive Maintenance Calendar**: View all scheduled maintenance
- **Monthly/Weekly/Daily Views**: Multiple calendar perspectives
- **Priority Color Coding**: Visual priority indicators
- **Click to Create**: Click on a date to schedule new maintenance
- **Event Details**: Click on events to view full details
- **Quick Navigation**: Jump to request details from calendar

### 6. Analytics Dashboard
- **Key Performance Indicators (KPIs)**:
  - Total Requests
  - Open Requests
  - Completed Requests
  - Overdue Requests

- **Charts & Visualizations**:
  - Requests by Stage (Bar Chart)
  - Requests by Priority (Pie Chart)
  - Requests by Type (Pie Chart)
  - Requests by Team (Bar Chart)
  - Monthly Trend (Line Chart - Last 6 months)
  - Average Duration by Priority (Bar Chart)

### 7. Team Management
- **Team Creation**: Organize technicians into teams
- **Team Members**: Assign users to teams
- **Team Leaders**: Designate team leaders
- **Color Coding**: Visual team identification
- **Team-based Assignment**: Assign requests to teams

### 8. Category Management
- **Equipment Categories**: Organize equipment by type
  - Machines
  - Vehicles
  - Computers
  - Office Equipment
- **Color Coding**: Visual category identification
- **Category Notes**: Additional category information

### 9. Workflow Automation
- **Auto-scrap Equipment**: Automatically mark equipment as scrapped when request moves to scrap stage
- **Stage Transitions**: Smooth workflow progression
- **Validation**: Ensure data integrity during transitions

## Technical Features

### Backend (FastAPI)
- **RESTful API**: Clean, well-documented endpoints
- **SQLAlchemy ORM**: Robust database management
- **JWT Authentication**: Secure token-based auth
- **Bcrypt Password Hashing**: Secure password storage
- **CORS Support**: Frontend-backend communication
- **SQLite Database**: Easy setup and portability

### Frontend (Next.js)
- **React 18**: Modern React features
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Beautiful, responsive UI
- **React Query**: Efficient data fetching and caching
- **DnD Kit**: Smooth drag-and-drop interactions
- **React Big Calendar**: Full-featured calendar component
- **Recharts**: Beautiful, responsive charts

## Sample Data
The system comes pre-loaded with:
- 4 Equipment items (CNC Machine, Forklift, Printer, Server)
- 3 Maintenance Requests (various types and priorities)
- 2 Teams (Mechanics, IT Support)
- 4 Categories (Machines, Vehicles, Computers, Office Equipment)
- 4 Workflow Stages (New, In Progress, Repaired, Scrap)

## API Endpoints

### Authentication
- POST `/api/auth/login` - User login
- POST `/api/auth/register` - User registration
- GET `/api/auth/me` - Get current user

### Equipment
- GET `/api/equipment` - List all equipment
- GET `/api/equipment/{id}` - Get equipment details
- GET `/api/equipment/{id}/details` - Get equipment with related data
- GET `/api/equipment/{id}/requests` - Get maintenance requests for equipment
- GET `/api/equipment/{id}/requests/count` - Get open request count
- POST `/api/equipment` - Create equipment
- PUT `/api/equipment/{id}` - Update equipment
- POST `/api/equipment/{id}/scrap` - Mark equipment as scrapped

### Maintenance Requests
- GET `/api/requests` - List all requests (with filters)
- GET `/api/requests/{id}` - Get request details
- POST `/api/requests` - Create request
- PUT `/api/requests/{id}` - Update request
- POST `/api/requests/{id}/assign-to-me` - Assign request to current user

### Teams
- GET `/api/teams` - List all teams
- GET `/api/teams/{id}` - Get team details
- POST `/api/teams` - Create team

### Categories
- GET `/api/categories` - List all categories
- POST `/api/categories` - Create category
- PUT `/api/categories/{id}` - Update category
- DELETE `/api/categories/{id}` - Delete category

### Stages
- GET `/api/stages` - List all stages
- POST `/api/stages` - Create stage

### Users
- GET `/api/users` - List all users
- POST `/api/users` - Create user

### Dashboard
- GET `/api/dashboard/stats` - Get dashboard statistics

## Getting Started

### Backend
```bash
cd backend
pip install -r requirements.txt
python init_data.py  # Initialize database with sample data
python main.py  # Start server on http://localhost:8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev  # Start development server on http://localhost:3000
```

### Access the Application
1. Open http://localhost:3000
2. Login with: admin@gearguard.com / admin123
3. Explore the features!

## Future Enhancements
- Mobile app
- Email notifications
- File attachments for requests
- Advanced reporting
- Equipment history tracking
- Maintenance cost tracking
- Spare parts inventory
- QR code scanning for equipment

