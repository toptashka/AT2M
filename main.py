from typing import Optional
from pydantic import BaseModel
from fastapi import FastAPI
import models
from database import engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="RTK CRM API")

# Схема для краткой карточки в сетке
class PartnershipCard(BaseModel):
    id: int
    university_name: str
    program_name: str
    stage_id: int
    stage_name: str
    manager_name: str

# 1. Эндпоинт для отображения сетки карточек
@app.get("/api/v1/partnerships", response_model=list[PartnershipCard])
def get_partnerships_grid(stage_id: Optional[int] = None):
    return [
        {
            "id": 1,
            "university_name": "МГТУ им. Н.Э. Баумана",
            "program_name": "DevOps практики",
            "stage_id": 3,
            "stage_name": "Согласование договора",
            "manager_name": "Иванов А.С."
        },
        {
            "id": 2,
            "university_name": "СПбГУ",
            "program_name": "QA Инженерия",
            "stage_id": 8,
            "stage_name": "Передача дистрибутивов ПО",
            "manager_name": "Смирнова Е.В."
        }
    ]

# 2. Эндпоинт для подробной информации при клике
@app.get("/api/v1/partnerships/{partnership_id}")
def get_partnership_detail(partnership_id: int):
    return {
        "id": partnership_id,
        "university_name": "МГТУ им. Н.Э. Баумана",
        "program_name": "DevOps практики",
        "stage_id": 3,
        "contract_number": "RTK-2026/09-01",
        "manager_name": "Иванов А.С.",
        "contact_person": "Петров П.П. (Декан факультета ИТ)",
        "contact_email": "petrov@bmstu.ru",
        "is_license_signed": True,
        "comment": "Договор на финальном согласовании у юристов вуза"
    }

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Бэкенд успешно запущен!"}