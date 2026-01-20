# app/routes/auth.py
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta

# FIXED IMPORTS
try:
    from app.database import DatabaseService
except ImportError:
    from app.database import DatabaseService

# Create router instance
router = APIRouter(prefix="/auth", tags=["authentication"])
db = DatabaseService()

# Models
class UserLogin(BaseModel):
    email: str
    password: str

class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    role: str  # teacher, diet, scert

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user_id: str
    role: str

# Routes
@router.post("/login")
async def login(user: UserLogin):
    """User login endpoint"""
    try:
        # In a real app, you would:
        # 1. Check credentials against database
        # 2. Generate JWT token
        # 3. Return token
        
        # For now, mock implementation
        if user.email.endswith("@diet.in"):
            role = "diet"
        elif user.email.endswith("@scert.in"):
            role = "scert"
        else:
            role = "teacher"
        
        return TokenResponse(
            access_token=f"mock_token_{datetime.now().timestamp()}",
            token_type="bearer",
            user_id=user.email.split('@')[0],
            role=role
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/register")
async def register(user: UserRegister):
    """User registration endpoint"""
    try:
        # In real app, you would:
        # 1. Hash password
        # 2. Store in database
        # 3. Return success
        
        return {
            "success": True,
            "message": "User registered successfully",
            "user_id": f"user_{datetime.now().timestamp()}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/me")
async def get_current_user(token: str):
    """Get current user info"""
    try:
        # In real app, you would:
        # 1. Verify JWT token
        # 2. Return user info
        
        return {
            "id": "user_123",
            "name": "Test User",
            "email": "test@example.com",
            "role": "teacher"
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")
    
@router.get("/test")
async def test_endpoint():
    """Test endpoint to check if auth API is working"""
    return {"message": "Auth API working", "status": "ok"}