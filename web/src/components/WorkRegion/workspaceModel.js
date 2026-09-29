import { apiJson, apiRequest } from "../../api.js";
export const STEPS = [];
export const OWNERS = [];
export const PROGRAMS = [];
export const PRODUCTS = [];
export const VENDORS = [];
export const SOFTWARE_CATALOG = [];

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

export function softwareVendors(values, catalog = []) {
  const selected = softwareValues(values);
  return selection(
    catalog
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
  const stages = await apiJson("/api/v1/workflow/stages");
  const names = stages.map(stage => stage.title);
  STEPS.splice(0, STEPS.length, ...names);
  return names;
}

export async function fetchManagers() {
  const managers = await apiJson("/api/v1/staff");
  const options = managers.map(person => ({ value: person.username, label: person.name }));
  OWNERS.splice(0, OWNERS.length, ...options);
  return options;
}

export async function fetchCatalogs() {
  return apiJson("/api/v1/catalogs/options", { cache: "no-store" });
}

export function mapInteraction(item) {
  return {
    id: item.id, name: item.university_name,
    badge: (item.university_name || "ВУЗ").split(" ")[0].slice(0, 4).toUpperCase(),
    direction: item.program_name, product: item.software || "", city: item.region || "",
    owner: item.manager_name || "", ownerName: item.manager_display_name || item.manager_name || "", stage: item.stage_id, workflowStageId: item.workflow_stage_id,
    workflowVersion: item.workflow_version, stepNames: item.step_names || [],
    done: Boolean(item.completed), status: item.completed ? "Завершено" : item.due && new Date(item.due + "T23:59:59") < new Date() ? "Просрочено" : "В работе",
    changed: item.updated_at || "", start: item.created_at?.slice(0, 10) || "", due: item.due || "",
    contract: item.contract || {}, contact: item.contact || {}, stages: item.stages || {}, history: item.history || []
  };
}

export async function fetchInteractions() {
  return (await apiJson("/api/v1/partnerships")).map(mapInteraction);
}

export async function fetchInteraction(id) {
  return mapInteraction(await apiJson(`/api/v1/partnerships/${id}`));
}

export async function createPartnershipAPI(payload) {
  const result = await apiJson("/api/v1/partnerships", { method: "POST", body: JSON.stringify(payload) });
  return result.kind === "request" ? result : mapInteraction(result);
}

export function expected(item) {
  return { expected_stage_id: item.workflowStageId, workflow_version: item.workflowVersion };
}

export async function updatePartnershipAPI(id, payload) {
  return mapInteraction(await apiJson(`/api/v1/partnerships/${id}`, { method: "PATCH", body: JSON.stringify(payload) }));
}

export async function moveStageAPI(item, target, comment, complete = false) {
  return mapInteraction(await apiJson(`/api/v1/partnerships/${item.id}/stage`, {
    method: "PATCH", body: JSON.stringify({ ...expected(item), stage_id: target, comment, complete })
  }));
}

export async function saveCondition(item, index, value) {
  return mapInteraction(await apiJson(`/api/v1/partnerships/${item.id}/conditions`, {
    method: "PATCH", body: JSON.stringify({ ...expected(item), index, value })
  }));
}

export async function saveComment(item, text) {
  return mapInteraction(await apiJson(`/api/v1/partnerships/${item.id}/comments`, {
    method: "POST", body: JSON.stringify({ ...expected(item), text })
  }));
}

export async function uploadFile(item, form) {
  const body = new FormData();
  body.append("file", form.file);
  body.append("document_type", form.documentType);
  body.append("expected_stage_id", item.workflowStageId);
  body.append("workflow_version", item.workflowVersion);
  body.append("metadata", JSON.stringify({ number: form.number || "", licenseEnd: form.licenseEnd || "", signed: form.signed || "Нет", transfer: form.transfer || "Не передавалось" }));
  body.append("comment", form.comment || "");
  return mapInteraction(await apiJson(`/api/v1/partnerships/${item.id}/files`, { method: "POST", body }));
}

export async function deleteFile(item, file) {
  const query = new URLSearchParams(expected(item));
  return mapInteraction(await apiJson(`/api/v1/files/${file.id}?${query}`, { method: "DELETE" }));
}

export async function downloadFile(file) {
  const response = await apiRequest(`/api/v1/files/${file.id}`);
  const url = URL.createObjectURL(await response.blob());
  const link = document.createElement("a");
  link.href = url;
  link.download = file.name;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
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
    email: contact.email && contact.email.includes("@")
      ? contact.email[0] + "***@" + contact.email.split("@")[1]
      : (contact.email || ""),
  };
}

export function recordLabel(count) {
  const number = Math.abs(count) % 100;
  const last = number % 10;
  return count + " " + (number > 10 && number < 20 ? "записей" : last === 1 ? "запись" : last >= 2 && last <= 4 ? "записи" : "записей");
}

let memory = null;
export function readMemory() { return memory; }
export function writeMemory(value) { memory = value; }
export async function fetchRequests() {
  return apiJson("/api/v1/requests");
}

export async function decideRequest(id, decision, owner, comment) {
  return apiJson(`/api/v1/requests/${id}/decision`, {
    method: "POST", body: JSON.stringify({ decision, manager_name: owner, comment })
  });
}
