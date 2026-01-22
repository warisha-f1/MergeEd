# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from app.routes import approvals, auth, teachers, training

app = FastAPI(
    title="MergeEd AI Assistant API",
    description="AI-powered teaching assistant with DIET approval system",
    version="2.0.0"
)

# CORS configuration - FIXED
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://192.168.0.100:3000",
        "http://192.168.56.1:3000",
        "*"  # For development only
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(auth.router)
app.include_router(teachers.router)
app.include_router(approvals.router)
app.include_router(training.router)

@app.get("/")
def root():
    return {
        "message": "MergeEd AI Assistant API",
        "version": "2.0.0",
        "endpoints": {
            "chat": "/teachers/chat (POST)",
            "submissions": "/approvals/submissions (GET)",
            "teacher_info": "/teachers/{teacher_id} (GET)",
            "approve": "/approvals/submissions/{id}/approve (POST)"
        },
        "docs": "/docs",
        "redoc": "/redoc"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=3333, reload=True)
