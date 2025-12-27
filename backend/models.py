"""SQLAlchemy models - converted from Odoo models"""
from sqlalchemy import Boolean, Column, Integer, String, Float, Date, DateTime, Text, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

# Many-to-many relationship table for team members
team_members = Table(
    'team_members',
    Base.metadata,
    Column('team_id', Integer, ForeignKey('teams.id')),
    Column('user_id', Integer, ForeignKey('users.id'))
)


class User(Base):
    """User model for authentication and team members"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    profile_picture = Column(String, nullable=True)  # Profile picture URL
    role = Column(String, default="Standard User")  # User role/job title
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    owned_equipment = relationship("Equipment", back_populates="owner", foreign_keys="Equipment.owner_id")
    assigned_equipment = relationship("Equipment", back_populates="technician", foreign_keys="Equipment.technician_id")
    teams = relationship("Team", secondary=team_members, back_populates="members")
    led_teams = relationship("Team", back_populates="leader")
    assigned_requests = relationship("MaintenanceRequest", back_populates="technician")


class Category(Base):
    """Equipment Category"""
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    color = Column(Integer, default=0)
    note = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    equipment = relationship("Equipment", back_populates="category")


class Team(Base):
    """Maintenance Team"""
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    active = Column(Boolean, default=True)
    color = Column(Integer, default=0)
    description = Column(Text)
    leader_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    leader = relationship("User", back_populates="led_teams")
    members = relationship("User", secondary=team_members, back_populates="teams")
    equipment = relationship("Equipment", back_populates="maintenance_team")
    requests = relationship("MaintenanceRequest", back_populates="maintenance_team")


class Equipment(Base):
    """Equipment/Asset"""
    __tablename__ = "equipment"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    active = Column(Boolean, default=True)
    serial_no = Column(String, unique=True, index=True)
    model = Column(String)
    category_id = Column(Integer, ForeignKey("categories.id"))
    color = Column(Integer, default=0)
    
    # Ownership
    department = Column(String)
    owner_id = Column(Integer, ForeignKey("users.id"))
    
    # Purchase & Warranty
    purchase_date = Column(Date)
    purchase_value = Column(Float)
    warranty_date = Column(Date)
    warranty_period = Column(Integer)  # months
    
    # Location
    location = Column(String)
    
    # Maintenance Assignment
    maintenance_team_id = Column(Integer, ForeignKey("teams.id"))
    technician_id = Column(Integer, ForeignKey("users.id"))
    
    # Technical Details
    note = Column(Text)
    image_url = Column(String)
    
    # Status
    is_scrap = Column(Boolean, default=False)
    scrap_date = Column(Date)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    category = relationship("Category", back_populates="equipment")
    owner = relationship("User", back_populates="owned_equipment", foreign_keys=[owner_id])
    technician = relationship("User", back_populates="assigned_equipment", foreign_keys=[technician_id])
    maintenance_team = relationship("Team", back_populates="equipment")
    requests = relationship("MaintenanceRequest", back_populates="equipment")


class Stage(Base):
    """Maintenance Stage (for Kanban workflow)"""
    __tablename__ = "stages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    sequence = Column(Integer, default=10)
    fold = Column(Boolean, default=False)
    done = Column(Boolean, default=False)
    is_scrap = Column(Boolean, default=False)
    description = Column(Text)

    # Relationships
    requests = relationship("MaintenanceRequest", back_populates="stage")


class MaintenanceRequest(Base):
    """Maintenance Request"""
    __tablename__ = "maintenance_requests"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)  # Subject/Title
    active = Column(Boolean, default=True)
    
    # Request Type
    request_type = Column(String, default="corrective")  # corrective or preventive
    priority = Column(String, default="1")  # 0=Low, 1=Medium, 2=High, 3=Urgent
    color = Column(Integer, default=0)
    
    # Equipment
    equipment_id = Column(Integer, ForeignKey("equipment.id"), nullable=False)
    
    # Assignment
    maintenance_team_id = Column(Integer, ForeignKey("teams.id"))
    technician_id = Column(Integer, ForeignKey("users.id"))
    
    # Scheduling
    schedule_date = Column(DateTime)
    close_date = Column(DateTime)
    duration = Column(Float)  # hours
    
    # Stage
    stage_id = Column(Integer, ForeignKey("stages.id"))
    
    # Description
    description = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    equipment = relationship("Equipment", back_populates="requests")
    maintenance_team = relationship("Team", back_populates="requests")
    technician = relationship("User", back_populates="assigned_requests")
    stage = relationship("Stage", back_populates="requests")

