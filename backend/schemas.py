"""Pydantic schemas for request/response validation"""
from __future__ import annotations
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import date, datetime


# ============================================================================
# AUTHENTICATION SCHEMAS
# ============================================================================

class UserRegister(BaseModel):
    """Schema for user registration"""
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)
    role: Optional[str] = "Standard User"
    is_admin: Optional[bool] = False


class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """Schema for user response (without password)"""
    id: int
    name: str
    email: str
    profile_picture: Optional[str] = None
    role: str = "Standard User"
    is_active: bool
    is_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    """Schema for JWT token response"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Rebuild the Token model to resolve forward references
Token.model_rebuild()


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str
    role: Optional[str] = "Standard User"

class User(UserBase):
    id: int
    is_active: bool
    is_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True


class UserBasic(BaseModel):
    """Basic user info for nested relationships"""
    id: int
    name: str
    email: str
    profile_picture: Optional[str] = None
    role: str = "Standard User"

    class Config:
        from_attributes = True


# Category Schemas
class CategoryBase(BaseModel):
    name: str
    color: Optional[int] = 0
    note: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Team Schemas
class TeamBase(BaseModel):
    name: str
    active: Optional[bool] = True
    color: Optional[int] = 0
    description: Optional[str] = None
    leader_id: Optional[int] = None

class TeamCreate(TeamBase):
    member_ids: Optional[List[int]] = []

class Team(TeamBase):
    id: int
    created_at: datetime
    leader: Optional['UserBasic'] = None
    members: List['UserBasic'] = []

    class Config:
        from_attributes = True


# Equipment Schemas
class EquipmentBase(BaseModel):
    name: str
    active: Optional[bool] = True
    serial_no: Optional[str] = None
    model: Optional[str] = None
    category_id: Optional[int] = None
    department: Optional[str] = None
    owner_id: Optional[int] = None
    purchase_date: Optional[date] = None
    purchase_value: Optional[float] = None
    warranty_date: Optional[date] = None
    warranty_period: Optional[int] = None
    location: Optional[str] = None
    maintenance_team_id: Optional[int] = None
    technician_id: Optional[int] = None
    note: Optional[str] = None
    is_scrap: Optional[bool] = False
    scrap_date: Optional[date] = None

class EquipmentCreate(EquipmentBase):
    pass

class Equipment(EquipmentBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class EquipmentDetails(BaseModel):
    """Equipment details for auto-population in maintenance requests"""
    id: int
    name: str
    category_id: Optional[int] = None
    maintenance_team_id: Optional[int] = None
    technician_id: Optional[int] = None
    is_scrap: bool = False

    class Config:
        from_attributes = True


# Stage Schemas
class StageBase(BaseModel):
    name: str
    sequence: Optional[int] = 10
    fold: Optional[bool] = False
    done: Optional[bool] = False
    is_scrap: Optional[bool] = False
    description: Optional[str] = None

class StageCreate(StageBase):
    pass

class Stage(StageBase):
    id: int

    class Config:
        from_attributes = True


# Maintenance Request Schemas
class MaintenanceRequestBase(BaseModel):
    name: str
    active: Optional[bool] = True
    request_type: Optional[str] = "corrective"  # corrective or preventive
    priority: Optional[str] = "1"  # 0=Low, 1=Medium, 2=High, 3=Urgent
    equipment_id: int
    maintenance_team_id: Optional[int] = None
    technician_id: Optional[int] = None
    schedule_date: Optional[datetime] = None
    close_date: Optional[datetime] = None
    duration: Optional[float] = None
    stage_id: Optional[int] = None
    description: Optional[str] = None

class MaintenanceRequestCreate(MaintenanceRequestBase):
    pass

class MaintenanceRequestUpdate(BaseModel):
    name: Optional[str] = None
    active: Optional[bool] = None
    request_type: Optional[str] = None
    priority: Optional[str] = None
    maintenance_team_id: Optional[int] = None
    technician_id: Optional[int] = None
    schedule_date: Optional[datetime] = None
    close_date: Optional[datetime] = None
    duration: Optional[float] = None
    stage_id: Optional[int] = None
    description: Optional[str] = None

class MaintenanceRequest(MaintenanceRequestBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Statistics Schemas
class DashboardStats(BaseModel):
    total_equipment: int
    active_equipment: int
    scrapped_equipment: int
    total_requests: int
    open_requests: int
    completed_requests: int
    urgent_requests: int


# Update forward references
Team.model_rebuild()
