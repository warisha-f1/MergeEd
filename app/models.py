from sqlalchemy import Column, Integer, String
from .database import Base

class TrainingRecord(Base):
    __tablename__ = "training_records"

    id = Column(Integer, primary_key=True, index=True)
    teacher_id = Column(String)
    language = Column(String)
    problem = Column(String)
    infrastructure = Column(String)
    ai_response = Column(String)
    status = Column(String)
    created_at = Column(String)