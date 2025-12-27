"""
Script to add team members to existing teams
"""
from database import SessionLocal, engine
import models

def add_team_members():
    """Add users as members to teams"""
    db = SessionLocal()
    
    try:
        print("🌱 Adding team members...")
        
        # Get all teams
        mechanics_team = db.query(models.Team).filter(models.Team.name == "Mechanics").first()
        it_support_team = db.query(models.Team).filter(models.Team.name == "IT Support").first()
        
        if not mechanics_team or not it_support_team:
            print("❌ Teams not found! Please create teams first.")
            return
        
        # Get all users
        john = db.query(models.User).filter(models.User.email == "john@gearguard.com").first()
        sarah = db.query(models.User).filter(models.User.email == "sarah@gearguard.com").first()
        mike = db.query(models.User).filter(models.User.email == "mike@gearguard.com").first()
        emily = db.query(models.User).filter(models.User.email == "emily@gearguard.com").first()
        
        if not all([john, sarah, mike, emily]):
            print("❌ Some users not found! Please run seed_users.py first.")
            return
        
        # Add members to Mechanics team
        print(f"\n📋 Adding members to {mechanics_team.name} team...")
        if john not in mechanics_team.members:
            mechanics_team.members.append(john)
            print(f"  ✅ Added {john.name}")
        else:
            print(f"  ⏭️  {john.name} already in team")
            
        if mike not in mechanics_team.members:
            mechanics_team.members.append(mike)
            print(f"  ✅ Added {mike.name}")
        else:
            print(f"  ⏭️  {mike.name} already in team")
        
        # Add members to IT Support team
        print(f"\n📋 Adding members to {it_support_team.name} team...")
        if sarah not in it_support_team.members:
            it_support_team.members.append(sarah)
            print(f"  ✅ Added {sarah.name}")
        else:
            print(f"  ⏭️  {sarah.name} already in team")
            
        if emily not in it_support_team.members:
            it_support_team.members.append(emily)
            print(f"  ✅ Added {emily.name}")
        else:
            print(f"  ⏭️  {emily.name} already in team")
        
        # Set team leaders
        print(f"\n👔 Setting team leaders...")
        if mechanics_team.leader_id != john.id:
            mechanics_team.leader_id = john.id
            print(f"  ✅ Set {john.name} as leader of {mechanics_team.name}")
        else:
            print(f"  ⏭️  {john.name} already leader of {mechanics_team.name}")
            
        if it_support_team.leader_id != sarah.id:
            it_support_team.leader_id = sarah.id
            print(f"  ✅ Set {sarah.name} as leader of {it_support_team.name}")
        else:
            print(f"  ⏭️  {sarah.name} already leader of {it_support_team.name}")
        
        db.commit()
        
        print("\n🎉 Team members added successfully!")
        print("\n📊 Team Summary:")
        print("=" * 60)
        
        # Refresh to get updated relationships
        db.refresh(mechanics_team)
        db.refresh(it_support_team)
        
        print(f"\n🔧 {mechanics_team.name}")
        print(f"   Leader: {mechanics_team.leader.name if mechanics_team.leader else 'Not assigned'}")
        print(f"   Members: {len(mechanics_team.members)}")
        for member in mechanics_team.members:
            print(f"     - {member.name} ({member.email})")
        
        print(f"\n💻 {it_support_team.name}")
        print(f"   Leader: {it_support_team.leader.name if it_support_team.leader else 'Not assigned'}")
        print(f"   Members: {len(it_support_team.members)}")
        for member in it_support_team.members:
            print(f"     - {member.name} ({member.email})")
        
        print("\n" + "=" * 60)
        
    except Exception as e:
        print(f"❌ Error adding team members: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    add_team_members()

