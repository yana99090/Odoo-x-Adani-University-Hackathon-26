"""Initialize database with default data"""
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
import auth

def init_database():
    """Create tables and add default data"""
    # Create all tables
    models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Check if data already exists
        if db.query(models.Stage).count() > 0:
            print("✅ Database already initialized")
            return
        
        print("🔧 Initializing database...")
        
        # Create default stages
        stages = [
            models.Stage(
                name="New",
                sequence=1,
                fold=False,
                done=False,
                is_scrap=False,
                description="Newly created maintenance request"
            ),
            models.Stage(
                name="In Progress",
                sequence=2,
                fold=False,
                done=False,
                is_scrap=False,
                description="Technician is working on this request"
            ),
            models.Stage(
                name="Repaired",
                sequence=3,
                fold=False,
                done=True,
                is_scrap=False,
                description="Equipment has been repaired and is working"
            ),
            models.Stage(
                name="Scrap",
                sequence=4,
                fold=True,
                done=True,
                is_scrap=True,
                description="Equipment cannot be repaired and must be scrapped"
            ),
        ]
        
        for stage in stages:
            db.add(stage)
        
        print("✅ Created default stages")
        
        # Check if users already exist (from seed_users.py)
        existing_users = db.query(models.User).all()
        if len(existing_users) == 0:
            # Create default admin user
            admin_user = models.User(
                email="admin@gearguard.com",
                name="Administrator",
                password_hash=auth.get_password_hash("admin123"),
                is_active=True,
                is_admin=True
            )
            db.add(admin_user)

            print("✅ Created admin user (admin@gearguard.com / admin123)")

            # Create sample users
            users = [
                models.User(
                    email="john.smith@company.com",
                    name="John Smith",
                    password_hash=auth.get_password_hash("password123"),
                    is_active=True,
                    is_admin=False
                ),
                models.User(
                    email="alice.brown@company.com",
                    name="Alice Brown",
                    password_hash=auth.get_password_hash("password123"),
                    is_active=True,
                    is_admin=False
                ),
                models.User(
                    email="mike.johnson@company.com",
                    name="Mike Johnson",
                    password_hash=auth.get_password_hash("password123"),
                    is_active=True,
                    is_admin=False
                ),
            ]
        else:
            print("✅ Users already exist, skipping user creation")
            users = existing_users[1:4] if len(existing_users) > 3 else existing_users
        
        for user in users:
            db.add(user)
        
        db.commit()
        
        print("✅ Created sample users")
        
        # Create sample categories
        categories = [
            models.Category(name="Machines", color=1, note="Heavy machinery and industrial equipment"),
            models.Category(name="Vehicles", color=2, note="Company cars, trucks, forklifts"),
            models.Category(name="Computers", color=3, note="Laptops, desktops, servers"),
            models.Category(name="Office Equipment", color=4, note="Printers, scanners, copiers"),
        ]
        
        for category in categories:
            db.add(category)
        
        db.commit()
        
        print("✅ Created sample categories")
        
        # Create sample teams
        mechanics_team = models.Team(
            name="Mechanics",
            active=True,
            color=1,
            description="Responsible for machines and vehicles",
            leader_id=2  # John Smith
        )
        mechanics_team.members = [users[0], users[2]]  # John and Mike
        db.add(mechanics_team)
        
        it_team = models.Team(
            name="IT Support",
            active=True,
            color=2,
            description="Responsible for computers and office equipment",
            leader_id=3  # Alice Brown
        )
        it_team.members = [users[1]]  # Alice
        db.add(it_team)
        
        db.commit()
        
        print("✅ Created sample teams")
        
        print("\n🎉 Database initialized successfully!")
        print("\n📝 Login credentials:")
        print("   Email: admin@gearguard.com")
        print("   Password: admin123")
        print("\n🚀 Start the server with: python main.py")
        
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    init_database()

