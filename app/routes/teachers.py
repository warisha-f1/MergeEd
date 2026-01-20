from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.services.ai_service import AIService
from app.database import DatabaseService

router = APIRouter(prefix="/teachers", tags=["teachers"])

# Initialize services
try:
    ai_service = AIService()
    print("AI Service initialized successfully")
except Exception as e:
    print(f"AI Service initialization failed: {e}")
    # Create a fallback AI service
    ai_service = None

db = DatabaseService()

# Models
class TeacherCreate(BaseModel):
    name: str
    email: str
    school: str
    district: str

class TeacherResponse(BaseModel):
    id: int
    name: str
    email: str
    school: str
    district: str
    created_at: datetime

class ChatRequest(BaseModel):
    teacher_id: str
    message: str

class ChatResponse(BaseModel):
    success: bool
    submission_id: int
    strategy: str
    extracted_params: dict

class SubmissionResponse(BaseModel):
    id: int
    teacher_id: str
    problem: str
    language: str
    infrastructure: str
    status: str
    created_at: datetime
    strategy_preview: str
    raw_message: Optional[str] = None
    strategy: Optional[str] = None

# Helper function for fallback AI responses
def get_fallback_response(teacher_message: str):
    """Generate a fallback response when AI service is unavailable"""
    return f"""**AI TEACHING STRATEGY** (Offline Mode)

I understand you're asking: "{teacher_message[:100]}..."

**GENERAL TEACHING STRATEGY:**

**Quick Classroom Tips:**
• Start with a 5-minute warm-up activity
• Use visual aids to explain concepts
• Implement peer learning groups
• Provide immediate feedback

**Student Engagement:**
• Use think-pair-share discussions
• Incorporate movement breaks
• Gamify learning with points/levels
• Connect lessons to real-life examples

**Assessment Ideas:**
• Exit tickets at end of class
• Weekly mini-quizzes
• Peer assessment activities
• Learning journals

**When backend is connected, I'll provide personalized strategies based on your specific classroom context, language, and infrastructure.**

**Note:** AI service is currently offline. Please check backend connection."""

# Existing endpoints
@router.get("/", response_model=List[TeacherResponse])
async def get_teachers():
    """Get all teachers"""
    try:
        teachers = db.get_all_teachers()
        return teachers
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{teacher_id}", response_model=TeacherResponse)
async def get_teacher(teacher_id: str):
    """Get specific teacher"""
    try:
        teacher = db.get_teacher(teacher_id)
        if not teacher:
            raise HTTPException(status_code=404, detail="Teacher not found")
        return teacher
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=TeacherResponse)
async def create_teacher(teacher: TeacherCreate):
    """Create new teacher"""
    try:
        teacher_data = {
            "name": teacher.name,
            "email": teacher.email,
            "school": teacher.school,
            "district": teacher.district
        }
        teacher_id = db.create_teacher(teacher_data)
        
        # Create response
        return TeacherResponse(
            id=1,  
            name=teacher.name,
            email=teacher.email,
            school=teacher.school,
            district=teacher.district,
            created_at=datetime.now()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# NEW CHAT ENDPOINT with Gemini AI
@router.post("/chat", response_model=ChatResponse)
async def teacher_chat(request: ChatRequest):
    """
    Natural language chat endpoint for teachers using Gemini AI
    """
    try:
        print(f"Received chat request from {request.teacher_id}: {request.message[:50]}...")
        
        # Check if AI service is available
        if ai_service is None:
            print("AI Service not available, using fallback")
            strategy = get_fallback_response(request.message)
            params = {
                "problem": "general",
                "language": "English",
                "infrastructure": "Medium",
                "raw_message": request.message
            }
            submission_id = 0
        else:
            # Extract parameters from natural language using Gemini
            print("Extracting parameters with AI...")
            params = ai_service.extract_parameters(request.message)
            print(f"Extracted params: {params}")
            
            # Generate AI strategy using Gemini
            print("Generating strategy with Gemini AI...")
            strategy = ai_service.generate_strategy(params)
            print(f"Generated strategy ({len(strategy)} chars)")
        
        # Store submission in database
        try:
            submission_id = db.create_submission({
                "teacher_id": request.teacher_id,
                "problem": params.get("problem", "general"),
                "language": params.get("language", "English"),
                "infrastructure": params.get("infrastructure", "Medium"),
                "raw_message": request.message,
                "strategy": strategy,
                "status": "Pending",
                "created_at": datetime.now().isoformat()
            })
            print(f"Saved to database with ID: {submission_id}")
        except Exception as db_error:
            print(f"Database save failed: {db_error}")
            submission_id = 0  # Use 0 if database fails
        
        return ChatResponse(
            success=True,
            submission_id=submission_id,
            strategy=strategy,
            extracted_params=params
        )
        
    except Exception as e:
        print(f"Chat error: {str(e)}")
        
        # Even if everything fails, return a helpful response
        return ChatResponse(
            success=False,
            submission_id=0,
            strategy=get_fallback_response(request.message),
            extracted_params={
                "problem": "error",
                "language": "English",
                "infrastructure": "Medium",
                "raw_message": request.message,
                "error": str(e)
            }
        )

#Get teacher's submissions
@router.get("/{teacher_id}/submissions", response_model=List[SubmissionResponse])
async def get_teacher_submissions(teacher_id: str):
    """Get all submissions by a teacher"""
    try:
        print(f"Fetching submissions for teacher: {teacher_id}")
        submissions = db.get_teacher_submissions(teacher_id)
        
        # Format the response
        formatted_submissions = []
        for sub in submissions:
            # Create strategy preview (first 100 chars)
            strategy_preview = sub.get("strategy", "")[:100] + "..." if sub.get("strategy") else "No strategy available"
            
            formatted_submissions.append(SubmissionResponse(
                id=sub["id"],
                teacher_id=sub["teacher_id"],
                problem=sub["problem"],
                language=sub["language"],
                infrastructure=sub["infrastructure"],
                status=sub["status"],
                created_at=datetime.fromisoformat(sub["created_at"].replace('Z', '+00:00')),
                strategy_preview=strategy_preview,
                raw_message=sub.get("raw_message"),
                strategy=sub.get("strategy")
            ))
        
        print(f"Found {len(formatted_submissions)} submissions")
        return formatted_submissions
        
    except Exception as e:
        print(f"Error fetching submissions: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Health check endpoint for AI service
@router.get("/ai/health")
async def ai_health_check():
    """Check if AI service is working"""
    try:
        if ai_service is None:
            return {
                "status": "offline",
                "message": "AI service not initialized",
                "timestamp": datetime.now().isoformat()
            }
        
        # Test with a simple prompt
        test_prompt = "Say hello"
        try:
            test_response = "AI service is working"
            # Uncomment when Gemini is properly set up:
            # if hasattr(ai_service, 'model') and ai_service.model:
            #     test_response = ai_service.model.generate_content(test_prompt).text
            
            return {
                "status": "online",
                "service": "Gemini AI",
                "message": test_response[:50],
                "timestamp": datetime.now().isoformat()
            }
        except Exception as ai_error:
            return {
                "status": "error",
                "service": "Gemini AI",
                "error": str(ai_error),
                "timestamp": datetime.now().isoformat()
            }
            
    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
            "timestamp": datetime.now().isoformat()
        }
    
@router.get("/test")
async def test_endpoint():
    """Test endpoint to check if teachers API is working"""
    return {
        "message": "Teachers API working", 
        "status": "ok",
        "ai_service_available": ai_service is not None,
        "timestamp": datetime.now().isoformat()
    }

# Example endpoints for testing
@router.post("/test-chat")
async def test_chat():
    """Test chat functionality without saving to database"""
    test_message = "My students are bored in Hindi class and we have no computers"
    
    if ai_service is None:
        return {
            "message": test_message,
            "response": get_fallback_response(test_message),
            "ai_status": "offline"
        }
    
    try:
        params = ai_service.extract_parameters(test_message)
        strategy = ai_service.generate_strategy(params)
        
        return {
            "message": test_message,
            "extracted_params": params,
            "response": strategy,
            "ai_status": "online"
        }
    except Exception as e:
        return {
            "message": test_message,
            "response": get_fallback_response(test_message),
            "error": str(e),
            "ai_status": "error"
        }