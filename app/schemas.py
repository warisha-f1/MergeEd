# app/schemas.py
from pydantic import BaseModel
from typing import Optional

class TrainingCreate(BaseModel):
    teacher_id: str
    language: str
    problem: str
    infrastructure: str
    user_query: Optional[str] = None  # For chat queries

class TrainingRecord(BaseModel):
    id: int
    teacher_id: str
    language: str
    problem: str
    infrastructure: str
    ai_response: str
    status: str
    created_at: str
    
    class Config:
        from_attributes = True