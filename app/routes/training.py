# app/routes/training.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# FIXED IMPORTS
try:
    from app.database import DatabaseService
except ImportError:
    from app.database import DatabaseService

# Create router instance
router = APIRouter(prefix="/training", tags=["training"])
db = DatabaseService()

# Models
class TrainingModule(BaseModel):
    id: int
    title: str
    description: str
    language: str
    duration: str
    level: str

class EnrollmentRequest(BaseModel):
    teacher_id: str
    training_id: int

# Routes
@router.get("/modules", response_model=List[TrainingModule])
async def get_training_modules(language: Optional[str] = None):
    """Get available training modules"""
    try:
        # Mock training modules
        modules = [
            {
                "id": 1,
                "title": "Effective Classroom Management",
                "description": "Learn strategies for managing diverse classrooms",
                "language": "Multilingual",
                "duration": "2 weeks",
                "level": "Beginner"
            },
            {
                "id": 2,
                "title": "Bengali Language Teaching",
                "description": "Specialized techniques for Bengali medium teaching",
                "language": "Bengali",
                "duration": "3 weeks",
                "level": "Intermediate"
            },
            {
                "id": 3,
                "title": "Digital Teaching Tools",
                "description": "Using technology in low-infrastructure classrooms",
                "language": "English",
                "duration": "1 week",
                "level": "Beginner"
            },
            {
                "id": 4,
                "title": "Student Engagement Strategies",
                "description": "Interactive teaching methods for better engagement",
                "language": "Hindi",
                "duration": "2 weeks",
                "level": "Intermediate"
            }
        ]
        
        if language:
            modules = [m for m in modules if m["language"].lower() == language.lower() or m["language"] == "Multilingual"]
        
        return modules
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/enroll")
async def enroll_training(enrollment: EnrollmentRequest):
    """Enroll teacher in a training module"""
    try:
        # In real app, you would store enrollment in database
        
        return {
            "success": True,
            "message": f"Teacher {enrollment.teacher_id} enrolled in training {enrollment.training_id}",
            "enrollment_date": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/enrollments/{teacher_id}")
async def get_teacher_enrollments(teacher_id: str):
    """Get all enrollments for a teacher"""
    try:
        # Mock enrollments
        return {
            "teacher_id": teacher_id,
            "enrollments": [
                {"training_id": 1, "status": "Completed", "completion_date": "2024-01-15"},
                {"training_id": 2, "status": "In Progress", "start_date": "2024-01-20"}
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))