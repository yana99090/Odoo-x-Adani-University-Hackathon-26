"""
Migration script to update existing users with roles
"""
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import SessionLocal
import models

def update_user_roles():
    """Update existing users with appropriate roles"""
    db = SessionLocal()
    
    try:
        print("🔄 Updating user roles...")
        
        # Define role mappings
        role_mappings = {
            "admin@gearguard.com": "Administrator",
            "john@gearguard.com": "Manager",
            "sarah@gearguard.com": "Team Leader",
            "mike@gearguard.com": "Technician",
            "emily@gearguard.com": "Standard User",
        }
        
        for email, role in role_mappings.items():
            user = db.query(models.User).filter(models.User.email == email).first()
            if user:
                user.role = role
                db.commit()
                print(f"✅ Updated {user.name} ({email}) with role: {role}")
            else:
                print(f"⏭️  User {email} not found, skipping...")
        
        print("\n🎉 User roles updated successfully!")
        
    except Exception as e:
        print(f"❌ Error updating user roles: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    update_user_roles()

