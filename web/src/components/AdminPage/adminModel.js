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
  {
    id: "interactions",
    label: "Сквозной импорт",
    description: "Единый реестр взаимодействий",
    filename: "interactions_registry.xlsx",
    count: 0,
    fields: [
      field("institution", "Название учреждения", true),
      productFields[1],
      productFields[0],
      ...productFields.slice(2),
      field("manager", "ФИО Менеджера", false, "ФИО менеджера"),
      field("contact", "Ответственные от учреждения", false, "Ответственный от вуза"),
      field("comment", "Комментарий")
    ]
  },
  {
    id: "products",
    label: "ИТ-продукты",
    description: "Обновление системного справочника ИТ-продуктов",
    filename: "it_products.xlsx",
    count: 0,
    fields: productFields
  },
  {
    id: "directions",
    label: "ИТ-направления",
    description: "Обновление системного справочника ИТ-направлений и программ",
    filename: "it_directions.xlsx",
    count: 0,
    fields: [
      field("direction", "ИТ-направление", true, "Направление"),
      field("program", "ИТ-программа", true, "Название программы")
    ]
  },
  {
    id: "institutions",
    label: "Список учреждений",
    description: "Обновление системного списка учреждений",
    filename: "institutions.xlsx",
    count: 0,
    fields: [
      field("institution", "Название учреждения", true, "Наименование организации"),
      field("region", "Регион / Город", false, "Регион")
    ]
  },
  {
    id: "contacts",
    label: "Список ответственных",
    description: "Обновление системного списка ответственных",
    filename: "responsibles.xlsx",
    count: 0,
    fields: [
      field("contact", "Ответственный от учреждения", true, "ФИО представителя"),
      field("institution", "Организация / Учреждение", true, "Организация"),
      field("manager", "Ответственный менеджер (КАМ)", false, "КАМ"),
      field("email", "Почта", false, "Email"),
      field("phone", "Номер телефона", false, "Телефон")
    ]
  },
];

export const studentCatalog = {
  id: "students",
  label: "Списки студентов",
  description: "Импорт обучающихся с привязкой к партнёрству",
  filename: "students.xlsx",
  count: 0,
  fields: [
    field("name", "ФИО", true),
    field("email", "Email", true)
  ]
};

export const conditions = [
  "Получены необходимые материалы",
  "Прикреплён обязательный документ",
  "Подтверждено целевое действие"
];

export const BASE_STAGES = [
  "Поиск контактов ответственного в вузе",
  "Коммуникация и уточнение программ",
  "Организация встречи",
  "Обмен документами для подписания",
  "Корректировка документов",
  "Подписание документов",
  "Передача материалов и лицензий ПО",
  "Сопровождение внедрения",
  "Обучение преподавателей",
  "Актуализация учебной программы",
  "Ведение занятий",
  "Актуализация документации",
  "Повышение квалификации преподавателей",
  "Контроль за исполнением этапов",
];

export const numberStage = index => String(index + 1).padStart(2, "0");

export function createDemoData() {
  return {
    canManage: true,
    partnerships: [],
    stages: BASE_STAGES.map((name, i) => ({
      id: `stage-${i + 1}`,
      name,
      count: 0,
      conditions: [true, true, true],
      migrationAllowed: true,
    })),
    audit: [],
  };
}

export function createSample(catalog) {
  const columns = catalog.fields.map(f => ({ id: f.id, label: f.source }));
  return {
    jobId: `import-${catalog.id}`,
    filename: catalog.filename,
    size: 0,
    columns,
    rows: [],
    mapping: Object.fromEntries(columns.map(c => [c.id, c.id]))
  };
}

export function validateImport(catalog, data, mapping, excluded = new Set()) {
  const assigned = Object.values(mapping).filter(Boolean);
  const missing = catalog.fields.filter(f => f.required && !assigned.includes(f.id));
  const duplicates = assigned.filter((id, i) => assigned.indexOf(id) !== i);
  const errors = new Map();

  for (const row of (data?.rows || [])) {
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

  const count = (data?.rows || []).filter(row => !excluded.has(row.id)).length;
  const invalid = [...errors.keys()].filter(id => !excluded.has(id));
  return {
    missing,
    duplicates,
    errors,
    invalid,
    count,
    valid: !missing.length && !duplicates.length && !invalid.length && count > 0
  };
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
    if (next.some(s => s.id !== change.id && s.name.toLocaleLowerCase() === name.toLocaleLowerCase())) {
      throw new Error("Этап с таким названием уже существует");
    }
    if (change.type === "edit") {
      next[index] = { ...next[index], name, conditions: [...change.conditions] };
    } else {
      const after = change.after === "start" ? -1 : next.findIndex(s => s.id === change.after);
      if (after < 0 && change.after !== "start") throw new Error("Выберите расположение этапа");
      next.splice(after + 1, 0, {
        id: change.id,
        name,
        conditions: [true, true, true],
        count: 0,
        isNew: true,
        migrationAllowed: true
      });
    }
  } else if (change.type === "move") {
    const [stage] = next.splice(index, 1);
    const after = change.after === "start" ? -1 : next.findIndex(s => s.id === change.after);
    if (after < 0 && change.after !== "start") throw new Error("Выберите расположение этапа");
    next.splice(after + 1, 0, stage);
  } else if (change.type === "delete") {
    if (next[index].count > 0) {
      if (!migrationTargets(stages, change.id).some(s => s.id === change.target)) {
        throw new Error("Выберите соседний допустимый этап");
      }
      next.find(s => s.id === change.target).count += next[index].count;
    }
    next.splice(index, 1);
  } else {
    throw new Error("Неизвестная операция Workflow");
  }
  return next;
}

export function pageNumbers(current, total) {
  return [...new Set([1, current - 1, current, current + 1, total])]
    .filter(n => n >= 1 && n <= total)
    .sort((a, b) => a - b)
    .flatMap((n, i, all) => i > 0 && n - all[i - 1] > 1 ? [`gap-${n}`, n] : [n]);
}