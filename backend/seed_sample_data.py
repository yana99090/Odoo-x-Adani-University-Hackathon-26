"""Seed sample equipment and maintenance requests"""
from database import SessionLocal
import models
from datetime import datetime, timedelta, date

def seed_sample_data():
    """Create sample equipment and maintenance requests"""
    db = SessionLocal()
    
    try:
        # Check if equipment already exists
        if db.query(models.Equipment).count() > 0:
            print("✅ Sample data already exists")
            return
        
        print("🌱 Seeding sample data...")
        
        # Get categories
        machines_cat = db.query(models.Category).filter(models.Category.name == "Machines").first()
        vehicles_cat = db.query(models.Category).filter(models.Category.name == "Vehicles").first()
        computers_cat = db.query(models.Category).filter(models.Category.name == "Computers").first()
        office_cat = db.query(models.Category).filter(models.Category.name == "Office Equipment").first()
        
        # Get teams
        mechanics_team = db.query(models.Team).filter(models.Team.name == "Mechanics").first()
        it_team = db.query(models.Team).filter(models.Team.name == "IT Support").first()
        
        # Get users
        admin = db.query(models.User).filter(models.User.email == "admin@gearguard.com").first()
        john = db.query(models.User).filter(models.User.name == "John Smith").first()
        alice = db.query(models.User).filter(models.User.name == "Alice Brown").first()
        
        # Create sample equipment
        equipment_list = [
            models.Equipment(
                name="CNC Machine 01",
                serial_no="CNC-2023-001",
                model="Haas VF-2",
                category_id=machines_cat.id if machines_cat else None,
                department="Production",
                owner_id=admin.id if admin else None,
                purchase_date=date(2023, 1, 15),
                purchase_value=50000.00,
                location="Factory Floor A",
                maintenance_team_id=mechanics_team.id if mechanics_team else None,
                technician_id=john.id if john else None,
                active=True
            ),
            models.Equipment(
                name="Forklift 02",
                serial_no="FL-2022-002",
                model="Toyota 8FGU25",
                category_id=vehicles_cat.id if vehicles_cat else None,
                department="Warehouse",
                owner_id=admin.id if admin else None,
                purchase_date=date(2022, 6, 10),
                purchase_value=25000.00,
                location="Warehouse B",
                maintenance_team_id=mechanics_team.id if mechanics_team else None,
                technician_id=john.id if john else None,
                active=True
            ),
            models.Equipment(
                name="Printer 01",
                serial_no="PR-2023-003",
                model="HP LaserJet Pro",
                category_id=office_cat.id if office_cat else None,
                department="IT",
                owner_id=admin.id if admin else None,
                purchase_date=date(2023, 3, 20),
                purchase_value=500.00,
                location="Office 3rd Floor",
                maintenance_team_id=it_team.id if it_team else None,
                technician_id=alice.id if alice else None,
                active=True
            ),
            models.Equipment(
                name="Server 01",
                serial_no="SRV-2021-004",
                model="Dell PowerEdge R740",
                category_id=computers_cat.id if computers_cat else None,
                department="IT",
                owner_id=admin.id if admin else None,
                purchase_date=date(2021, 8, 5),
                purchase_value=8000.00,
                location="Server Room",
                maintenance_team_id=it_team.id if it_team else None,
                technician_id=alice.id if alice else None,
                active=True
            ),
        ]
        
        for equipment in equipment_list:
            db.add(equipment)
        
        db.commit()
        print("✅ Created sample equipment")
        
        # Get stages
        new_stage = db.query(models.Stage).filter(models.Stage.name == "New").first()
        in_progress_stage = db.query(models.Stage).filter(models.Stage.name == "In Progress").first()
        repaired_stage = db.query(models.Stage).filter(models.Stage.name == "Repaired").first()
        
        # Create sample maintenance requests
        requests = [
            models.MaintenanceRequest(
                name="CNC Machine - Coolant leak",
                request_type="corrective",
                priority="3",  # Urgent
                equipment_id=equipment_list[0].id,
                maintenance_team_id=mechanics_team.id if mechanics_team else None,
                technician_id=john.id if john else None,
                stage_id=new_stage.id if new_stage else None,
                description="Coolant is leaking from the main pump. Needs immediate attention.",
                schedule_date=None
            ),
            models.MaintenanceRequest(
                name="Forklift - Preventive Maintenance",
                request_type="preventive",
                priority="1",  # Medium
                equipment_id=equipment_list[1].id,
                maintenance_team_id=mechanics_team.id if mechanics_team else None,
                technician_id=john.id if john else None,
                stage_id=new_stage.id if new_stage else None,
                description="Scheduled monthly preventive maintenance check",
                schedule_date=datetime.now() + timedelta(days=7)
            ),
            models.MaintenanceRequest(
                name="Printer - Paper jam issue",
                request_type="corrective",
                priority="1",  # Medium
                equipment_id=equipment_list[2].id,
                maintenance_team_id=it_team.id if it_team else None,
                technician_id=alice.id if alice else None,
                stage_id=in_progress_stage.id if in_progress_stage else None,
                description="Printer keeps jamming on tray 2",
                schedule_date=None
            ),
        ]
        
        for request in requests:
            db.add(request)
        
        db.commit()
        print("✅ Created sample maintenance requests")
        
        print("\n🎉 Sample data seeded successfully!")
        
    except Exception as e:
        print(f"❌ Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_sample_data()

