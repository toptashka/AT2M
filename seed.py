from typing import Optional
from pydantic import BaseModel
from fastapi import FastAPI, Depends, HTTPException, Request, UploadFile, File, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import jwt
import boto3
from botocore.exceptions import ClientError
import uuid
import models
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="RTK CRM API",
    description="API для системы управления партнерствами вузов",
    version="1.0.0"
)

security = HTTPBearer()

def require_role(required_role: str):
    def role_checker(credentials: HTTPAuthorizationCredentials = Security(security)):
        token = credentials.credentials
        try:
            payload = jwt.get_unverified_claims(token)
            realm_access = payload.get("realm_access", {})
            roles = realm_access.get("roles", [])
            
            if required_role not in roles:
                raise HTTPException(status_code=403, detail=f"Недостаточно прав. Требуется роль: {required_role}")
            
            return payload.get("preferred_username", "unknown_user")
        except Exception:
            raise HTTPException(status_code=401, detail="Невалидный токен авторизации")
    return role_checker

S3_BUCKET_NAME = "rtk-crm-documents"
s3_client = boto3.client(
    's3',
    endpoint_url='http://minio:9000',
    aws_access_key_id='admin',
    aws_secret_access_key='admin_password'
)

try:
    s3_client.head_bucket(Bucket=S3_BUCKET_NAME)
except ClientError:
    s3_client.create_bucket(Bucket=S3_BUCKET_NAME)

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

def log_audit(db: Session, request: Request, user_id: str, action: str, entity_name: str, entity_id: int):
    ip_address = request.client.host if request.client else "unknown"
    audit_entry = models.AuditLog(
        user_id=user_id,
        action=action,
        entity_name=entity_name,
        entity_id=entity_id,
        ip_address=ip_address
    )
    db.add(audit_entry)
    db.commit()

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
def get_partnership_detail(
    partnership_id: int, 
    request: Request, 
    db: Session = Depends(get_db), 
    current_user: str = Depends(require_role("Пользователь"))
):
    partnership = db.query(models.Partnership).filter(models.Partnership.id == partnership_id).first()
    
    if not partnership:
        raise HTTPException(status_code=404, detail="Карточка партнерства не найдена")
        
    log_audit(db, request, user_id=current_user, action="VIEW_PDN", entity_name="partnerships", entity_id=partnership.id)
        
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
def update_partnership_stage(
    partnership_id: int, 
    stage_data: StageUpdate, 
    request: Request, 
    db: Session = Depends(get_db), 
    current_user: str = Depends(require_role("Руководитель"))
):
    partnership = db.query(models.Partnership).filter(models.Partnership.id == partnership_id).first()
    if not partnership:
        raise HTTPException(status_code=404, detail="Карточка партнерства не найдена")
    
    stage = db.query(models.WorkflowStage).filter(models.WorkflowStage.step_number == stage_data.stage_id).first()
    if not stage:
        raise HTTPException(status_code=400, detail="Указанный этап воронки не существует")
        
    partnership.stage_id = stage.id
    db.commit()
    db.refresh(partnership)
    
    log_audit(db, request, user_id=current_user, action=f"UPDATE_STAGE_TO_{stage.step_number}", entity_name="partnerships", entity_id=partnership.id)
    
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

@app.post("/api/v1/partnerships/{partnership_id}/files")
def upload_partnership_file(
    partnership_id: int, 
    request: Request, 
    file: UploadFile = File(...), 
    db: Session = Depends(get_db), 
    current_user: str = Depends(require_role("Руководитель"))
):
    partnership = db.query(models.Partnership).filter(models.Partnership.id == partnership_id).first()
    if not partnership:
        raise HTTPException(status_code=404, detail="Карточка партнерства не найдена")
    
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"partnership_{partnership_id}/{uuid.uuid4()}.{file_extension}"
    
    try:
        s3_client.upload_fileobj(
            file.file,
            S3_BUCKET_NAME,
            unique_filename,
            ExtraArgs={"ContentType": file.content_type}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка загрузки файла в S3: {str(e)}")
        
    new_attachment = models.Attachment(
        partnership_id=partnership_id,
        file_name=file.filename,
        file_url=unique_filename
    )
    db.add(new_attachment)
    db.commit()
    db.refresh(new_attachment)
    
    log_audit(db, request, user_id=current_user, action="UPLOAD_FILE", entity_name="partnerships", entity_id=partnership.id)
    
    return {"status": "ok", "message": "Файл успешно прикреплен", "file_id": new_attachment.id}

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Бэкенд успешно запущен!"}