const field = (id, label, required = false, source = label) => ({ id, label, required, source });
const productFields = [
  field("software", "ПО", true, "Наименование ПО"),
  field("vendor", "Вендор", true),
  field("contract", "Номер договора"),
  field("signed", "Подписание лицензии"),
  field("year", "Срок действия лицензии (год)", false, "Срок действия"),
  field("delivery", "Статус по передаче", false, "Статус передачи"),
];

export const catalogs = [
  { id: "interactions", label: "Сквозной импорт", description: "Единый реестр взаимодействий", filename: "interactions_registry_2026.xlsx", count: 248,
    fields: [field("institution", "Название учреждения", true), productFields[1], productFields[0], ...productFields.slice(2),
      field("manager", "ФИО Менеджера", false, "ФИО менеджера"),
      field("contact", "Ответственные от учреждения", false, "Ответственный от вуза"), field("comment", "Комментарий")] },
  { id: "products", label: "ИТ-продукты", description: "Обновление системного справочника ИТ-продуктов", filename: "it_products_2026.xlsx", count: 18, fields: productFields },
  { id: "directions", label: "ИТ-направления", description: "Обновление системного справочника ИТ-направлений и программ", filename: "it_directions_2026.xlsx", count: 32,
    fields: [field("direction", "ИТ-направление", true, "Направление"), field("program", "ИТ-программа", true, "Название программы")] },
  { id: "institutions", label: "Список учреждений", description: "Обновление системного списка учреждений", filename: "institutions_2026.xlsx", count: 248,
    fields: [field("institution", "Название учреждения", true, "Наименование организации"), field("region", "Регион / Город", false, "Регион")] },
  { id: "contacts", label: "Список ответственных", description: "Обновление системного списка ответственных", filename: "responsibles_2026.xlsx", count: 40,
    fields: [field("contact", "Ответственный от учреждения", true, "ФИО представителя"), field("institution", "Организация / Учреждение", true, "Организация"),
      field("manager", "Ответственный менеджер (КАМ)", false, "КАМ"), field("email", "Почта", false, "Email"), field("phone", "Номер телефона", false, "Телефон")] },
];
export const studentCatalog = { id: "students", label: "Списки студентов", description: "Импорт обучающихся с привязкой к партнёрству", filename: "students_devops_2026.xlsx", count: 124,
  fields: [field("name", "ФИО", true), field("email", "Email", true)] };

export const conditions = ["Получены необходимые материалы", "Прикреплён обязательный документ", "Подтверждено целевое действие"];
const stageNames = ["Поиск контактов", "Коммуникация с вузом", "Встреча с представителями", "Обмен документами", "Корректировка документов", "Подписание документов", "Материалы, лицензия и документы", "Сопровождение внедрения", "Обучение преподавателей", "Актуализация учебной программы", "Ведение занятий", "Актуализация документации", "Повышение квалификации", "Контроль исполнения этапов"];
const names = ["Иванов Алексей Сергеевич", "Петрова Мария Игоревна", "Соколов Дмитрий Андреевич", "Смирнова Анна Олеговна", "Кузнецов Павел Сергеевич"];
const institutions = ["МГТУ им. Н. Э. Баумана", "НИЯУ МИФИ", "Университет ИТМО", "УрФУ", "НГУ"];
export const numberStage = index => String(index + 1).padStart(2, "0");

export function createDemoData() {
  return {
    canManage: true,
    partnerships: [{ id: "bauman-devops", label: `${institutions[0]} · DevOps` }, { id: "mifi-security", label: `${institutions[1]} · Информационная безопасность` }],
    stages: stageNames.map((name, i) => ({ id: `stage-${i + 1}`, name, count: i === 5 ? 18 : i === 11 ? 0 : 12, conditions: [true, true, true], migrationAllowed: true })),
    audit: Array.from({ length: 248 }, (_, i) => ({
      id: `audit-${i}`, date: new Date(Date.UTC(2026, 8, 24, 11, 32) - i * 22 * 60000).toISOString(),
      user: ["Александр Иванов", "Мария Смирнова", "Дмитрий Соколов"][i % 3],
      action: ["Просмотр ПДн", "Изменение этапа", "Изменение ответственного", "Импорт данных", "Изменение Workflow"][i % 5],
      object: i % 5 === 3 ? "Справочник учреждений · 248 записей" : i % 5 === 4 ? "Единый маршрут · 06 — Подписание документов" : `${institutions[i % 2]} · ${i % 2 ? "Информационная безопасность" : "DevOps"}`,
      ip: ["10.10.24.18", "10.10.24.31", "10.10.24.42"][i % 3],
    })),
  };
}

export function createSample(catalog, scenario = "ready") {
  const columns = catalog.fields.map(f => ({ id: f.id, label: f.source }));
  const newCount = { students: 2, products: 2, directions: 3, contacts: 4 }[catalog.id] ?? 7;
  const rows = Array.from({ length: catalog.count }, (_, i) => {
    const values = {
      institution: institutions[i % 5], region: ["Москва", "Москва", "Санкт-Петербург", "Свердловская область / Екатеринбург", "Новосибирская область / Новосибирск"][i % 5],
      name: names[i % 5], contact: names[i % 5], manager: names[i % 2], email: `student${i + 1}@example.ru`, phone: i % 3 ? "+7 (000) 000-00-01" : "",
      software: i % 2 ? "РТК Платформа" : "Solar Dozor", vendor: i % 2 ? "Ростелеком" : "Ростелеком-Солар",
      contract: i % 5 === 3 ? "" : `Д-2026-${String(i + 1).padStart(3, "0")}`, signed: i % 2 ? "нет" : "да", year: i % 2 ? "2027" : "2028",
      delivery: i % 2 ? "Ожидает передачи" : "Передано", comment: i % 3 ? "" : "Материалы переданы",
      direction: ["DevOps", "QA", "ИБ", "Анализ данных", "DevOps"][i % 5], program: ["Основы DevOps", "Практикум по QA", "Основы информационной безопасности", "Основы анализа данных", "Администрирование инфраструктуры"][i % 5],
    };
    if (scenario === "row-error" && i === 1) values[catalog.id === "students" ? "email" : catalog.id === "interactions" ? "vendor" : catalog.fields[0].id] = "";
    return { id: `row-${i + 1}`, line: i + 2, isNew: i < newCount, values: Object.fromEntries(columns.map(c => [c.id, values[c.id] ?? ""])) };
  });
  const mapping = Object.fromEntries(columns.map(c => [c.id, c.id]));
  if (scenario === "mapping-error") mapping[catalog.fields.find(f => f.required).id] = "";
  return { jobId: `demo-${catalog.id}`, filename: catalog.filename, size: 84 * 1024, columns, rows, mapping };
}

export function validateImport(catalog, data, mapping, excluded = new Set()) {
  const assigned = Object.values(mapping).filter(Boolean);
  const missing = catalog.fields.filter(f => f.required && !assigned.includes(f.id));
  const duplicates = assigned.filter((id, i) => assigned.indexOf(id) !== i);
  const errors = new Map();
  for (const row of data.rows) {
    const problems = {};
    for (const [column, target] of Object.entries(mapping)) {
      const f = catalog.fields.find(item => item.id === target);
      if (!f) continue;
      const value = String(row.values[column] ?? "").trim();
      if (f.required && !value) problems[column] = `Не заполнено обязательное поле: ${f.label}`;
      else if (value && f.id === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) problems[column] = "Некорректный email";
      else if (value && f.id === "signed" && !["да", "нет"].includes(value.toLowerCase())) problems[column] = "Допустимо только «да» или «нет»";
      else if (value && f.id === "year" && !/^\d{4}$/.test(value)) problems[column] = "Укажите год из четырёх цифр";
    }
    for (const [column, message] of Object.entries(row.errors ?? {})) {
      if (column === "_row" || mapping[column]) problems[column] = message;
    }
    if (Object.keys(problems).length) errors.set(row.id, problems);
  }
  const count = data.rows.filter(row => !excluded.has(row.id)).length;
  const invalid = [...errors.keys()].filter(id => !excluded.has(id));
  return { missing, duplicates, errors, invalid, count, valid: !missing.length && !duplicates.length && !invalid.length && count > 0 };
}

export function migrationTargets(stages, id) {
  const index = stages.findIndex(stage => stage.id === id);
  if (index < 0) return [];
  return [stages[index - 1], stages[index + 1]].filter(stage => stage && stage.migrationAllowed !== false);
}

export function applyWorkflowChange(stages, change) {
  const next = stages.map(stage => ({ ...stage, conditions: [...stage.conditions] }));
  const index = next.findIndex(stage => stage.id === change.id);
  if (change.type !== "add" && index < 0) throw new Error("Этап уже удалён. Обновите страницу.");
  if (["add", "edit"].includes(change.type)) {
    const name = change.name?.trim();
    if (!name) throw new Error("Введите название этапа");
    if (next.some(s => s.id !== change.id && s.name.toLocaleLowerCase() === name.toLocaleLowerCase())) throw new Error("Этап с таким названием уже существует");
    if (change.type === "edit") next[index] = { ...next[index], name, conditions: [...change.conditions] };
    else {
      const after = change.after === "start" ? -1 : next.findIndex(s => s.id === change.after);
      if (after < 0 && change.after !== "start") throw new Error("Выберите расположение этапа");
      next.splice(after + 1, 0, { id: change.id, name, conditions: [true, true, true], count: 0, isNew: true, migrationAllowed: true });
    }
  } else if (change.type === "move") {
    const [stage] = next.splice(index, 1);
    const after = change.after === "start" ? -1 : next.findIndex(s => s.id === change.after);
    if (after < 0 && change.after !== "start") throw new Error("Выберите расположение этапа");
    next.splice(after + 1, 0, stage);
  } else if (change.type === "delete") {
    if (next[index].count > 0) {
      if (!migrationTargets(stages, change.id).some(s => s.id === change.target)) throw new Error("Выберите соседний допустимый этап");
      next.find(s => s.id === change.target).count += next[index].count;
    }
    next.splice(index, 1);
  } else throw new Error("Неизвестная операция Workflow");
  return next;
}

export function pageNumbers(current, total) {
  return [...new Set([1, current - 1, current, current + 1, total])].filter(n => n >= 1 && n <= total).sort((a, b) => a - b)
    .flatMap((n, i, all) => i > 0 && n - all[i - 1] > 1 ? [`gap-${n}`, n] : [n]);
}
