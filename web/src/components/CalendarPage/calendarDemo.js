const institutions = [
  { institution: "МГТУ им. Н. Э. Баумана", shortInstitution: "МГТУ", program: "DevOps", product: "Solar", manager: "Александр Иванов", city: "Москва" },
  { institution: "НИЯУ МИФИ", shortInstitution: "НИЯУ МИФИ", program: "Информационная безопасность", product: "Solar", manager: "Мария Смирнова", city: "Москва" },
  { institution: "Университет ИТМО", shortInstitution: "ИТМО", program: "Облачные технологии", product: "", manager: "Дмитрий Соколов", city: "Санкт-Петербург" },
];
const rows = [
  [2, 0, "deadline", "Дедлайн этапа 06", "18:00"],
  [4, 1, "license", "Передача лицензии", "14:00", "15:00"],
  [8, 2, "training", "Старт обучения", "10:00", "11:00"],
  [11, 0, "deadline", "Дедлайн этапа 07", "18:00"],
  [14, 1, "license", "Передача лицензии"],
  [16, 1, "deadline", "Дедлайн этапа 08", "16:00"],
  [18, 0, "deadline", "Дедлайн этапа 08", "18:00"],
  [18, 2, "training", "Старт обучения", "11:00", "12:00"],
  [18, 1, "license", "Передача лицензии", "14:00", "15:00"],
  [18, 0, "training", "Старт обучения", "10:00", "11:00"],
  [20, 2, "training", "Старт обучения"],
  [21, 0, "training", "Старт обучения", "10:00", "11:00"],
  [23, 1, "license", "Передача лицензии", "14:00", "15:00"],
  [25, 0, "deadline", "Дедлайн этапа 09", "18:00"],
  [28, 2, "training", "Старт обучения", "10:00", "11:00"],
  [30, 1, "deadline", "Дедлайн этапа 09", "18:00"],
];
export const calendarDemoEvents = rows.map(([day, institution, type, title, startTime, endTime], index) => ({
  ...institutions[institution], id: `demo-${index}`, date: `2026-09-${String(day).padStart(2, "0")}`, type, title, startTime, endTime,
}));
