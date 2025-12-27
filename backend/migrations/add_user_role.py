"""
Migration script to add role column to users table
Run this script to update the database schema
"""

import sqlite3
import os

def migrate():
    """Add role column to users table"""
    db_path = os.path.join(os.path.dirname(__file__), '..', 'gearguard.db')
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if column already exists
        cursor.execute("PRAGMA table_info(users)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'role' not in columns:
            # Add role column with default value
            cursor.execute("""
                ALTER TABLE users 
                ADD COLUMN role TEXT DEFAULT 'Standard User'
            """)
            
            # Update existing users with appropriate roles
            # Admin users get 'Administrator' role
            cursor.execute("""
                UPDATE users 
                SET role = 'Administrator' 
                WHERE is_admin = 1
            """)
            
            # Other users keep 'Standard User' role
            cursor.execute("""
                UPDATE users 
                SET role = 'Standard User' 
                WHERE is_admin = 0 OR is_admin IS NULL
            """)
            
            conn.commit()
            print("✓ Successfully added 'role' column to users table")
            print("✓ Updated existing users with appropriate roles")
        else:
            print("✓ 'role' column already exists in users table")
        
        conn.close()
        
    except Exception as e:
        print(f"✗ Error during migration: {e}")
        raise

if __name__ == "__main__":
    migrate()

