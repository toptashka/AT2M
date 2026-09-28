from database import SessionLocal, engine
import models

def populate_db():
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    if not db.query(models.WorkflowStage).first():
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
            db.add(models.WorkflowStage(step_number=step, title=title))
        db.commit()
        print("База данных успешно запущена!")
    else:
        print("Этапы уже существуют.")
        
    db.close()

if __name__ == "__main__":
    populate_db()