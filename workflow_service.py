import json
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo

from fastapi import HTTPException
from sqlalchemy import func

import models


def load_state(db, partnership_id):
    row = db.get(models.PartnershipState, partnership_id)
    if not row:
        return {}
    try:
        return json.loads(row.data)
    except (TypeError, ValueError):
        raise HTTPException(503, "Не удалось прочитать данные карточки. Проверьте ENCRYPTION_KEY.")


def save_state(db, partnership_id, data):
    row = db.get(models.PartnershipState, partnership_id)
    if row is None:
        row = models.PartnershipState(partnership_id=partnership_id)
        db.add(row)
    row.data = json.dumps(data, ensure_ascii=False)


def scope(db, user):
    query = db.query(models.Partnership)
    if not user.manager:
        query = query.filter(models.Partnership.manager_name == str(user))
    return query


def accessible(db, user, partnership_id, lock=False):
    query = scope(db, user).filter(models.Partnership.id == partnership_id)
    if lock:
        query = query.with_for_update()
    row = query.first()
    if row is None:
        raise HTTPException(404, "Взаимодействие не найдено или недоступно")
    return row


def lock_workflow(db):
    state = db.query(models.WorkflowState).filter_by(id=1).with_for_update().first()
    if state is None:
        state = models.WorkflowState(id=1, version=1)
        db.add(state)
        db.flush()
    return state


def required(stage):
    if not stage.conditions:
        return [True, True, True]
    return json.loads(stage.conditions)


def workflow_rows(db):
    counts = dict(db.query(models.Partnership.stage_id, func.count(models.Partnership.id)).group_by(models.Partnership.stage_id).all())
    return [
        {"id": str(s.id), "name": s.title, "title": s.title, "step_number": s.step_number,
         "conditions": required(s), "deadlineDays": s.deadline_days, "count": counts.get(s.id, 0), "migrationAllowed": True}
        for s in db.query(models.WorkflowStage).order_by(models.WorkflowStage.step_number).all()
    ]


def workflow_payload(db):
    state = db.get(models.WorkflowState, 1)
    return {"version": state.version if state else 1, "stages": workflow_rows(db)}


def audit(db, user, request, action, entity, entity_id):
    db.add(models.AuditLog(user_id=str(user), action=action, entity_name=entity, entity_id=entity_id,
                           ip_address=request.client.host if request.client else "unknown"))


def modify_workflow(db, user, request, payload):
    if not user.admin:
        raise HTTPException(403, "Настройка Workflow доступна только администратору")
    state = lock_workflow(db)
    if payload.get("version") != state.version:
        raise HTTPException(409, "Workflow уже изменён. Обновите раздел и повторите действие.")
    change = payload.get("change")
    if not isinstance(change, dict):
        raise HTTPException(422, "Не указано изменение Workflow")
    operation = change.get("type")
    stages = db.query(models.WorkflowStage).order_by(models.WorkflowStage.step_number).all()
    by_id = {str(s.id): s for s in stages}
    selected = by_id.get(str(change.get("id")))
    if operation not in {"add", "edit", "move", "delete"}:
        raise HTTPException(422, "Неизвестное действие Workflow")
    if operation != "add" and selected is None:
        raise HTTPException(404, "Этап не найден. Обновите Workflow.")
    if operation == "add":
        selected = None
    if operation in {"add", "edit"}:
        name = str(change.get("name") or "").strip()
        if not name or len(name) > 160:
            raise HTTPException(422, "Название этапа должно содержать от 1 до 160 символов")
        if any(s is not selected and s.title.casefold() == name.casefold() for s in stages):
            raise HTTPException(422, "Этап с таким названием уже существует")
        conditions = change.get("conditions", [True, True, True])
        if not isinstance(conditions, list) or len(conditions) != 3 or any(type(v) is not bool for v in conditions):
            raise HTTPException(422, "Укажите три условия завершения")
        if operation == "add":
            selected = models.WorkflowStage(title=name, step_number=max([s.step_number for s in stages] + [0]) + 1)
            db.add(selected)
            db.flush()
        selected.title = name
        selected.conditions = json.dumps(conditions)
    if operation in {"add", "move"}:
        after = str(change.get("after"))
        if after != "start" and (after not in by_id or by_id[after] is selected):
            raise HTTPException(422, "Выберите существующий этап для расположения")
        stages = [s for s in stages if s is not selected]
        index = 0 if after == "start" else stages.index(by_id[after]) + 1
        stages.insert(index, selected)
    if operation == "delete":
        if len(stages) <= 1:
            raise HTTPException(422, "Нельзя удалить единственный этап")
        index = stages.index(selected)
        neighbours = stages[max(0, index - 1):index] + stages[index + 1:index + 2]
        active = db.query(models.Partnership).filter_by(stage_id=selected.id).all()
        target = by_id.get(str(change.get("target")))
        if active and target not in neighbours:
            raise HTTPException(422, "Для используемого этапа выберите соседний этап переноса")
        if target is None:
            target = neighbours[0]
        if target not in neighbours:
            raise HTTPException(422, "Перенос допускается только в соседний этап")
        for partnership in active:
            partnership.stage_id = target.id
            partnership.updated_at = datetime.utcnow()
            data = load_state(db, partnership.id)
            data["completed"] = False
            data.setdefault("stages", {}).setdefault(str(target.id), {})["conditions"] = [False, False, False]
            set_deadline(data, target, restart=True)
            save_state(db, partnership.id, data)
        db.query(models.Attachment).filter_by(stage_id=selected.id).update({"stage_id": target.id}, synchronize_session=False)
        db.query(models.PartnershipComment).filter_by(stage_id=selected.id).update({"stage_id": target.id}, synchronize_session=False)
        db.flush()
        db.delete(selected)
        stages.remove(selected)
        db.flush()
    for stage in stages:
        stage.step_number = -stage.id
    db.flush()
    for number, stage in enumerate(stages, 1):
        stage.step_number = number
    state.version += 1
    audit(db, user, request, "WORKFLOW_" + operation.upper(), "workflow_stages", selected.id)
    db.commit()
    return workflow_payload(db)


def file_info(file):
    return {"id": file.id, "name": file.file_name, "size": file.file_size or 0,
            "at": file.uploaded_at.isoformat(), "type": file.document_type or "other"}


def detail(db, partnership):
    state = load_state(db, partnership.id)
    stages = db.query(models.WorkflowStage).order_by(models.WorkflowStage.step_number).all()
    workflow_state = db.get(models.WorkflowState, 1)
    stage_number = {s.id: s.step_number for s in stages}
    comments = db.query(models.PartnershipComment).filter_by(partnership_id=partnership.id).order_by(models.PartnershipComment.created_at).all()
    files = db.query(models.Attachment).filter_by(partnership_id=partnership.id).order_by(models.Attachment.uploaded_at).all()
    data = {}
    for stage in stages:
        stored = state.get("stages", {}).get(str(stage.id), {})
        attached = [f for f in files if (f.stage_id or partnership.stage_id) == stage.id]
        values = list(stored.get("conditions", [False, False, False]))
        values[1] = bool(attached)
        data[str(stage.step_number)] = {
            "enteredAt": stored.get("enteredAt", ""), "conditions": values, "due": stored.get("due", ""), "requiredConditions": required(stage), "completedAt": stored.get("completedAt", ""),
            "files": [file_info(f) for f in attached],
            "comments": [{"id": c.id, "author": c.author_id, "text": c.text, "at": c.created_at.isoformat()}
                         for c in comments if (c.stage_id or partnership.stage_id) == stage.id],
        }
    university, program = partnership.university, partnership.program
    contact = {"name": university.contact_name or "", "email": university.contact_email or "", "phone": university.contact_phone or "", "position": ""}
    contact.update(state.get("contact", {}))
    contract = {"vendor": program.vendor or "", "software": program.software or "", "number": partnership.contract_number or "",
                "signed": "Да" if partnership.is_license_signed else "Нет", "licenseEnd": "", "licenseTermYears": partnership.license_term_years,
                "transfer": partnership.transfer_status or "Не передавалось"}
    contract.update(state.get("contract", {}))
    history = [{**h, "stage": stage_number[h["stage_id"]]} for h in state.get("history", []) if h.get("stage_id") in stage_number]
    return {
        "id": partnership.id, "university_name": university.name, "program_name": program.direction or program.name,
        "region": university.region or "", "software": contract["software"], "manager_name": partnership.manager_name or "",
        "stage_id": stage_number.get(partnership.stage_id, 1), "workflow_stage_id": partnership.stage_id,
        "workflow_version": workflow_state.version if workflow_state else 1,
        "stage_name": partnership.stage.title, "step_names": [s.title for s in stages],
        "created_at": partnership.created_at.isoformat(), "updated_at": partnership.updated_at.isoformat(),
        "completed": state.get("completed", False), "due": state.get("stages", {}).get(str(partnership.stage_id), {}).get("due", ""),
        "contract": contract, "contact": contact, "stages": data, "history": history,
        "contract_number": partnership.contract_number, "is_license_signed": partnership.is_license_signed,
        "contact_person": contact["name"], "contact_phone": contact["phone"], "contact_email": contact["email"],
        "vendor": contract["vendor"], "license_term_years": str(partnership.license_term_years or ""),
        "transfer_status": contract["transfer"], "comment": partnership.comment,
    }


def check_current(db, partnership, expected_stage_id, expected_workflow_version):
    state = lock_workflow(db)
    if expected_stage_id != partnership.stage_id or expected_workflow_version != state.version:
        raise HTTPException(409, "Этап или Workflow изменился. Обновите карточку.")


def advance(db, user, request, partnership, payload):
    check_current(db, partnership, payload.get("expected_stage_id"), payload.get("workflow_version"))
    comment = str(payload.get("comment") or "").strip()
    if not comment or len(comment) > 10000:
        raise HTTPException(422, "Для перехода нужен комментарий до 10000 символов")
    data = load_state(db, partnership.id)
    stage = partnership.stage
    target_number = payload.get("stage_id")
    if type(target_number) is not int:
        raise HTTPException(422, "Укажите номер целевого этапа")
    completing = payload.get("complete") is True
    if completing:
        last = db.query(func.max(models.WorkflowStage.step_number)).scalar()
        if stage.step_number != last or target_number != stage.step_number or data.get("completed"):
            raise HTTPException(422, "Завершить можно только текущий последний этап")
    elif target_number not in [stage.step_number - 1, stage.step_number + 1]:
        raise HTTPException(422, "Разрешён переход только на соседний этап")
    target = db.query(models.WorkflowStage).filter_by(step_number=target_number).first()
    if target is None:
        raise HTTPException(422, "Целевой этап не существует")
    forward = completing or target_number > stage.step_number
    if data.get("completed") and forward:
        raise HTTPException(409, "Взаимодействие уже завершено")
    current = detail(db, partnership)["stages"][str(stage.step_number)]
    if forward and any(needed and not current["conditions"][i] for i, needed in enumerate(required(stage))):
        raise HTTPException(422, "Не выполнены обязательные условия завершения этапа")
    timestamp = datetime.utcnow().isoformat()
    history = data.setdefault("history", [])
    history.append({**current, "stage_id": stage.id, "contract": detail(db, partnership)["contract"], "owner": partnership.manager_name,
                    "at": timestamp, "outcome": "completed" if forward else "returned"})
    current_state = data.setdefault("stages", {}).setdefault(str(stage.id), {})
    current_state["completedAt"] = timestamp if forward else ""
    data["completed"] = completing
    if not completing:
        data["stages"].setdefault(str(target.id), {})["completedAt"] = ""
        partnership.stage_id = target.id
        set_deadline(data, target, restart=True)
    partnership.updated_at = datetime.utcnow()
    db.add(models.PartnershipComment(partnership_id=partnership.id, stage_id=stage.id, author_id=str(user), text=comment))
    save_state(db, partnership.id, data)
    audit(db, user, request, "COMPLETE_STAGE" if forward else "RETURN_STAGE", "partnerships", partnership.id)
    db.commit()
    db.expire(partnership)
    return detail(db, partnership)


def set_deadline(data, stage, restart=False):
    stored = data.setdefault("stages", {}).setdefault(str(stage.id), {})
    if restart or not stored.get("enteredAt"):
        stored["enteredAt"] = datetime.utcnow().isoformat()
    entered = datetime.fromisoformat(stored["enteredAt"])
    if entered.tzinfo is None:
        entered = entered.replace(tzinfo=timezone.utc)
    entered = entered.astimezone(ZoneInfo("Europe/Moscow"))
    stored["due"] = (entered + timedelta(days=stage.deadline_days)).date().isoformat() if stage.deadline_days else ""


def initialize_deadline(db, row):
    data = load_state(db, row.id)
    set_deadline(data, row.stage)
    save_state(db, row.id, data)


def update_deadlines(db, user, request, payload):
    state = lock_workflow(db)
    if payload.get("version") != state.version:
        raise HTTPException(409, "Workflow изменён. Обновите страницу.")
    updates = payload.get("stages")
    if not isinstance(updates, list) or not updates:
        raise HTTPException(422, "Укажите сроки этапов")
    stages = {str(s.id): s for s in db.query(models.WorkflowStage).all()}
    seen = set()
    for item in updates:
        if not isinstance(item, dict):
            raise HTTPException(422, "Некорректный этап")
        key = str(item.get("id"))
        days = item.get("days")
        if key not in stages or key in seen or (days is not None and (type(days) is not int or not 1 <= days <= 3650)):
            raise HTTPException(422, "Срок: от 1 до 3650 дней или пустое поле")
        seen.add(key)
        stage = stages[key]
        if stage.deadline_days == days:
            continue
        stage.deadline_days = days
        for row in db.query(models.Partnership).filter_by(stage_id=stage.id).all():
            data = load_state(db, row.id)
            if not data.get("completed"):
                set_deadline(data, stage)
                save_state(db, row.id, data)
    state.version += 1
    audit(db, user, request, "UPDATE_DEADLINES", "workflow_stages", None)
    db.commit()
    return workflow_payload(db)
