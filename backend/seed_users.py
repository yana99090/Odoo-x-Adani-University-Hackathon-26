"""
Seed script to add 5 test users to the database
Run this script to populate the database with test users for easy login
"""
from database import SessionLocal, engine
import models
from auth import get_password_hash

# Create tables if they don't exist
models.Base.metadata.create_all(bind=engine)

# Test users data
test_users = [
    {
        "name": "Admin User",
        "email": "admin@gearguard.com",
        "password": "admin123",
        "role": "Administrator",
        "is_admin": True
    },
    {
        "name": "John Smith",
        "email": "john@gearguard.com",
        "password": "john123",
        "role": "Manager",
        "is_admin": False
    },
    {
        "name": "Sarah Johnson",
        "email": "sarah@gearguard.com",
        "password": "sarah123",
        "role": "Team Leader",
        "is_admin": False
    },
    {
        "name": "Mike Wilson",
        "email": "mike@gearguard.com",
        "password": "mike123",
        "role": "Technician",
        "is_admin": False
    },
    {
        "name": "Emily Davis",
        "email": "emily@gearguard.com",
        "password": "emily123",
        "role": "Standard User",
        "is_admin": False
    }
]

def seed_users():
    """Add test users to the database"""
    db = SessionLocal()
    
    try:
        print("🌱 Seeding test users...")
        
        for user_data in test_users:
            # Check if user already exists
            existing_user = db.query(models.User).filter(
                models.User.email == user_data["email"]
            ).first()
            
            if existing_user:
                print(f"⏭️  User {user_data['email']} already exists, skipping...")
                continue
            
            # Create new user
            # Truncate password to 72 bytes for bcrypt
            password = user_data["password"][:72]
            new_user = models.User(
                name=user_data["name"],
                email=user_data["email"],
                password_hash=get_password_hash(password),
                role=user_data.get("role", "Standard User"),
                is_admin=user_data["is_admin"],
                is_active=True
            )
            
            db.add(new_user)
            db.commit()
            print(f"✅ Created user: {user_data['name']} ({user_data['email']})")
        
        print("\n🎉 Database seeding completed!")
        print("\n📋 Test User Credentials:")
        print("=" * 50)
        for user in test_users:
            print(f"Name: {user['name']}")
            print(f"Email: {user['email']}")
            print(f"Password: {user['password']}")
            print(f"Role: {user.get('role', 'Standard User')}")
            print("-" * 50)
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_users()

