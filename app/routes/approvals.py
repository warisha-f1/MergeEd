# app/routes/approvals.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# FIXED IMPORT - relative import
try:
    # Try absolute import first
    from app.database import DatabaseService
except ImportError:
    # Fall back to relative import
    from app.database import DatabaseService

router = APIRouter(prefix="/approvals", tags=["approvals"])
db = DatabaseService()

# Models
class SubmissionDetail(BaseModel):
    id: int
    teacher_id: str
    problem: str
    language: str
    infrastructure: str
    raw_message: str
    strategy: str
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    diet_officer: Optional[str] = None
    feedback: Optional[str] = None

class ApproveRequest(BaseModel):
    officer_id: str
    feedback: Optional[str] = None

class StatsResponse(BaseModel):
    total: int
    pending: int
    approved: int
    rejected: int

# Endpoints
@router.get("/submissions", response_model=List[SubmissionDetail])
async def get_all_submissions(status: Optional[str] = None):
    """
    Get all submissions with optional status filter
    For DIET dashboard
    """
    try:
        if status:
            submissions = db.get_submissions_by_status(status)
        else:
            submissions = db.get_all_submissions()
        return submissions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/submissions/{submission_id}", response_model=SubmissionDetail)
async def get_submission_detail(submission_id: int):
    """Get detailed view of a submission"""
    try:
        submission = db.get_submission_by_id(submission_id)
        if not submission:
            raise HTTPException(status_code=404, detail="Submission not found")
        return submission
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/submissions/{submission_id}/approve")
async def approve_submission(submission_id: int, request: ApproveRequest):
    """
    DIET officer approves a submission
    """
    try:
        success = db.update_submission_status(
            submission_id=submission_id,
            status="Approved",
            officer_id=request.officer_id,
            feedback=request.feedback
        )
        if not success:
            raise HTTPException(status_code=404, detail="Submission not found")
        
        # Get the submission to return updated data
        submission = db.get_submission_by_id(submission_id)
        return {
            "success": True,
            "message": "Submission approved",
            "submission": submission
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/submissions/{submission_id}/reject")
async def reject_submission(submission_id: int, request: ApproveRequest):
    """
    DIET officer rejects a submission
    """
    try:
        success = db.update_submission_status(
            submission_id=submission_id,
            status="Rejected",
            officer_id=request.officer_id,
            feedback=request.feedback
        )
        if not success:
            raise HTTPException(status_code=404, detail="Submission not found")
        
        submission = db.get_submission_by_id(submission_id)
        return {
            "success": True,
            "message": "Submission rejected",
            "submission": submission
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/stats", response_model=StatsResponse)
async def get_approval_stats():
    """Get statistics for SCERT dashboard"""
    try:
        stats = db.get_submission_stats()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/district-stats")
async def get_district_stats():
    """Get district-wise statistics for SCERT"""
    try:
        district_stats = db.get_district_submission_stats()
        return district_stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/test")
async def test_endpoint():
    """Test endpoint to check if approvals API is working"""
    return {"message": "Approvals API working", "status": "ok"}