import os
from database import SessionLocal, engine
import models

models.Base.metadata.create_all(bind=engine)
db = SessionLocal()

def seed_data():
    print("Инициализация базовых данных...")
    
    # 1. Этапы воронки (14 этапов)
    stages_titles = [
        "Поиск контактов", "Коммуникация с вузом", "Встреча с представителями",
        "Обмен документами", "Корректировка документов", "Подписание документов",
        "Материалы, лицензия и документы", "Сопровождение внедрения",
        "Обучение преподавателей", "Актуализация учебной программы",
        "Ведение занятий", "Актуализация документации",
        "Повышение квалификации", "Контроль исполнения этапов"
    ]
    for idx, title in enumerate(stages_titles, 1):
        if not db.query(models.WorkflowStage).filter(models.WorkflowStage.step_number == idx).first():
            db.add(models.WorkflowStage(step_number=idx, title=title))
    db.commit()

    # 2. Образовательные программы и ИТ-направления
    programs_data = [
        {"name": "Solar Dozor: Защита от утечек", "direction": "Информационная безопасность", "vendor": "Ростелеком-Солар", "software": "Solar Dozor", "priority": 90},
        {"name": "РТК-Платформа: Базовый DevOps", "direction": "DevOps", "vendor": "ПАО «Ростелеком»", "software": "РТК-Платформа", "priority": 85},
        {"name": "Тестирование ПО и QA-инжиниринг", "direction": "QA / Тестирование", "vendor": "ПАО «Ростелеком»", "software": "РТК-Автотест", "priority": 70},
        {"name": "Облачные решения и виртуализация", "direction": "Cloud & Infra", "vendor": "Базис", "software": "Базис.Dynamix", "priority": 80},
    ]
    created_progs = []
    for p in programs_data:
        prog = db.query(models.Program).filter(models.Program.name == p["name"]).first()
        if not prog:
            prog = models.Program(**p)
            db.add(prog)
            db.flush()
        created_progs.append(prog)
    db.commit()

    # 3. Вузы и контакты
    unis_data = [
        {"name": "МГТУ им. Н.Э. Баумана", "region": "Москва", "contact_name": "Сергеева Мария Павловна", "contact_email": "m.sergeeva@bmstu.ru", "contact_phone": "+7 (999) 123-45-41"},
        {"name": "НИЯУ МИФИ", "region": "Москва", "contact_name": "Ковалёв Виктор Андреевич", "contact_email": "v.kovalev@mephi.ru", "contact_phone": "+7 (999) 234-56-72"},
        {"name": "Университет ИТМО", "region": "Санкт-Петербург", "contact_name": "Смирнова Елена Дмитриевна", "contact_email": "e.smirnova@itmo.ru", "contact_phone": "+7 (999) 345-67-83"},
    ]
    created_unis = []
    for u in unis_data:
        uni = db.query(models.University).filter(models.University.name == u["name"]).first()
        if not uni:
            uni = models.University(**u)
            db.add(uni)
            db.flush()
        created_unis.append(uni)
    db.commit()

    # 4. Партнерства (сделки на разных этапах с КАМами)
    stages = db.query(models.WorkflowStage).order_by(models.WorkflowStage.step_number).all()
    partnerships_data = [
        {
            "university_id": created_unis[0].id,
            "program_id": created_progs[0].id,
            "stage_id": stages[5].id,  # Этап 6: Подписание документов
            "manager_name": "Андрей Махт",
            "contract_number": "РТК-2026/01-Д",
            "is_license_signed": True,
            "license_term_years": 2027,
            "transfer_status": "Передано учреждению",
            "comment": "Договор подписан со стороны ректората."
        },
        {
            "university_id": created_unis[1].id,
            "program_id": created_progs[1].id,
            "stage_id": stages[2].id,  # Этап 3: Встреча с представителями
            "manager_name": "Павел Милючихин",
            "contract_number": "РТК-2026/04-ПР",
            "is_license_signed": False,
            "license_term_years": 2026,
            "transfer_status": "В процессе передачи",
            "comment": "Провели очную презентацию учебной программы."
        }
    ]

    for part in partnerships_data:
        existing = db.query(models.Partnership).filter(
            models.Partnership.university_id == part["university_id"],
            models.Partnership.program_id == part["program_id"]
        ).first()
        if not existing:
            new_p = models.Partnership(**part)
            db.add(new_p)
            db.flush()
            if part["comment"]:
                db.add(models.PartnershipComment(
                    partnership_id=new_p.id,
                    author_id=part["manager_name"],
                    text=part["comment"]
                ))
    
    db.commit()
    print("Инициализация успешно завершена!")

if __name__ == "__main__":
    seed_data()