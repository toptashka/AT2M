from typing import Optional
from pydantic import BaseModel
from fastapi import FastAPI, Depends, HTTPException, Request, UploadFile, File, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import jwt, JWTError, ExpiredSignatureError
import boto3
from botocore.exceptions import ClientError
import uuid
import openpyxl
from io import BytesIO
import models
from database import engine, get_db
from fastapi.responses import StreamingResponse
from datetime import datetime, date
from reportlab.lib.pagesizes import A4, landscape
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os
from fastapi_cache import FastAPICache
from fastapi_cache.backends.inmemory import InMemoryBackend
from fastapi_cache.decorator import cache
from urllib.parse import quote

font_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
if not os.path.exists(font_path):
        font_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

try:
        pdfmetrics.registerFont(TTFont("DejaVuSans", font_path))
        PDF_FONT = "DejaVuSans"
except Exception:
        PDF_FONT = "Helvetica"

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
        title="RTK CRM API",
        description="API для системы управления партнерствами вузов",
        version="1.0.0"
)

@app.on_event("startup")
def startup():
        FastAPICache.init(InMemoryBackend())

security = HTTPBearer()

ROLE_HIERARCHY = {
        "Пользователь": ["Пользователь", "Руководитель", "Администратор"],
        "Руководитель": ["Руководитель", "Администратор"],
        "Администратор": ["Администратор"]
}

KC_PUBLIC_KEY = os.getenv("KC_PUBLIC_KEY", "")
PUBLIC_KEY_PEM = f"-----BEGIN PUBLIC KEY-----\n{KC_PUBLIC_KEY}\n-----END PUBLIC KEY-----"

def require_role(required_role: str):
        def role_checker(credentials: HTTPAuthorizationCredentials = Security(security)):
                token = credentials.credentials
                try:
                        payload = jwt.decode(
                                token, 
                                PUBLIC_KEY_PEM, 
                                algorithms=["RS256"],
                                options={"verify_aud": False}
                        )
                        roles = payload.get("realm_access", {}).get("roles", [])
                except ExpiredSignatureError:
                        raise HTTPException(status_code=401, detail="Время действия токена истекло")
                except JWTError:
                        raise HTTPException(status_code=401, detail="Невалидный токен авторизации или ошибка подписи")
                        
                allowed_roles = ROLE_HIERARCHY.get(required_role, [required_role])
                
                if not any(role in allowed_roles for role in roles):
                        raise HTTPException(status_code=403, detail=f"Недостаточно прав. Требуется роль: {required_role}")
                        
                return payload.get("preferred_username", "unknown_user")
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

class CommentCreate(BaseModel):
        text: str

class CommentResponse(BaseModel):
        id: int
        author_id: str
        text: str
        created_at: datetime

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
@cache(expire=60)
def get_partnerships_grid(
        stage_id: Optional[int] = None, 
        db: Session = Depends(get_db),
        current_user: str = Depends(require_role("Пользователь"))
):
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

@app.get("/api/v1/partnerships/{partnership_id}/comments", response_model=list[CommentResponse])
def get_partnership_comments(
        partnership_id: int, 
        db: Session = Depends(get_db), 
        current_user: str = Depends(require_role("Пользователь"))
):
        partnership = db.query(models.Partnership).filter(models.Partnership.id == partnership_id).first()
        if not partnership:
                raise HTTPException(status_code=404, detail="Карточка партнерства не найдена")
        
        return [
                CommentResponse(
                        id=c.id,
                        author_id=c.author_id,
                        text=c.text,
                        created_at=c.created_at
                ) for c in partnership.comments
        ]

@app.post("/api/v1/partnerships/{partnership_id}/comments", response_model=CommentResponse)
def add_partnership_comment(
        partnership_id: int,
        comment_data: CommentCreate,
        request: Request,
        db: Session = Depends(get_db),
        current_user: str = Depends(require_role("Пользователь"))
):
        partnership = db.query(models.Partnership).filter(models.Partnership.id == partnership_id).first()
        if not partnership:
                raise HTTPException(status_code=404, detail="Карточка партнерства не найдена")
                
        new_comment = models.PartnershipComment(
                partnership_id=partnership.id,
                author_id=current_user,
                text=comment_data.text
        )
        db.add(new_comment)
        db.commit()
        db.refresh(new_comment)
        
        log_audit(db, request, user_id=current_user, action="ADD_COMMENT", entity_name="partnerships", entity_id=partnership.id)
        
        return CommentResponse(
                id=new_comment.id,
                author_id=new_comment.author_id,
                text=new_comment.text,
                created_at=new_comment.created_at
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

@app.get("/api/v1/files/{file_id}")
def download_partnership_file(
        file_id: int,
        request: Request,
        db: Session = Depends(get_db),
        current_user: str = Depends(require_role("Пользователь"))
):
        attachment = db.query(models.Attachment).filter(models.Attachment.id == file_id).first()
        if not attachment:
                raise HTTPException(status_code=404, detail="Файл не найден")
                
        try:
                s3_response = s3_client.get_object(Bucket=S3_BUCKET_NAME, Key=attachment.file_url)
                
                log_audit(
                        db, request, user_id=current_user, 
                        action="DOWNLOAD_FILE", 
                        entity_name="attachments", entity_id=attachment.id
                )
                
                return StreamingResponse(
                        s3_response['Body'],
                        media_type=s3_response.get('ContentType', 'application/octet-stream'),
                        headers={
                                "Content-Disposition": f"attachment; filename*=UTF-8''{quote(attachment.file_name)}"
                        }
                )
        except ClientError as e:
                raise HTTPException(status_code=500, detail=f"Ошибка получения файла из S3: {str(e)}")

@app.delete("/api/v1/stages/{stage_step}")
def delete_workflow_stage(
        stage_step: int, 
        fallback_step: int, 
        request: Request, 
        db: Session = Depends(get_db), 
        current_user: str = Depends(require_role("Администратор"))
):
        stage_to_delete = db.query(models.WorkflowStage).filter(models.WorkflowStage.step_number == stage_step).first()
        if not stage_to_delete:
                raise HTTPException(status_code=404, detail="Удаляемый этап не найден")
                
        fallback_stage = db.query(models.WorkflowStage).filter(models.WorkflowStage.step_number == fallback_step).first()
        if not fallback_stage:
                raise HTTPException(status_code=400, detail="Указанный этап для миграции не существует")
                
        partnerships_to_migrate = db.query(models.Partnership).filter(models.Partnership.stage_id == stage_to_delete.id).all()
        
        for partnership in partnerships_to_migrate:
                partnership.stage_id = fallback_stage.id
                log_audit(
                        db, request, user_id=current_user, 
                        action=f"MIGRATE_FROM_DELETED_STAGE_{stage_step}_TO_{fallback_step}", 
                        entity_name="partnerships", entity_id=partnership.id
                )
                
        db.delete(stage_to_delete)
        db.commit()
        
        return {
                "status": "ok", 
                "message": f"Этап {stage_step} удален", 
                "migrated_count": len(partnerships_to_migrate)
        }

@app.post("/api/v1/partnerships/{partnership_id}/students/import")
def import_students_from_excel(
        partnership_id: int,
        request: Request,
        file: UploadFile = File(...),
        db: Session = Depends(get_db),
        current_user: str = Depends(require_role("Руководитель"))
):
        partnership = db.query(models.Partnership).filter(models.Partnership.id == partnership_id).first()
        if not partnership:
                raise HTTPException(status_code=404, detail="Карточка партнерства не найдена")

        if not file.filename.endswith(('.xls', '.xlsx')):
                raise HTTPException(status_code=400, detail="Поддерживаются только форматы xls и xlsx")

        try:
                contents = file.file.read()
                workbook = openpyxl.load_workbook(filename=BytesIO(contents), data_only=True)
                sheet = workbook.active
                
                students_added = 0
                
                for row in sheet.iter_rows(min_row=2, values_only=True):
                        if row[0] and row[1]:
                                new_student = models.Student(
                                        partnership_id=partnership.id,
                                        full_name=str(row[0]).strip(),
                                        email=str(row[1]).strip()
                                )
                                db.add(new_student)
                                students_added += 1
                                
                db.commit()
                
                log_audit(
                        db, request, user_id=current_user, 
                        action=f"IMPORT_STUDENTS_COUNT_{students_added}", 
                        entity_name="partnerships", entity_id=partnership.id
                )
                
                return {"status": "ok", "message": f"Успешно загружено студентов: {students_added}"}
                
        except Exception as e:
                raise HTTPException(status_code=500, detail=f"Ошибка обработки файла: {str(e)}")

@app.post("/api/v1/catalogs/import")
def import_catalogs_from_excel(
        request: Request,
        file: UploadFile = File(...),
        db: Session = Depends(get_db),
        current_user: str = Depends(require_role("Администратор"))
):
        if not file.filename.endswith(('.xls', '.xlsx')):
                raise HTTPException(status_code=400, detail="Поддерживаются только форматы xls и xlsx")

        try:
                contents = file.file.read()
                workbook = openpyxl.load_workbook(filename=BytesIO(contents), data_only=True)

                unis_added = 0
                programs_added = 0

                if "Вузы" in workbook.sheetnames:
                        sheet = workbook["Вузы"]
                        for row in sheet.iter_rows(min_row=2, values_only=True):
                                if row[0]:
                                        name_val = str(row[0]).strip()
                                        existing = db.query(models.University).filter(models.University.name == name_val).first()
                                        if not existing:
                                                new_uni = models.University(
                                                        name=name_val,
                                                        region=str(row[1]).strip() if len(row) > 1 and row[1] else None,
                                                        contact_name=str(row[2]).strip() if len(row) > 2 and row[2] else None,
                                                        contact_email=str(row[3]).strip() if len(row) > 3 and row[3] else None,
                                                        contact_phone=str(row[4]).strip() if len(row) > 4 and row[4] else None
                                                )
                                                db.add(new_uni)
                                                unis_added += 1

                if "Программы" in workbook.sheetnames:
                        sheet = workbook["Программы"]
                        for row in sheet.iter_rows(min_row=2, values_only=True):
                                if row[0] and len(row) > 1 and row[1]:
                                        name_val = str(row[0]).strip()
                                        existing = db.query(models.Program).filter(models.Program.name == name_val).first()
                                        if not existing:
                                                priority_val = 0
                                                if len(row) > 4 and row[4]:
                                                        try:
                                                                priority_val = int(row[4])
                                                        except ValueError:
                                                                pass
                                                new_prog = models.Program(
                                                        name=name_val,
                                                        direction=str(row[1]).strip(),
                                                        vendor=str(row[2]).strip() if len(row) > 2 and row[2] else None,
                                                        software=str(row[3]).strip() if len(row) > 3 and row[3] else None,
                                                        priority=priority_val
                                                )
                                                db.add(new_prog)
                                                programs_added += 1

                db.commit()
                log_audit(
                        db, request, user_id=current_user,
                        action=f"IMPORT_CATALOGS_UNIS_{unis_added}_PROGS_{programs_added}",
                        entity_name="catalogs", entity_id=0
                )

                return {"status": "ok", "message": f"Загружено новых вузов: {unis_added}, новых программ: {programs_added}"}

        except Exception as e:
                raise HTTPException(status_code=500, detail=f"Ошибка обработки файла: {str(e)}")

class CMSLead(BaseModel):
        university_name: str
        contact_name: str
        contact_email: str
        program_name: str

class LMSSyncData(BaseModel):
        partnership_id: int
        active_students: int
        average_score: float

class ProgramResponse(BaseModel):
        id: int
        name: str
        priority: int

class ProgramPriorityUpdate(BaseModel):
        priority: int

@app.post("/api/v1/integrations/cms/leads")
def receive_lead_from_cms(
        lead: CMSLead, 
        request: Request, 
        db: Session = Depends(get_db)
):
        log_audit(
                db, request, user_id="system_cms", 
                action="RECEIVE_LEAD_CMS", 
                entity_name="leads", entity_id=0
        )
        return {"status": "ok", "message": "Заявка с сайта успешно принята", "data": lead}

@app.post("/api/v1/integrations/lms/sync")
def sync_with_lms(
        data: LMSSyncData, 
        request: Request, 
        db: Session = Depends(get_db)
):
        partnership = db.query(models.Partnership).filter(models.Partnership.id == data.partnership_id).first()
        if not partnership:
                raise HTTPException(status_code=404, detail="Партнерство не найдено в CRM")
                
        log_audit(
                db, request, user_id="system_lms", 
                action=f"SYNC_LMS_STUDENTS_{data.active_students}", 
                entity_name="partnerships", entity_id=partnership.id
        )
        return {"status": "ok", "message": "Статистика из LMS успешно обновлена", "partnership_id": partnership.id}

@app.get("/api/v1/reports/partnerships/excel")
def export_partnerships_excel(
        request: Request,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        db: Session = Depends(get_db),
        current_user: str = Depends(require_role("Руководитель"))
):
        query = db.query(models.Partnership)
        if start_date:
                query = query.filter(models.Partnership.created_at >= start_date)
        if end_date:
                query = query.filter(models.Partnership.created_at <= end_date)
        partnerships = query.all()
        
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Отчет по взаимодействиям"
        
        headers = [
                "ID", "ВУЗ", "ИТ-Программа", "Текущий статус", 
                "Ответственный РТК", "Номер договора", "Лицензия подписана"
        ]
        ws.append(headers)
        
        for p in partnerships:
                ws.append([
                        p.id,
                        p.university.name,
                        p.program.name,
                        p.stage.title,
                        p.manager_name or "Не назначен",
                        p.contract_number or "Нет данных",
                        "Да" if p.is_license_signed else "Нет"
                ])
                
        stream = BytesIO()
        wb.save(stream)
        stream.seek(0)
        
        log_audit(
                db, request, user_id=current_user, 
                action="EXPORT_REPORT_EXCEL", 
                entity_name="partnerships", entity_id=0
        )
        
        filename = f"rtk_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
        return StreamingResponse(
                stream, 
                media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                headers={"Content-Disposition": f"attachment; filename={filename}"}
        )

@app.get("/api/v1/reports/partnerships/pdf")
def export_partnerships_pdf(
        request: Request,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        db: Session = Depends(get_db),
        current_user: str = Depends(require_role("Руководитель"))
):
        query = db.query(models.Partnership)
        if start_date:
                query = query.filter(models.Partnership.created_at >= start_date)
        if end_date:
                query = query.filter(models.Partnership.created_at <= end_date)
        partnerships = query.all()
        
        stream = BytesIO()
        
        doc = SimpleDocTemplate(
                stream, 
                pagesize=landscape(A4), 
                rightMargin=20, 
                leftMargin=20, 
                topMargin=20, 
                bottomMargin=20
        )
        elements = []
        
        title_style = ParagraphStyle(
                name="TitleStyle",
                fontName=PDF_FONT,
                fontSize=14,
                leading=18,
                alignment=1
        )
        title = Paragraph("RTK CRM - Отчет по взаимодействиям с вузами", title_style)
        elements.append(title)
        elements.append(Spacer(1, 15))
        
        table_data = [
                ["ID", "ВУЗ", "Программа", "Этап воронки", "Менеджер", "Договор", "Лицензия"]
        ]
        
        for p in partnerships:
                table_data.append([
                        str(p.id),
                        str(p.university.name),
                        str(p.program.name),
                        str(p.stage.title),
                        str(p.manager_name or "-"),
                        str(p.contract_number or "-"),
                        "Да" if p.is_license_signed else "Нет"
                ])
                
        t = Table(table_data, colWidths=[30, 160, 150, 140, 100, 100, 60])
        t.setStyle(TableStyle([
                ('FONTNAME', (0, 0), (-1, -1), PDF_FONT),
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#7B2CBF")),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
                ('FONTSIZE', (0, 0), (-1, -1), 8),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
                ('TOPPADDING', (0, 0), (-1, -1), 4),
        ]))
        elements.append(t)
        
        doc.build(elements)
        stream.seek(0)
        
        log_audit(
                db, request, user_id=current_user, 
                action="EXPORT_REPORT_PDF", 
                entity_name="partnerships", entity_id=0
        )
        
        filename = f"rtk_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        return StreamingResponse(
                stream,
                media_type="application/pdf",
                headers={"Content-Disposition": f"attachment; filename={filename}"}
        )

@app.get("/api/v1/programs", response_model=list[ProgramResponse])
@cache(expire=60)
def get_programs_catalog(
        db: Session = Depends(get_db),
        current_user: str = Depends(require_role("Пользователь"))
):
        programs = db.query(models.Program).order_by(models.Program.priority.desc()).all()
        return [
                ProgramResponse(id=p.id, name=p.name, priority=p.priority) 
                for p in programs
        ]

@app.patch("/api/v1/programs/{program_id}/priority", response_model=ProgramResponse)
def update_program_priority(
        program_id: int,
        priority_data: ProgramPriorityUpdate,
        request: Request,
        db: Session = Depends(get_db),
        current_user: str = Depends(require_role("Руководитель"))
):
        program = db.query(models.Program).filter(models.Program.id == program_id).first()
        if not program:
                raise HTTPException(status_code=404, detail="ИТ-программа не найдена")
                
        old_priority = program.priority
        program.priority = priority_data.priority
        db.commit()
        db.refresh(program)
        
        log_audit(
                db, request, user_id=current_user, 
                action=f"UPDATE_PROGRAM_{program.id}_PRIORITY_TO_{program.priority}", 
                entity_name="programs", entity_id=program.id
        )
        
        return ProgramResponse(id=program.id, name=program.name, priority=program.priority)

@app.get("/")
def read_root():
        return {"status": "ok", "message": "Бэкенд успешно запущен!"}