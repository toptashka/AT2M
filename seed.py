from database import SessionLocal
import models

def populate_db():
    db = SessionLocal()
    
    if db.query(models.WorkflowStage).first():
        print("База данных уже содержит этапы.")
        db.close()
        return

    stages = [
        (1, "Поиск контактов ответственного в вузе"),
        (2, "Коммуникация и уточнение программ"),
        (3, "Организация встречи"),
        (4, "Обмен документами для подписания"),
        (5, "Корректировка документов"),
        (6, "Подписание документов"),
        (7, "Передача материалов и лицензий ПО"),
        (8, "Сопровождение внедрения"),
        (9, "Обучение преподавателей"),
        (10, "Актуализация учебной программы"),
        (11, "Ведение занятий"),
        (12, "Актуализация документации"),
        (13, "Повышение квалификации преподавателей"),
        (14, "Контроль за исполнением этапов")
    ]

    for step, title in stages:
        stage = models.WorkflowStage(step_number=step, title=title)
        db.add(stage)

    uni = models.University(
        name="МГТУ им. Н.Э. Баумана",
        region="Москва",
        contact_name="Иванов И.И.",
        contact_email="ivanov@bmstu.ru"
    )
    program = models.Program(
        name="DevOps практики",
        direction="DevOps",
        vendor="Ростелеком",
        software="РТК-Инфраструктура",
        priority=1
    )
    db.add(uni)
    db.add(program)
    db.commit()

    partnership = models.Partnership(
        university_id=uni.id,
        program_id=program.id,
        stage_id=3,
        manager_name="Смирнов А.В.",
        contract_number="РТК-2026/01-Б"
    )
    db.add(partnership)
    db.commit()
    db.close()
    print("Начальные данные успешно загружены!")

if __name__ == "__main__":
    populate_db()