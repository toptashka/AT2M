import re
from io import BytesIO

import openpyxl
from fastapi import HTTPException

import models

FIELDS = {
    "institutions": {"institution", "region"},
    "directions": {"direction", "program"},
    "products": {"software", "vendor", "contract", "signed", "year", "delivery"},
    "contacts": {"institution", "contact", "manager", "email", "phone"},
    "interactions": {"institution", "vendor", "software", "contract", "signed", "year", "delivery", "manager", "contact", "comment", "direction", "program", "region", "email", "phone"},
    "students": {"name", "email"},
}
REQUIRED = {
    "institutions": {"institution"},
    "directions": {"direction", "program"},
    "products": {"software", "vendor"},
    "contacts": {"institution", "contact"},
    "interactions": {"institution", "vendor", "software"},
    "students": {"name", "email"},
}


def text(value):
    return str(value).strip() if value is not None else ""


def field_id(header):
    value = re.sub(r"\s+", " ", text(header).lower().replace("ё", "е"))
    if value in set().union(*FIELDS.values()):
        return value
    rules = [
        ("email", r"email|e-mail|почт"),
        ("phone", r"телефон|phone"),
        ("manager", r"менеджер|\bкам\b|куратор|manager|owner"),
        ("contact", r"ответственн.*(?:вуз|учрежден)|представител|контакт.*лицо|contact"),
        ("contract", r"договор|contract"),
        ("delivery", r"передач|transfer|delivery"),
        ("year", r"срок|year"),
        ("signed", r"подпис|лиценз|signed"),
        ("direction", r"направлен|direction"),
        ("program", r"программ|program"),
        ("vendor", r"вендор|разработчик|vendor"),
        ("software", r"\bпо\b|продукт|софт|software|product"),
        ("region", r"регион|город|region|city"),
        ("institution", r"учрежден|вуз|университет|организац|institution|university"),
        ("comment", r"коммент|примечан|comment"),
        ("name", r"фио|студент|name"),
    ]
    return next((key for key, pattern in rules if re.search(pattern, value)), None)


def inspect_workbook(contents, filename, catalog):
    if catalog not in FIELDS:
        raise HTTPException(422, "Неизвестный тип справочника")
    if not filename.lower().endswith(".xlsx"):
        raise HTTPException(422, "Сохраните файл в формате .xlsx. Формат .xls не поддерживается.")
    try:
        book = openpyxl.load_workbook(BytesIO(contents), read_only=True, data_only=True)
    except Exception as exc:
        raise HTTPException(422, "Не удалось прочитать XLSX-файл") from exc
    try:
        rows = []
        headers = []
        for sheet in book.worksheets:
            nonempty = (row for row in sheet.iter_rows(values_only=True) if any(text(v) for v in row))
            first = next(nonempty, None)
            if first is None:
                continue
            positions = [(i, text(v)) for i, v in enumerate(first) if text(v)]
            candidate = [name for _, name in positions]
            if len(set(candidate)) != len(candidate):
                raise HTTPException(422, "В файле повторяются названия столбцов")
            candidate_rows = [{name: text(row[i]) if i < len(row) else "" for i, name in positions} for row in nonempty]
            if candidate_rows:
                headers, rows = candidate, candidate_rows
                break
        if not rows:
            raise HTTPException(422, "В файле нет строк для импорта")
        mapping = {}
        used = set()
        for header in headers:
            key = field_id(header)
            if key in FIELDS[catalog] and key not in used:
                mapping[header] = key
                used.add(key)
        return {"headers": headers, "rows": rows, "mapping": mapping, "catalog": catalog}
    finally:
        book.close()


def import_rows(db, catalog, rows, mapping, excluded=None, partnership_id=None):
    if catalog not in FIELDS or not isinstance(mapping, dict):
        raise HTTPException(422, "Некорректный тип справочника или сопоставление")
    assigned = [v for v in mapping.values() if v]
    if any(not isinstance(v, str) for v in assigned):
        raise HTTPException(422, "Некорректное сопоставление столбцов")
    if len(assigned) != len(set(assigned)) or set(assigned) - FIELDS[catalog]:
        raise HTTPException(422, "Поля сопоставлены повторно или не относятся к справочнику")
    missing = REQUIRED[catalog] - set(assigned)
    if missing:
        raise HTTPException(422, "Не сопоставлены обязательные поля: " + ", ".join(sorted(missing)))
    excluded = [] if excluded is None else excluded
    if not isinstance(excluded, list) or any(not isinstance(v, str) for v in excluded):
        raise HTTPException(422, "Некорректный список исключённых строк")
    known = {f"row-{i + 1}" for i in range(len(rows))}
    if set(excluded) - known:
        raise HTTPException(422, "Неизвестные исключённые строки")
    prepared = []
    limits = {"institution": 255, "program": 255, "direction": 100, "vendor": 100, "software": 100, "region": 100, "manager": 255}
    for i, row in enumerate(rows):
        if f"row-{i + 1}" in excluded:
            continue
        data = {target: text(row.get(source)) for source, target in mapping.items() if target}
        for key in REQUIRED[catalog]:
            if not data.get(key):
                raise HTTPException(422, f"Строка {i + 1}: не заполнено поле {key}")
        for key, limit in limits.items():
            if len(data.get(key, "")) > limit:
                raise HTTPException(422, f"Строка {i + 1}: поле {key} длиннее {limit} символов")
        if data.get("email") and not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", data["email"]):
            raise HTTPException(422, f"Строка {i + 1}: некорректная почта")
        prepared.append(data)
    if not prepared:
        raise HTTPException(422, "Нет строк для импорта")
    if catalog == "students" and not db.get(models.Partnership, partnership_id):
        raise HTTPException(422, "Выберите существующее партнёрство для студентов")
    added, updated = set(), set()

    def update(obj, values):
        for key, value in values.items():
            if value and getattr(obj, key) != value:
                setattr(obj, key, value)
                if obj not in added:
                    updated.add(obj)

    for data in prepared:
        if data.get("institution"):
            uni = db.query(models.University).filter_by(name=data["institution"]).first()
            if uni is None:
                uni = models.University(name=data["institution"])
                db.add(uni)
                added.add(uni)
            update(uni, {"region": data.get("region"), "contact_name": data.get("contact"), "contact_email": data.get("email"), "contact_phone": data.get("phone")})
        if data.get("manager"):
            manager = db.query(models.CatalogManager).filter_by(name=data["manager"]).first()
            if manager is None:
                manager = models.CatalogManager(name=data["manager"])
                db.add(manager)
                added.add(manager)
        if catalog in {"products", "directions", "interactions"} and (data.get("software") or data.get("program")):
            name = data.get("program") or data["software"]
            direction = data.get("direction", "")
            software = data.get("software", "")
            if software:
                prog = db.query(models.Program).filter_by(software=software, vendor=data.get("vendor", "")).order_by(models.Program.id).first()
            else:
                prog = db.query(models.Program).filter_by(name=name, direction=direction).order_by(models.Program.id).first()
            if prog is None:
                prog = models.Program(name=name, direction=direction, software=software, vendor=data.get("vendor", ""), priority=0, is_active=True)
                db.add(prog)
                added.add(prog)
            else:
                update(prog, {"name": data.get("program") or (name if not prog.name or prog.name == "Общая программа" else ""), "direction": direction, "vendor": data.get("vendor"), "software": software})
        if catalog == "students":
            candidates = db.query(models.Student).filter_by(partnership_id=partnership_id).all()
            if not any(s.email.lower() == data["email"].lower() and s.full_name == data["name"] for s in candidates):
                student = models.Student(partnership_id=partnership_id, full_name=data["name"], email=data["email"])
                db.add(student)
                added.add(student)
        db.flush()
    return {"status": "ok", "processed": len(prepared), "added": len(added), "updated": len(updated), "partnerships_created": 0}
