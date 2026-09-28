export const STEPS = [
  "Поиск контактов",
  "Коммуникация с вузом",
  "Встреча с представителями",
  "Обмен документами",
  "Корректировка документов",
  "Подписание документов",
  "Материалы, лицензия и документы",
  "Сопровождение внедрения",
  "Обучение преподавателей",
  "Актуализация учебной программы",
  "Ведение занятий",
  "Актуализация документации",
  "Повышение квалификации",
  "Контроль исполнения этапов",
];

export const OWNERS = [
  "Максим Топталов",
  "Яхья Амин",
  "Павел Милючихин",
  "Андрей Махт",
  "Иван Иванов",
];

export const PROGRAMS = [
  "Информационная безопасность",
  "DevOps",
  "Облачные технологии",
  "Data Science",
  "QA",
];

export const PRODUCTS = [
  "Solar Dozor",
  "РТК-Платформа",
  "Облако",
];

export const VENDORS = [
  "Ростелеком",
  "Ростелеком-Солар",
];

export const SOFTWARE_CATALOG = [
  { value: "Solar Dozor", label: "Solar Dozor", vendor: "Ростелеком-Солар" },
  { value: "РТК-Платформа", label: "РТК-Платформа", vendor: "Ростелеком" },
  { value: "РТК-Инфраструктура", label: "РТК-Инфраструктура", vendor: "Ростелеком" },
  { value: "Облако", label: "Облако", vendor: "Ростелеком" },
];

export const INITIAL_FILTERS = {
  search: "",
  direction: [],
  products: [],
  status: [],
  owner: [],
  start: "",
  end: "",
  institution: [],
  city: [],
  changed: "",
};

export const uid = () => crypto.randomUUID();
export const now = () => new Date().toISOString();

export const dateLabel = (value) =>
  value
    ? new Date(
        value.length === 10 ? value + "T12:00:00" : value
      ).toLocaleDateString("ru-RU")
    : "—";

export function selection(value) {
  return [
    ...new Set(
      (Array.isArray(value) ? value : value ? [value] : []).filter(Boolean)
    ),
  ];
}

export function listText(value) {
  return selection(
    Array.isArray(value) ? value : String(value || "").split(",").map((item) => item.trim())
  ).join(", ");
}

export function softwareValues(value) {
  return selection(
    Array.isArray(value) ? value : String(value || "").split(",").map((item) => item.trim())
  );
}

export function softwareVendors(values) {
  const selected = softwareValues(values);
  return selection(
    SOFTWARE_CATALOG
      .filter((entry) => selected.includes(entry.value))
      .map((entry) => entry.vendor)
  );
}

export function includesSelection(chosen, value) {
  const values = selection(chosen);
  return !values.length || selection(value).some((item) => values.includes(item));
}

export function stageData() {
  return {
    comments: [],
    files: [],
    conditions: [false, false, false],
  };
}

export async function fetchStages() {
  const token = localStorage.getItem("token");
  if (!token) return [];

  try {
    const response = await fetch("/api/v1/workflow/stages", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) throw new Error("API error");
    const data = await response.json();
    return data.map((stage) => stage.title);
  } catch (error) {
    return [];
  }
}

export async function fetchInteractions() {
  const token = localStorage.getItem("token");
  if (!token) return [];

  try {
    const response = await fetch("/api/v1/partnerships", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) throw new Error("API error");
    const data = await response.json();

    return data.map((item) => ({
      id: item.id,
      name: item.university_name,
      badge: item.university_name.split(" ")[0].substring(0, 4).toUpperCase(),
      direction: item.program_name,
      product: "", 
      city: "РФ", 
      owner: item.manager_name || "Не назначен",
      stage: item.stage_id,
      done: item.stage_id === 14,
      status: "В работе",
      changed: now(),
      start: now().slice(0, 10),
      due: "",
      contract: { signed: "Нет", transfer: "Не передавалось" },
      contact: { name: "", phone: "", email: "" },
      stages: {
        [item.stage_id]: stageData()
      },
      history: []
    }));
  } catch (error) {
    return [];
  }
}

export async function moveStageAPI(partnership_id, target_stage) {
  const token = localStorage.getItem("token");
  const response = await fetch(`/api/v1/partnerships/${partnership_id}/stage`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ stage_id: target_stage })
  });
  if (!response.ok) throw new Error("Stage update failed");
  return response.json();
}

export function matches(item, filters) {
  const text = [item.name, item.direction, item.product, item.city, item.owner]
    .join(" ")
    .toLocaleLowerCase("ru");
  const day = (item.changed || "").slice(0, 10);

  return (
    (!filters.search || text.includes(filters.search.trim().toLocaleLowerCase("ru"))) &&
    includesSelection(filters.direction, item.direction) &&
    includesSelection(filters.products, item.product) &&
    includesSelection(filters.status, item.done ? "Завершено" : item.status) &&
    includesSelection(filters.owner, item.owner) &&
    includesSelection(filters.institution, item.name) &&
    includesSelection(filters.city, item.city) &&
    (!filters.changed || day === filters.changed) &&
    (!filters.start || day >= filters.start) &&
    (!filters.end || day <= filters.end)
  );
}

export function hasFilters(filters) {
  return Object.values(filters).some((value) =>
    Array.isArray(value) ? value.length > 0 : Boolean(value)
  );
}

export function filterLabels(filters) {
  return [
    ["Поиск", filters.search || "Не задан"],
    ["IT направления", listText(filters.direction) || "Все направления"],
    ["ИТ-продукты", listText(filters.products) || "Все продукты"],
    ["Статус", listText(filters.status) || "Все статусы"],
    ["Ответственный КАМ", listText(filters.owner) || "Все"],
    ["Период", filters.start ? dateLabel(filters.start) + " — " + dateLabel(filters.end) : "Всё время"],
    ["Учреждение", listText(filters.institution) || "Все"],
    ["Город", listText(filters.city) || "Все"],
    ["Дата изменения", dateLabel(filters.changed)],
  ];
}

export function maskContact(contact) {
  return {
    name: contact.name ? contact.name.split(" ").map((part) => part[0] + "***").join(" ") : "",
    position: contact.position || "",
    phone: contact.phone ? "+7 *** ***-**-" + contact.phone.replace(/\D/g, "").slice(-2) : "",
    email: contact.email ? contact.email[0] + "***@" + contact.email.split("@")[1] : "",
  };
}

export function recordLabel(count) {
  const number = Math.abs(count) % 100;
  const last = number % 10;
  const word = number > 10 && number < 20 ? "записей" : last === 1 ? "запись" : last >= 2 && last <= 4 ? "записи" : "записей";
  return count + " " + word;
}

let memory = null;
export function readMemory() { return memory; }
export function writeMemory(value) { memory = value; }