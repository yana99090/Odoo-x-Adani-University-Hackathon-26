"""
GearGuard Standalone API
FastAPI backend for maintenance management
"""
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
from datetime import timedelta
import models
import schemas
import auth
from database import engine, get_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="GearGuard API",
    description="Maintenance Management System API",
    version="1.0.0"
)

# CORS middleware to allow Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)


@app.get("/")
def read_root():
    """API root endpoint"""
    return {
        "message": "Welcome to GearGuard API",
        "version": "1.0.0",
        "docs": "/docs"
    }


# ============================================================================
# AUTHENTICATION ENDPOINTS
# ============================================================================

@app.post("/api/auth/register", response_model=schemas.Token)
def register(user_data: schemas.UserRegister, db: Session = Depends(get_db)):
    """Register a new user with email and password"""
    # Check if user already exists
    existing_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new user
    hashed_password = auth.get_password_hash(user_data.password)
    new_user = models.User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hashed_password,
        role=user_data.role or "Standard User"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create access token
    access_token = auth.create_access_token(data={"sub": new_user.id})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": new_user
    }


@app.post("/api/auth/login", response_model=schemas.Token)
def login(user_data: schemas.UserLogin, db: Session = Depends(get_db)):
    """Login with email and password"""
    user = auth.authenticate_user(db, user_data.email, user_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token = auth.create_access_token(data={"sub": user.id})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }


@app.get("/api/auth/me", response_model=schemas.UserResponse)
def get_current_user_info(current_user: models.User = Depends(auth.get_current_user)):
    """Get current authenticated user info"""
    return current_user


# ============================================================================
# CATEGORY ENDPOINTS
# ============================================================================

@app.get("/api/categories", response_model=List[schemas.Category])
def get_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all equipment categories"""
    categories = db.query(models.Category).offset(skip).limit(limit).all()
    return categories


@app.post("/api/categories", response_model=schemas.Category, status_code=status.HTTP_201_CREATED)
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    """Create a new equipment category"""
    db_category = models.Category(**category.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category


@app.get("/api/categories/{category_id}", response_model=schemas.Category)
def get_category(category_id: int, db: Session = Depends(get_db)):
    """Get a specific category"""
    category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@app.put("/api/categories/{category_id}", response_model=schemas.Category)
def update_category(category_id: int, category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    """Update a category"""
    db_category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    for key, value in category.dict().items():
        setattr(db_category, key, value)
    
    db.commit()
    db.refresh(db_category)
    return db_category


@app.delete("/api/categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(category_id: int, db: Session = Depends(get_db)):
    """Delete a category"""
    db_category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    db.delete(db_category)
    db.commit()
    return None


# ============================================================================
# USER ENDPOINTS
# ============================================================================

@app.get("/api/users", response_model=List[schemas.UserResponse])
def get_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all users"""
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users


@app.post("/api/users", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user_data: schemas.UserRegister, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    """Create a new user (admin only)"""
    # Check if current user is admin
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can create users"
        )

    # Check if user already exists
    existing_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new user
    hashed_password = auth.get_password_hash(user_data.password)
    new_user = models.User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hashed_password,
        role=user_data.role or "Standard User",
        is_admin=user_data.is_admin or False
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@app.get("/api/users/{user_id}", response_model=schemas.UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    """Get a specific user"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# ============================================================================
# TEAM ENDPOINTS
# ============================================================================

@app.get("/api/teams", response_model=List[schemas.Team])
def get_teams(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all maintenance teams"""
    teams = db.query(models.Team).filter(models.Team.active == True).offset(skip).limit(limit).all()
    return teams


@app.post("/api/teams", response_model=schemas.Team, status_code=status.HTTP_201_CREATED)
def create_team(team: schemas.TeamCreate, db: Session = Depends(get_db)):
    """Create a new maintenance team"""
    team_data = team.dict()
    member_ids = team_data.pop('member_ids', [])

    db_team = models.Team(**team_data)

    # Add team members
    if member_ids:
        members = db.query(models.User).filter(models.User.id.in_(member_ids)).all()
        db_team.members = members

    db.add(db_team)
    db.commit()
    db.refresh(db_team)
    return db_team


@app.get("/api/teams/{team_id}", response_model=schemas.Team)
def get_team(team_id: int, db: Session = Depends(get_db)):
    """Get a specific team"""
    team = db.query(models.Team).filter(models.Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return team


@app.put("/api/teams/{team_id}", response_model=schemas.Team)
def update_team(team_id: int, team: schemas.TeamCreate, db: Session = Depends(get_db)):
    """Update a team"""
    db_team = db.query(models.Team).filter(models.Team.id == team_id).first()
    if not db_team:
        raise HTTPException(status_code=404, detail="Team not found")

    for key, value in team.dict(exclude_unset=True).items():
        setattr(db_team, key, value)

    db.commit()
    db.refresh(db_team)
    return db_team


@app.delete("/api/teams/{team_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_team(team_id: int, db: Session = Depends(get_db)):
    """Delete a team"""
    db_team = db.query(models.Team).filter(models.Team.id == team_id).first()
    if not db_team:
        raise HTTPException(status_code=404, detail="Team not found")

    db.delete(db_team)
    db.commit()
    return None


# ============================================================================
# EQUIPMENT ENDPOINTS
# ============================================================================

@app.get("/api/equipment", response_model=List[schemas.Equipment])
def get_equipment(skip: int = 0, limit: int = 100, active_only: bool = True, db: Session = Depends(get_db)):
    """Get all equipment"""
    query = db.query(models.Equipment)
    if active_only:
        query = query.filter(models.Equipment.active == True)
    equipment = query.offset(skip).limit(limit).all()
    return equipment


@app.post("/api/equipment", response_model=schemas.Equipment, status_code=status.HTTP_201_CREATED)
def create_equipment(equipment: schemas.EquipmentCreate, db: Session = Depends(get_db)):
    """Create new equipment"""
    db_equipment = models.Equipment(**equipment.dict())
    db.add(db_equipment)
    db.commit()
    db.refresh(db_equipment)
    return db_equipment


@app.get("/api/equipment/{equipment_id}", response_model=schemas.Equipment)
def get_equipment_by_id(equipment_id: int, db: Session = Depends(get_db)):
    """Get specific equipment"""
    equipment = db.query(models.Equipment).filter(models.Equipment.id == equipment_id).first()
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return equipment


@app.get("/api/equipment/{equipment_id}/details", response_model=schemas.EquipmentDetails)
def get_equipment_details(equipment_id: int, db: Session = Depends(get_db)):
    """Get equipment details for auto-population in maintenance requests"""
    equipment = db.query(models.Equipment).filter(models.Equipment.id == equipment_id).first()
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")

    # Prevent creating requests for scrapped equipment
    if equipment.is_scrap:
        raise HTTPException(
            status_code=400,
            detail="Cannot create maintenance request for scrapped equipment"
        )

    return equipment


@app.put("/api/equipment/{equipment_id}", response_model=schemas.Equipment)
def update_equipment(equipment_id: int, equipment: schemas.EquipmentCreate, db: Session = Depends(get_db)):
    """Update equipment"""
    db_equipment = db.query(models.Equipment).filter(models.Equipment.id == equipment_id).first()
    if not db_equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")

    for key, value in equipment.dict(exclude_unset=True).items():
        setattr(db_equipment, key, value)

    db.commit()
    db.refresh(db_equipment)
    return db_equipment


@app.post("/api/equipment/{equipment_id}/scrap", response_model=schemas.Equipment)
def scrap_equipment(equipment_id: int, db: Session = Depends(get_db)):
    """Mark equipment as scrapped"""
    from datetime import date

    db_equipment = db.query(models.Equipment).filter(models.Equipment.id == equipment_id).first()
    if not db_equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")

    db_equipment.is_scrap = True
    db_equipment.scrap_date = date.today()
    db_equipment.active = False

    db.commit()
    db.refresh(db_equipment)
    return db_equipment


@app.get("/api/equipment/{equipment_id}/requests", response_model=List[schemas.MaintenanceRequest])
def get_equipment_requests(equipment_id: int, db: Session = Depends(get_db)):
    """Get all maintenance requests for a specific equipment"""
    equipment = db.query(models.Equipment).filter(models.Equipment.id == equipment_id).first()
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")

    requests = db.query(models.MaintenanceRequest).filter(
        models.MaintenanceRequest.equipment_id == equipment_id
    ).order_by(models.MaintenanceRequest.created_at.desc()).all()

    return requests


@app.get("/api/equipment/{equipment_id}/requests/count")
def get_equipment_requests_count(equipment_id: int, db: Session = Depends(get_db)):
    """Get count of open maintenance requests for a specific equipment"""
    equipment = db.query(models.Equipment).filter(models.Equipment.id == equipment_id).first()
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")

    # Get done stages
    done_stages = db.query(models.Stage.id).filter(models.Stage.done == True).all()
    done_stage_ids = [stage[0] for stage in done_stages]

    # Count open requests (not in done stages)
    open_count = db.query(models.MaintenanceRequest).filter(
        models.MaintenanceRequest.equipment_id == equipment_id,
        models.MaintenanceRequest.active == True,
        ~models.MaintenanceRequest.stage_id.in_(done_stage_ids) if done_stage_ids else True
    ).count()

    return {"count": open_count}


# ============================================================================
# STAGE ENDPOINTS
# ============================================================================

@app.get("/api/stages", response_model=List[schemas.Stage])
def get_stages(db: Session = Depends(get_db)):
    """Get all stages"""
    stages = db.query(models.Stage).order_by(models.Stage.sequence).all()
    return stages


@app.post("/api/stages", response_model=schemas.Stage, status_code=status.HTTP_201_CREATED)
def create_stage(stage: schemas.StageCreate, db: Session = Depends(get_db)):
    """Create a new stage"""
    db_stage = models.Stage(**stage.dict())
    db.add(db_stage)
    db.commit()
    db.refresh(db_stage)
    return db_stage


@app.put("/api/stages/{stage_id}", response_model=schemas.Stage)
def update_stage(stage_id: int, stage: schemas.StageCreate, db: Session = Depends(get_db)):
    """Update a stage"""
    db_stage = db.query(models.Stage).filter(models.Stage.id == stage_id).first()
    if not db_stage:
        raise HTTPException(status_code=404, detail="Stage not found")

    for key, value in stage.dict(exclude_unset=True).items():
        setattr(db_stage, key, value)

    db.commit()
    db.refresh(db_stage)
    return db_stage


@app.delete("/api/stages/{stage_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_stage(stage_id: int, db: Session = Depends(get_db)):
    """Delete a stage"""
    db_stage = db.query(models.Stage).filter(models.Stage.id == stage_id).first()
    if not db_stage:
        raise HTTPException(status_code=404, detail="Stage not found")

    db.delete(db_stage)
    db.commit()
    return None


# ============================================================================
# MAINTENANCE REQUEST ENDPOINTS
# ============================================================================

@app.get("/api/requests", response_model=List[schemas.MaintenanceRequest])
def get_requests(
    skip: int = 0,
    limit: int = 100,
    active_only: bool = True,
    equipment_id: int = None,
    team_id: int = None,
    stage_id: int = None,
    request_type: str = None,
    db: Session = Depends(get_db)
):
    """Get all maintenance requests with optional filters"""
    query = db.query(models.MaintenanceRequest)

    if active_only:
        query = query.filter(models.MaintenanceRequest.active == True)
    if equipment_id:
        query = query.filter(models.MaintenanceRequest.equipment_id == equipment_id)
    if team_id:
        query = query.filter(models.MaintenanceRequest.maintenance_team_id == team_id)
    if stage_id:
        query = query.filter(models.MaintenanceRequest.stage_id == stage_id)
    if request_type:
        query = query.filter(models.MaintenanceRequest.request_type == request_type)

    requests = query.order_by(models.MaintenanceRequest.priority.desc()).offset(skip).limit(limit).all()
    return requests


@app.post("/api/requests", response_model=schemas.MaintenanceRequest, status_code=status.HTTP_201_CREATED)
def create_request(request: schemas.MaintenanceRequestCreate, db: Session = Depends(get_db)):
    """Create a new maintenance request"""
    # Auto-fill team and technician from equipment if not provided
    if not request.maintenance_team_id or not request.technician_id:
        equipment = db.query(models.Equipment).filter(models.Equipment.id == request.equipment_id).first()
        if equipment:
            if not request.maintenance_team_id and equipment.maintenance_team_id:
                request.maintenance_team_id = equipment.maintenance_team_id
            if not request.technician_id and equipment.technician_id:
                request.technician_id = equipment.technician_id

    db_request = models.MaintenanceRequest(**request.dict())
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request


@app.get("/api/requests/{request_id}", response_model=schemas.MaintenanceRequest)
def get_request(request_id: int, db: Session = Depends(get_db)):
    """Get a specific maintenance request"""
    request = db.query(models.MaintenanceRequest).filter(models.MaintenanceRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    return request


@app.put("/api/requests/{request_id}", response_model=schemas.MaintenanceRequest)
def update_request(request_id: int, request: schemas.MaintenanceRequestUpdate, db: Session = Depends(get_db)):
    """Update a maintenance request"""
    from datetime import date, datetime

    db_request = db.query(models.MaintenanceRequest).filter(models.MaintenanceRequest.id == request_id).first()
    if not db_request:
        raise HTTPException(status_code=404, detail="Request not found")

    # Check if moving to a different stage
    if request.stage_id and request.stage_id != db_request.stage_id:
        stage = db.query(models.Stage).filter(models.Stage.id == request.stage_id).first()
        if stage:
            # If moving to scrap stage, mark equipment as scrapped
            if stage.is_scrap:
                equipment = db_request.equipment
                equipment.is_scrap = True
                equipment.scrap_date = date.today()
                equipment.active = False

            # If moving to done stage, set close_date
            if stage.done and not db_request.close_date:
                db_request.close_date = datetime.now()

    for key, value in request.dict(exclude_unset=True).items():
        setattr(db_request, key, value)

    db.commit()
    db.refresh(db_request)
    return db_request


@app.post("/api/requests/{request_id}/assign-to-me", response_model=schemas.MaintenanceRequest)
def assign_request_to_me(
    request_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Assign a maintenance request to the current user (only if they're in the team)"""
    db_request = db.query(models.MaintenanceRequest).filter(models.MaintenanceRequest.id == request_id).first()
    if not db_request:
        raise HTTPException(status_code=404, detail="Request not found")

    # Check if user is a member of the assigned maintenance team
    if db_request.maintenance_team_id:
        team = db.query(models.Team).filter(models.Team.id == db_request.maintenance_team_id).first()
        if team:
            team_member_ids = [member.id for member in team.members]
            if current_user.id not in team_member_ids and team.leader_id != current_user.id:
                raise HTTPException(
                    status_code=403,
                    detail="You must be a member of the assigned maintenance team to assign this request to yourself"
                )

    # Assign to current user
    db_request.technician_id = current_user.id

    db.commit()
    db.refresh(db_request)
    return db_request


# ============================================================================
# DASHBOARD / STATISTICS ENDPOINTS
# ============================================================================

@app.get("/api/dashboard/stats", response_model=schemas.DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    """Get dashboard statistics"""
    total_equipment = db.query(models.Equipment).count()
    active_equipment = db.query(models.Equipment).filter(models.Equipment.active == True).count()
    scrapped_equipment = db.query(models.Equipment).filter(models.Equipment.is_scrap == True).count()

    total_requests = db.query(models.MaintenanceRequest).count()

    # Get done stages
    done_stages = db.query(models.Stage.id).filter(models.Stage.done == True).all()
    done_stage_ids = [s[0] for s in done_stages]

    open_requests = db.query(models.MaintenanceRequest).filter(
        models.MaintenanceRequest.stage_id.notin_(done_stage_ids) if done_stage_ids else True
    ).count()

    completed_requests = db.query(models.MaintenanceRequest).filter(
        models.MaintenanceRequest.stage_id.in_(done_stage_ids) if done_stage_ids else False
    ).count()

    urgent_requests = db.query(models.MaintenanceRequest).filter(
        models.MaintenanceRequest.priority == "3"
    ).count()

    return {
        "total_equipment": total_equipment,
        "active_equipment": active_equipment,
        "scrapped_equipment": scrapped_equipment,
        "total_requests": total_requests,
        "open_requests": open_requests,
        "completed_requests": completed_requests,
        "urgent_requests": urgent_requests
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

