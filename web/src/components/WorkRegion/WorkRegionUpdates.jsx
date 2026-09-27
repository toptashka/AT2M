import { useId, useRef, useState } from "react";
import { downloadChart } from "./chartExport";
import "./WorkRegionUpdates.css";

export const INCOMING_DEMO = [
  {
    id: "bmstu-request",
    source: "CMS",
    name: "МГТУ им. Н. Э. Баумана",
    program: "DevOps",
    createdAt: "2026-09-27T14:32:00+03:00",
    time: "Сегодня, 14:32",
    initiator: "Мария Сергеева",
    details: [
      ["Телефон", "+7 999 123-45-67"],
      ["Почта", "m.sergeeva@bmstu.ru"],
      ["Студентов", "120"],
    ],
  },
  {
    id: "itmo-request",
    source: "КАМ",
    name: "Университет ИТМО",
    program: "Облачные технологии",
    createdAt: "2026-09-27T13:10:00+03:00",
    time: "Сегодня, 13:10",
    initiator: "Александр Иванов",
    details: [
      ["Контакт вуза", "Елена Петрова"],
      ["Телефон", "+7 921 555-20-14"],
      ["Почта", "e.petrova@itmo.ru"],
      ["Студентов", "80"],
    ],
  },
  {
    id: "mephi-request",
    source: "CMS",
    name: "НИЯУ МИФИ",
    program: "Информационная безопасность",
    createdAt: "2026-09-27T12:45:00+03:00",
    time: "Сегодня, 12:45",
    initiator: "Анна Кузнецова",
    details: [
      ["Телефон", "+7 916 234-18-52"],
      ["Почта", "a.kuznetsova@mephi.ru"],
    ],
  },
  {
    id: "innopolis-request",
    source: "CMS",
    name: "Университет Иннополис",
    program: "Data Science",
    createdAt: "2026-09-27T11:20:00+03:00",
    time: "Сегодня, 11:20",
    initiator: "Сергей Орлов",
    details: [
      ["Телефон", "+7 917 456-30-21"],
      ["Почта", "s.orlov@innopolis.ru"],
      ["Студентов", "60"],
    ],
  },
  {
    id: "spbstu-request",
    source: "CMS",
    name: "СПбПУ Петра Великого",
    program: "QA",
    createdAt: "2026-09-26T16:40:00+03:00",
    time: "Вчера, 16:40",
    initiator: "Ольга Васильева",
    details: [
      ["Телефон", "+7 921 456-70-22"],
      ["Почта", "o.vasileva@spbstu.ru"],
      ["Студентов", "45"],
    ],
  },
  {
    id: "hse-request",
    source: "КАМ",
    name: "НИУ ВШЭ",
    program: "DevOps",
    createdAt: "2026-09-26T15:15:00+03:00",
    time: "Вчера, 15:15",
    initiator: "Дмитрий Соколов",
    details: [
      ["Контакт вуза", "Наталья Соколова"],
      ["Телефон", "+7 916 678-40-35"],
      ["Почта", "n.sokolova@hse.ru"],
      ["Студентов", "90"],
    ],
  },
  {
    id: "tpu-request",
    source: "CMS",
    name: "Томский политехнический университет",
    program: "Облачные технологии",
    createdAt: "2026-09-26T10:05:00+03:00",
    time: "Вчера, 10:05",
    initiator: "Ирина Михайлова",
    details: [
      ["Телефон", "+7 913 789-12-30"],
      ["Почта", "i.mihailova@tpu.ru"],
    ],
  },
  {
    id: "kpfu-request",
    source: "КАМ",
    name: "Казанский федеральный университет",
    program: "Информационная безопасность",
    createdAt: "2026-09-22T17:25:00+03:00",
    time: "22 сентября, 17:25",
    initiator: "Александр Иванов",
    details: [
      ["Контакт вуза", "Елена Волкова"],
      ["Телефон", "+7 917 123-80-40"],
      ["Почта", "e.volkova@kpfu.ru"],
      ["Студентов", "100"],
    ],
  },
];

const SORTS = {
  newest: "Сначала новые",
  oldest: "Сначала старые",
  kam: "Сначала КАМ",
  cms: "Сначала CMS",
};

export function sortRequests(requests, mode) {
  const stamp = (item) => {
    const value = Date.parse(item.createdAt);
    return Number.isFinite(value) ? value : null;
  };

  return requests
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      if (mode === "kam" || mode === "cms") {
        const source = mode === "kam" ? "КАМ" : "CMS";
        const difference =
          Number(b.item.source === source) -
          Number(a.item.source === source);

        if (difference) return difference;
      }

      const left = stamp(a.item);
      const right = stamp(b.item);

      if (left === null || right === null) {
        if (left === right) return a.index - b.index;
        return left === null ? 1 : -1;
      }

      return (
        (mode === "oldest" ? left - right : right - left) ||
        a.index - b.index
      );
    })
    .map(({ item }) => item);
}

function useChoice(key, fallback, allowed) {
  const [value, setValue] = useState(() => {
    try {
      const saved = sessionStorage.getItem(key);
      return allowed.includes(saved) ? saved : fallback;
    } catch {
      return fallback;
    }
  });

  function update(next) {
    setValue(next);

    try {
      sessionStorage.setItem(key, next);
    } catch {
      // Память вкладки недоступна.
    }
  }

  return [value, update];
}

export function IncomingRequests({
  requests,
  onAccept,
  onReject,
}) {
  const listId = useId();

  const [open, setOpen] = useChoice(
    "at2m:incoming:open",
    "yes",
    ["yes", "no"],
  );

  const [expanded, setExpanded] = useChoice(
    "at2m:incoming:expanded",
    "no",
    ["yes", "no"],
  );

  const [sort, setSort] = useChoice(
    "at2m:incoming:sort",
    "newest",
    Object.keys(SORTS),
  );

  const sorted = sortRequests(requests, sort);
  const visible =
    expanded === "yes" ? sorted : sorted.slice(0, 3);

  return (
    <section className="wm-incoming wx-incoming">
      <div className="wm-incoming-heading">
        <button
          type="button"
          className="wm-incoming-toggle"
          aria-expanded={open === "yes"}
          aria-controls={listId}
          onClick={() => setOpen(open === "yes" ? "no" : "yes")}
        >
          <span
            className={`wu-chevron${
              open === "yes" ? "" : " is-closed"
            }`}
          />
          Входящие запросы
        </button>

        <span className="wu-muted wu-small">
          · {requests.length} новых
        </span>

        <label className="wx-select">
          <span className="wx-sr-only">
            Сортировка входящих запросов
          </span>

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            {Object.entries(SORTS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <span className="wu-chevron" aria-hidden="true" />
        </label>
      </div>

      <div id={listId} hidden={open !== "yes"}>
        <div className="wm-request-list">
          {visible.map((request) => (
            <article
              className="wu-panel wm-request"
              key={request.id}
            >
              <div className="wm-request-title">
                <span className="wm-source">
                  {request.source}
                </span>

                <h4>{request.name}</h4>
                <p>{request.program}</p>

                <small className="wu-muted">
                  {request.time}
                </small>
              </div>

              <div className="wm-initiator">
                <p className="wu-muted wu-small">Инициатор</p>
                <p>{request.initiator}</p>
              </div>

              <dl className="wm-request-details">
                {request.details.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>

              <div className="wm-request-actions">
                <button
                  type="button"
                  className="wu-button"
                  onClick={() => onReject(request)}
                >
                  Отклонить
                </button>

                <button
                  type="button"
                  className="wu-button wu-primary"
                  onClick={() => onAccept(request)}
                >
                  Принять в работу
                </button>
              </div>
            </article>
          ))}

          {!requests.length && (
            <p className="wx-empty">Новых запросов нет.</p>
          )}
        </div>

        {requests.length > 3 && (
          <button
            type="button"
            className="wm-show-more"
            onClick={() =>
              setExpanded(expanded === "yes" ? "no" : "yes")
            }
          >
            {expanded === "yes"
              ? "Скрыть"
              : `Показать ещё ${requests.length - 3}`}
          </button>
        )}
      </div>
    </section>
  );
}

const DEMAND = [
  {
    id: "requests",
    tab: "По заявкам",
    unit: "Количество заявок",
    rows: [
      ["Информационная безопасность", 124],
      ["DevOps", 96],
      ["Облачные технологии", 82],
      ["Data Science", 61],
      ["QA", 49],
    ],
  },
  {
    id: "students",
    tab: "По студентам",
    unit: "Количество студентов",
    rows: [
      ["Облачные технологии", 420],
      ["Информационная безопасность", 312],
      ["DevOps", 256],
      ["QA", 180],
      ["Data Science", 116],
    ],
  },
  {
    id: "streams",
    tab: "По потокам",
    unit: "Количество потоков",
    rows: [
      ["DevOps", 5],
      ["Облачные технологии", 4],
      ["QA", 4],
      ["Информационная безопасность", 3],
      ["Data Science", 2],
    ],
  },
];

const KAM = [
  {
    id: "launches",
    tab: "Запуски",
    unit: "Запуски программ · количество",
    rows: [
      ["Иванов А.А.", 14],
      ["Смирнова М.С.", 11],
      ["Соколов Д.В.", 9],
    ],
  },
  {
    id: "active",
    tab: "В активной работе",
    unit: "Взаимодействия в активной работе",
    rows: [
      ["Соколов Д.В.", 28],
      ["Иванов А.А.", 24],
      ["Смирнова М.С.", 19],
    ],
  },
  {
    id: "overdue",
    tab: "SLA / просрочки",
    unit: "Просрочки · меньше — лучше",
    rows: [
      ["Смирнова М.С.", 1],
      ["Иванов А.А.", 2],
      ["Соколов Д.В.", 4],
    ],
  },
  {
    id: "speed",
    tab: "Скорость прохождения",
    unit: "Медиана прохождения этапа, дни · меньше — лучше",
    rows: [
      ["Соколов Д.В.", 4.8],
      ["Смирнова М.С.", 5.6],
      ["Иванов А.А.", 6.2],
    ],
  },
];

export function WorkspaceChart({
  kind = "demand",
  data,
  appliedFilters = [],
}) {
  const metrics = kind === "kam" ? KAM : DEMAND;

  const title =
    kind === "kam"
      ? "Эффективность и нагрузка КАМов"
      : "Востребованность ИТ-направлений";

  const [metricId, setMetricId] = useChoice(
    `at2m:chart:${kind}:metric`,
    metrics[0].id,
    metrics.map((item) => item.id),
  );

  const [owner, setOwner] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  const saving = useRef(false);
  const menu = useRef(null);

  const metric =
    metrics.find((item) => item.id === metricId) || metrics[0];

  // При передаче data данные макета не подмешиваются.
  const source =
    data === undefined ? metric.rows : data[metric.id] || [];

  const rows = source.filter(
    ([name]) => kind !== "kam" || !owner || name === owner,
  );

  const owners = [
    ...new Set(
      (
        data === undefined
          ? metrics.flatMap((item) => item.rows)
          : Object.values(data).flat()
      ).map(([name]) => name),
    ),
  ];

  const maximum = Math.max(
    1,
    ...rows.map(([, value]) => value),
  );

  const total = rows.reduce(
    (sum, [, value]) => sum + value,
    0,
  );

  const number = (value) => value.toLocaleString("ru-RU");

  async function exportAs(format) {
    if (saving.current || !rows.length) return;

    saving.current = true;
    setBusy(true);
    setNotice("");

    if (menu.current) menu.current.open = false;

    try {
      await downloadChart({
        title,
        metric: metric.unit,
        rows: rows.map((row) => [...row]),
        filters: [
          ...appliedFilters,
          ...(kind === "kam"
            ? [["КАМ", owner || "Все"]]
            : []),
        ],
        format,
      });

      setNotice(
        `Файл ${format.toUpperCase()} подготовлен к скачиванию.`,
      );
    } catch (error) {
      setNotice(
        error.message || "Не удалось подготовить файл.",
      );
    } finally {
      saving.current = false;
      setBusy(false);
    }
  }

  return (
    <section
      className={`wu-panel wx-chart wx-chart--${kind}`}
      aria-busy={busy}
    >
      <div className="wx-chart-head">
        <h3>{title}</h3>

        {kind === "kam" && (
          <label className="wx-select">
            <span className="wx-sr-only">Фильтр по КАМ</span>

            <select
              value={owner}
              onChange={(event) => setOwner(event.target.value)}
            >
              <option value="">КАМ: Все</option>

              {owners.map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>

            <span className="wu-chevron" aria-hidden="true" />
          </label>
        )}

        <details
          ref={menu}
          className="wx-export"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.currentTarget.open = false;
              event.currentTarget
                .querySelector("summary")
                ?.focus();
            }
          }}
        >
          <summary
            title="Скачать график"
            aria-label="Скачать график"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 3v12m-4-4 4 4 4-4M4 15v5h16v-5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </summary>

          <div className="wx-export-menu">
            <button
              type="button"
              disabled={busy || !rows.length}
              onClick={() => exportAs("png")}
            >
              Скачать PNG
            </button>

            <button
              type="button"
              disabled={busy || !rows.length}
              onClick={() => exportAs("pdf")}
            >
              Скачать PDF
            </button>
          </div>
        </details>
      </div>

      <div
        className="wu-tabs wx-chart-tabs"
        aria-label="Метрика графика"
      >
        {metrics.map((item) => (
          <button
            type="button"
            key={item.id}
            className={metric.id === item.id ? "is-active" : ""}
            aria-pressed={metric.id === item.id}
            onClick={() => {
              setMetricId(item.id);
              setNotice("");
            }}
          >
            {item.tab}
          </button>
        ))}
      </div>

      {kind === "kam" && (
        <p className="wu-muted wu-small wx-unit">
          {metric.unit}
        </p>
      )}

      <div className="wx-bars">
        {rows.map(([name, value]) => (
          <div
            className="wx-bar"
            key={name}
            tabIndex={0}
            aria-label={`${name}: ${number(value)}. ${metric.unit}`}
          >
            <span>{name}</span>

            <span className="wx-track">
              <span
                style={{
                  width: `${(value / maximum) * 100}%`,
                }}
              />
            </span>

            <span>{number(value)}</span>

            <span className="wx-tooltip" aria-hidden="true">
              {name} · {number(value)}
              {kind === "demand" && total > 0
                ? ` · ${Math.round(
                    (value / total) * 100,
                  )}% от общего числа`
                : ""}
            </span>
          </div>
        ))}

        {!rows.length && (
          <p className="wx-empty">
            Нет статистических данных за указанный период.
            Измените параметры фильтрации.
          </p>
        )}
      </div>

      <p className="wx-chart-notice" role="status">
        {notice}
      </p>
    </section>
  );
}