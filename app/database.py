import sqlite3
import json
from datetime import datetime
from typing import List, Dict, Any, Optional
from contextlib import contextmanager

class DatabaseService:
    def __init__(self, db_path: str = "merged_memory.db"):
        self.db_path = db_path
        self.init_database()
    
    @contextmanager
    def get_connection(self):
        """Context manager for database connections"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row  # Return rows as dictionaries
        try:
            yield conn
        finally:
            conn.close()
    
    def init_database(self):
        """Initialize database tables"""
        with self.get_connection() as conn:
            # Teachers table
            conn.execute("""
                CREATE TABLE IF NOT EXISTS teachers (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    teacher_id TEXT UNIQUE NOT NULL,
                    name TEXT NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    school TEXT NOT NULL,
                    district TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # Submissions table (from chat)
            conn.execute("""
                CREATE TABLE IF NOT EXISTS submissions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    teacher_id TEXT NOT NULL,
                    problem TEXT NOT NULL,
                    language TEXT NOT NULL,
                    infrastructure TEXT NOT NULL,
                    raw_message TEXT NOT NULL,
                    strategy TEXT NOT NULL,
                    status TEXT DEFAULT 'Pending',
                    diet_officer TEXT,
                    feedback TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id)
                )
            """)
            
            # Create indexes
            conn.execute("CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status)")
            conn.execute("CREATE INDEX IF NOT EXISTS idx_submissions_teacher ON submissions(teacher_id)")
            conn.execute("CREATE INDEX IF NOT EXISTS idx_submissions_created ON submissions(created_at DESC)")
            
            # Insert sample data if empty
            cursor = conn.execute("SELECT COUNT(*) as count FROM submissions")
            if cursor.fetchone()["count"] == 0:
                self._insert_sample_data(conn)
            
            conn.commit()
    
    def _insert_sample_data(self, conn):
        """Insert sample data for testing"""
        # Insert sample teacher
        conn.execute("""
            INSERT OR IGNORE INTO teachers (teacher_id, name, email, school, district)
            VALUES (?, ?, ?, ?, ?)
        """, ("TCH_001", "Ravi Kumar", "ravi@school.edu", "Govt High School", "Pune"))
        
        # Insert sample submissions
        sample_submissions = [
            ("TCH_001", "Absenteeism", "Hindi", "Low", 
             "Many students are not attending Hindi classes regularly", 
             "Sample strategy for absenteeism", "Pending"),
            ("TCH_001", "Learning Gaps", "Marathi", "Medium", 
             "Students struggling with basic Marathi grammar", 
             "Sample strategy for learning gaps", "Approved"),
            ("TCH_001", "Engagement", "English", "High", 
             "Students find English classes boring", 
             "Sample strategy for engagement", "Pending"),
        ]
        
        for sub in sample_submissions:
            conn.execute("""
                INSERT INTO submissions 
                (teacher_id, problem, language, infrastructure, raw_message, strategy, status, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (*sub, datetime.now().isoformat()))
    
    # Teacher methods
    def create_teacher(self, data: Dict[str, Any]) -> str:
        """Create a new teacher"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            # Generate teacher ID
            cursor.execute("SELECT MAX(id) as max_id FROM teachers")
            max_id = cursor.fetchone()["max_id"] or 0
            teacher_id = f"TCH_{max_id + 1:03d}"
            
            cursor.execute("""
                INSERT INTO teachers (teacher_id, name, email, school, district)
                VALUES (?, ?, ?, ?, ?)
            """, (teacher_id, data["name"], data["email"], data["school"], data["district"]))
            conn.commit()
            return teacher_id
    
    def get_teacher(self, teacher_id: str) -> Optional[Dict[str, Any]]:
        """Get teacher by ID"""
        with self.get_connection() as conn:
            cursor = conn.execute("SELECT * FROM teachers WHERE teacher_id = ?", (teacher_id,))
            row = cursor.fetchone()
            return dict(row) if row else None
    
    def get_all_teachers(self) -> List[Dict[str, Any]]:
        """Get all teachers"""
        with self.get_connection() as conn:
            cursor = conn.execute("SELECT * FROM teachers ORDER BY created_at DESC")
            return [dict(row) for row in cursor.fetchall()]
    
    # Submission methods (for chat)
    def create_submission(self, data: Dict[str, Any]) -> int:
        """Create a new submission from chat"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO submissions 
                (teacher_id, problem, language, infrastructure, raw_message, strategy, status, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                data["teacher_id"],
                data["problem"],
                data["language"],
                data["infrastructure"],
                data["raw_message"],
                data["strategy"],
                data.get("status", "Pending"),
                data["created_at"]
            ))
            conn.commit()
            return cursor.lastrowid
    
    def get_submission_by_id(self, submission_id: int) -> Optional[Dict[str, Any]]:
        """Get submission by ID"""
        with self.get_connection() as conn:
            cursor = conn.execute("SELECT * FROM submissions WHERE id = ?", (submission_id,))
            row = cursor.fetchone()
            return dict(row) if row else None
    
    def get_submissions_by_status(self, status: str) -> List[Dict[str, Any]]:
        """Get submissions by status"""
        with self.get_connection() as conn:
            cursor = conn.execute(
                "SELECT * FROM submissions WHERE status = ? ORDER BY created_at DESC", 
                (status,)
            )
            return [dict(row) for row in cursor.fetchall()]
    
    def get_all_submissions(self) -> List[Dict[str, Any]]:
        """Get all submissions"""
        with self.get_connection() as conn:
            cursor = conn.execute("SELECT * FROM submissions ORDER BY created_at DESC")
            return [dict(row) for row in cursor.fetchall()]
    
    def get_teacher_submissions(self, teacher_id: str) -> List[Dict[str, Any]]:
        """Get all submissions by a teacher"""
        with self.get_connection() as conn:
            cursor = conn.execute(
                """SELECT * FROM submissions 
                   WHERE teacher_id = ? 
                   ORDER BY created_at DESC""",
                (teacher_id,)
            )
            rows = cursor.fetchall()
            return [dict(row) for row in rows]
    
    def update_submission_status(self, submission_id: int, status: str, 
                                officer_id: str = None, feedback: str = None) -> bool:
        """Update submission status"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                UPDATE submissions 
                SET status = ?, diet_officer = ?, feedback = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            """, (status, officer_id, feedback, submission_id))
            conn.commit()
            return cursor.rowcount > 0
    
    def get_submission_stats(self) -> Dict[str, int]:
        """Get submission statistics"""
        with self.get_connection() as conn:
            cursor = conn.execute("""
                SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending,
                    SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) as approved,
                    SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) as rejected
                FROM submissions
            """)
            row = cursor.fetchone()
            return dict(row) if row else {
                "total": 0,
                "pending": 0,
                "approved": 0,
                "rejected": 0
            }
    
    def get_district_submission_stats(self) -> List[Dict[str, Any]]:
        """Get district-wise statistics"""
        with self.get_connection() as conn:
            cursor = conn.execute("""
                SELECT 
                    t.district,
                    COUNT(s.id) as total_submissions,
                    SUM(CASE WHEN s.status = 'Pending' THEN 1 ELSE 0 END) as pending,
                    SUM(CASE WHEN s.status = 'Approved' THEN 1 ELSE 0 END) as approved,
                    SUM(CASE WHEN s.status = 'Rejected' THEN 1 ELSE 0 END) as rejected
                FROM teachers t
                LEFT JOIN submissions s ON t.teacher_id = s.teacher_id
                GROUP BY t.district
                ORDER BY total_submissions DESC
            """)
            rows = cursor.fetchall()
            # Return empty array if no data
            if not rows:
                return []
            return [dict(row) for row in rows]