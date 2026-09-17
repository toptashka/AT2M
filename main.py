from typing import Optional
from pydantic import BaseModel
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import models
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="RTK CRM API",
    description="API для системы управления партнерствами вузов",
    version="1.0.0"
)

class PartnershipCard(BaseModel):
    id: int
    university_name: str
    program_name: str
    stage_id: int
    stage_name: str
    manager_name: str

class PartnershipDetail(BaseModel):
    id: int
    university_name: str
    program_name: str
    stage_id: int
    stage_name: str
    contract_number: Optional[str] = None
    manager_name: Optional[str] = None
    contact_person: Optional[str] = None
    contact_email: Optional[str] = None
    is_license_signed: bool
    comment: Optional[str] = None

class StageUpdate(BaseModel):
    stage_id: int

@app.get("/api/v1/partnerships", response_model=list[PartnershipCard])
def get_partnerships_grid(stage_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(models.Partnership)
    
    if stage_id:
        query = query.filter(models.Partnership.stage_id == stage_id)
        
    partnerships = query.all()
    
    result = []
    for p in partnerships:
        result.append(
            PartnershipCard(
                id=p.id,
                university_name=p.university.name,
                program_name=p.program.name,
                stage_id=p.stage_id,
                stage_name=p.stage.title,
                manager_name=p.manager_name
            )
        )
    return result

@app.get("/api/v1/partnerships/{partnership_id}", response_model=PartnershipDetail)
def get_partnership_detail(partnership_id: int, db: Session = Depends(get_db)):
    partnership = db.query(models.Partnership).filter(models.Partnership.id == partnership_id).first()
    
    if not partnership:
        raise HTTPException(status_code=404, detail="Карточка партнерства не найдена")
        
    return PartnershipDetail(
        id=partnership.id,
        university_name=partnership.university.name,
        program_name=partnership.program.name,
        stage_id=partnership.stage_id,
        stage_name=partnership.stage.title,
        contract_number=partnership.contract_number,
        manager_name=partnership.manager_name,
        contact_person=partnership.university.contact_name,
        contact_email=partnership.university.contact_email,
        is_license_signed=partnership.is_license_signed,
        comment=partnership.comment
    )

@app.patch("/api/v1/partnerships/{partnership_id}/stage", response_model=PartnershipDetail)
def update_partnership_stage(partnership_id: int, stage_data: StageUpdate, db: Session = Depends(get_db)):
    partnership = db.query(models.Partnership).filter(models.Partnership.id == partnership_id).first()
    if not partnership:
        raise HTTPException(status_code=404, detail="Карточка партнерства не найдена")
    
    stage = db.query(models.WorkflowStage).filter(models.WorkflowStage.step_number == stage_data.stage_id).first()
    if not stage:
        raise HTTPException(status_code=400, detail="Указанный этап воронки не существует")
        
    partnership.stage_id = stage.id
    db.commit()
    db.refresh(partnership)
    
    return PartnershipDetail(
        id=partnership.id,
        university_name=partnership.university.name,
        program_name=partnership.program.name,
        stage_id=partnership.stage.step_number,
        stage_name=partnership.stage.title,
        contract_number=partnership.contract_number,
        manager_name=partnership.manager_name,
        contact_person=partnership.university.contact_name,
        contact_email=partnership.university.contact_email,
        is_license_signed=partnership.is_license_signed,
        comment=partnership.comment
    )

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Бэкенд успешно запущен!"}