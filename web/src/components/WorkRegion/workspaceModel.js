export const OWNERS = [
  "Александр Иванов",
  "Мария Смирнова",
  "Дмитрий Соколов",
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
];

export const SOFTWARE_CATALOG = [
  {
    value: "Solar Dozor",
    vendor: "Ростелеком-Солар",
  },
  {
    value: "РТК-Платформа",
    vendor: "Ростелеком",
  },
  {
    value: "Облако",
    vendor: "Ростелеком",
  },
];

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
      (
        Array.isArray(value)
          ? value
          : value
            ? [value]
            : []
      ).filter(Boolean)
    ),
  ];
}

export function listText(value) {
  return selection(
    Array.isArray(value)
      ? value
      : String(value || "")
          .split(",")
          .map((item) => item.trim())
  ).join(", ");
}

export function includesSelection(chosen, value) {
  const values = selection(chosen);

  return (
    !values.length ||
    selection(value).some((item) => values.includes(item))
  );
}

export function softwareValues(value) {
  return selection(
    Array.isArray(value)
      ? value
      : String(value || "")
          .split(",")
          .map((item) => item.trim())
  ).map((item) =>
    item === "Solar" ? "Solar Dozor" : item
  );
}

export function softwareVendors(values) {
  return [
    ...new Set(
      values
        .map(
          (value) =>
            SOFTWARE_CATALOG.find(
              (item) => item.value === value
            )?.vendor
        )
        .filter(Boolean)
    ),
  ];
}

export function stageData() {
  return {
    comments: [],
    files: [],
    conditions: [false, false, false],
  };
}

export function newInteraction(
  name,
  direction,
  owner = "",
  stage = 1
) {
  return {
    id: uid(),
    name,
    badge: name.split(" ")[0],
    direction,
    product: "",
    city: "",
    owner,
    stage,
    done: false,
    status: "В работе",
    changed: now(),
    start: now().slice(0, 10),
    due: "",
    contract: {
      vendor: "",
      software: "",
      number: "",
      licenseEnd: "",
      signed: "Нет",
      transfer: "Не передавалось",
    },
    contact: {
      name: "",
      position: "",
      phone: "",
      email: "",
    },
    stages: {
      [stage]: stageData(),
    },
    history: [],
  };
}

export function createInteractions() {
  const tuples = [
    [
      "bmstu",
      "МГТУ им. Н. Э. Баумана",
      "МГТУ",
      "DevOps",
      "РТК-Платформа",
      "Москва",
      OWNERS[0],
      8,
    ],
    [
      "mephi",
      "НИЯУ МИФИ",
      "МИФИ",
      PROGRAMS[0],
      "Solar Dozor",
      "Москва",
      OWNERS[1],
      6,
    ],
    [
      "itmo",
      "ИТМО",
      "ИТМО",
      PROGRAMS[2],
      "РТК-Платформа",
      "Санкт-Петербург",
      OWNERS[2],
      9,
    ],
  ];

  return tuples.map(
    (
      [id, name, badge, direction, product, city, owner, stage],
      index
    ) => {
      const item = {
        ...newInteraction(name, direction, owner, stage),
        id,
        badge,
        product,
        city,
        start: "2026-09-12",
        due: [
          "2026-09-20",
          "2026-09-18",
          "2026-09-25",
        ][index],
        changed: "2026-09-27T12:45:00+03:00",
        status: [
          "Требует внимания",
          "Просрочено",
          "В работе",
        ][index],
      };

      for (let number = 1; number <= stage; number++) {
        item.stages[number] = {
          ...stageData(),
          completedAt:
            number < stage
              ? "2026-09-" + String(number + 1).padStart(2, "0")
              : "",
        };
      }

      if (id === "bmstu") {
        item.contract = {
          vendor: "Ростелеком",
          software: "Облако",
          number: "142/26",
          licenseEnd: "2027-09-30",
          signed: "В процессе",
          transfer: "Не передавалось",
        };

        item.contact = {
          name: "Мария Сергеева",
          position: "",
          phone: "+7 999 123-45-41",
          email: "m.sergeeva@bmstu.ru",
        };

        item.stages[8] = {
          conditions: [true, true, false],
          comments: [
            {
              id: "comment-8",
              author: OWNERS[0],
              at: "2026-09-27T12:45:00+03:00",
              text:
                "Получены технические материалы от вуза. " +
                "Необходимо подтвердить дату начала внедрения.",
            },
          ],
          files: [
            {
              id: "document-8",
              name: "Документация_внедрения.png",
              size: 2516582,
              at: "2026-09-27T11:20:00+03:00",
              type: "other",
            },
          ],
        };

        item.stages[4].comments = [
          {
            id: "comment-4",
            author: OWNERS[0],
            at: "2026-09-08T14:20:00+03:00",
            text:
              "Пакет документов передан представителям вуза. " +
              "Состав и версии согласованы.",
          },
        ];
      }

      return item;
    }
  );
}

export function matches(item, filters) {
  const text = [
    item.name,
    item.direction,
    item.product,
    item.city,
    item.owner,
  ]
    .join(" ")
    .toLocaleLowerCase("ru");

  const day = (item.changed || "").slice(0, 10);

  return (
    (!filters.search ||
      text.includes(
        filters.search.trim().toLocaleLowerCase("ru")
      )) &&
    includesSelection(filters.direction, item.direction) &&
    includesSelection(filters.products, item.product) &&
    includesSelection(
      filters.status,
      item.done ? "Завершено" : item.status
    ) &&
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
    Array.isArray(value)
      ? value.length > 0
      : Boolean(value)
  );
}

export function filterLabels(filters) {
  return [
    ["Поиск", filters.search || "Не задан"],
    [
      "IT направления",
      listText(filters.direction) || "Все направления",
    ],
    [
      "ИТ-продукты",
      listText(filters.products) || "Все продукты",
    ],
    ["Статус", listText(filters.status) || "Все статусы"],
    ["Ответственный КАМ", listText(filters.owner) || "Все"],
    [
      "Период",
      filters.start
        ? dateLabel(filters.start) + " — " + dateLabel(filters.end)
        : "Всё время",
    ],
    ["Учреждение", listText(filters.institution) || "Все"],
    ["Город", listText(filters.city) || "Все"],
    ["Дата изменения", dateLabel(filters.changed)],
  ];
}

export function moveStage(item, target, text, author) {
  if (
    target < 1 ||
    target > 14 ||
    Math.abs(target - item.stage) !== 1
  ) {
    throw new Error("Недопустимый переход.");
  }

  const timestamp = now();
  const previous = item.stages[item.stage] || stageData();

  const entry = {
    ...previous,
    comments: [
      ...previous.comments,
      {
        id: uid(),
        author,
        text,
        at: timestamp,
      },
    ],
  };

  const completed = target > item.stage;

  const stages = {
    ...item.stages,
    [item.stage]: {
      ...entry,
      completedAt: completed ? timestamp : "",
    },
    [target]: {
      ...(item.stages[target] || stageData()),
      completedAt: "",
    },
  };

  return {
    ...item,
    stage: target,
    done: false,
    changed: timestamp,
    stages,
    history: [
      ...item.history,
      {
        ...entry,
        stage: item.stage,
        contract: { ...item.contract },
        owner: item.owner,
        at: timestamp,
        outcome: completed ? "completed" : "returned",
      },
    ],
  };
}

let memory = null;

export function readMemory() {
  return memory;
}

export function writeMemory(value) {
  memory = value;
}

export function maskContact(contact) {
  return {
    name: contact.name
      ? contact.name
          .split(" ")
          .map((part) => part[0] + "***")
          .join(" ")
      : "",
    position: contact.position || "",
    phone: contact.phone
      ? "+7 *** ***-**-" +
        contact.phone.replace(/\D/g, "").slice(-2)
      : "",
    email: contact.email
      ? contact.email[0] +
        "***@" +
        contact.email.split("@")[1]
      : "",
  };
}

export function recordLabel(count) {
  const number = Math.abs(count) % 100;
  const last = number % 10;

  const word =
    number > 10 && number < 20
      ? "записей"
      : last === 1
        ? "запись"
        : last >= 2 && last <= 4
          ? "записи"
          : "записей";

  return count + " " + word;
}