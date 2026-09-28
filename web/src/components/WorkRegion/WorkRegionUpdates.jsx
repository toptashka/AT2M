import { useRef, useState } from "react";
import {
  Empty,
  Select,
  Tabs,
  usePreference,
} from "./WorkspaceUI";
import {
  filterLabels,
  OWNERS,
  selection,
  includesSelection,
  listText,
} from "./workspaceModel";
import { downloadChart } from "./chartExport";
import downloadIcon from "../../assets/download.svg";

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

const SORTS = [
  { value: "newest", label: "Сначала новые" },
  { value: "oldest", label: "Сначала старые" },
  { value: "kam", label: "Сначала КАМ" },
  { value: "cms", label: "Сначала CMS" },
];

export function sortRequests(requests, mode) {
  return requests
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      if (mode === "kam" || mode === "cms") {
        const source = mode === "kam" ? "КАМ" : "CMS";

        const group =
          Number(b.item.source === source) -
          Number(a.item.source === source);

        if (group) return group;
      }

      const left = Date.parse(a.item.createdAt);
      const right = Date.parse(b.item.createdAt);

      if (!Number.isFinite(left) || !Number.isFinite(right)) {
        return a.index - b.index;
      }

      return (
        (mode === "oldest" ? left - right : right - left) ||
        a.index - b.index
      );
    })
    .map((entry) => entry.item);
}

export function IncomingRequests({
  requests,
  onAccept,
  onReject,
}) {
  const [sort, setSort] = usePreference(
    "workspace:incoming-sort",
    "newest"
  );

  const [all, setAll] = useState(false);
  const sorted = sortRequests(requests, sort);

  return (
    <section className="aw-incoming">
      <div className="aw-section-title">
        <h2>Входящие запросы</h2>

        {requests.length > 0 && (
          <span className="at-muted">
            · {requests.length} новых
          </span>
        )}

        <Select
          label="Сортировка"
          value={sort}
          options={SORTS}
          onChange={setSort}
        />
      </div>

      {!requests.length ? (
        <Empty title="Входящих запросов пока нет" />
      ) : (
        <div className="aw-requests">
          {(all ? sorted : sorted.slice(0, 3)).map((request) => (
            <article
              className="aw-panel aw-request"
              key={request.id}
            >
              <div>
                <span className="aw-source">
                  {request.source}
                </span>

                <h3>{request.name}</h3>
                <p>{request.program}</p>

                <small className="at-muted">
                  {request.time}
                </small>
              </div>

              <div>
                <small className="at-muted">Инициатор</small>
                <p>{request.initiator}</p>
              </div>

              <dl>
                {request.details.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>

              <div className="aw-request-actions">
                <button
                  type="button"
                  className="at-button"
                  onClick={() => onReject(request)}
                >
                  Отклонить
                </button>

                <button
                  type="button"
                  className="at-button primary"
                  onClick={() => onAccept(request)}
                >
                  Принять в работу
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {requests.length > 3 && (
        <button
          type="button"
          className="aw-show-more"
          onClick={() => setAll(!all)}
        >
          {all
            ? "Скрыть"
            : "Показать ещё " + (requests.length - 3)}
        </button>
      )}
    </section>
  );
}

export function WorkspaceChart({
  kind = "demand",
  filters,
  manager = true,
  empty = false,
  notify,
}) {
  const metrics = kind === "kam" ? KAM : DEMAND;

  const [metricId, setMetricId] = usePreference(
    "workspace:metric:" + kind,
    metrics[0].id
  );

  const [owner, setOwner] = usePreference(
    "workspace:local-owner",
    ""
  );

  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const menu = useRef(null);

  const metric =
    metrics.find((item) => item.id === metricId) || metrics[0];

  const title =
    kind === "demand"
      ? "Востребованность ИТ-программ"
      : manager
        ? "Эффективность и нагрузка КАМов"
        : "Моя эффективность";

  const unsupported =
    filters.search ||
    selection(filters.status).length ||
    selection(filters.institution).length ||
    selection(filters.city).length ||
    filters.changed ||
    selection(filters.products).length ||
    (filters.start &&
      (filters.start > "2026-09-01" ||
        filters.end < "2026-09-30")) ||
    (kind === "kam" && selection(filters.direction).length) ||
    (kind === "demand" && selection(filters.owner).length);

  const names = [
    "Иванов А.А.",
    "Смирнова М.С.",
    "Соколов Д.В.",
  ];

  const rows =
    empty || unsupported
      ? []
      : metric.rows.filter(([name]) => {
          if (kind === "demand") {
            return includesSelection(filters.direction, name);
          }

          return (
            (!selection(filters.owner).length ||
              selection(filters.owner).some(
                (value) =>
                  name === names[OWNERS.indexOf(value)]
              )) &&
            includesSelection(owner, name) &&
            (manager || name === names[0])
          );
        });

  const maximum = Math.max(
    1,
    ...metric.rows.map(([, value]) => value)
  );

  async function save(format) {
    if (lock.current) return;

    lock.current = true;
    setBusy(true);
    menu.current.removeAttribute("open");

    try {
      await downloadChart({
        title,
        metric: metric.unit,
        rows: rows.map((row) => [...row]),
        format,
        filters: [
          ...filterLabels(filters),
          ["Метрика", metric.unit],
          ...(kind === "kam"
            ? [
                [
                  "КАМ графика",
                  listText(owner) ||
                    (manager ? "Все" : names[0]),
                ],
              ]
            : []),
        ],
      });

      notify(
        "Файл " +
          format.toUpperCase() +
          " подготовлен к скачиванию."
      );
    } catch (error) {
      notify(
        error.message || "Не удалось скачать график.",
        true
      );
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }

  return (
    <section className={"aw-panel aw-chart aw-chart-" + kind}>
      <div className="aw-chart-head">
        <h3>{title}</h3>

        {kind === "demand" && (
          <Tabs
            value={metric.id}
            options={metrics.map((item) => [
              item.id,
              item.tab,
            ])}
            onChange={setMetricId}
          />
        )}

        {kind === "kam" && manager && (
          <Select
            multiple
            allMeansEmpty
            label="КАМ: Все"
            allLabel="Все ответственные"
            searchPlaceholder="Поиск сотрудников"
            value={selection(owner)}
            options={names}
            onChange={setOwner}
          />
        )}

        <details className="at-select aw-export" ref={menu}>
          <summary
            aria-label="Скачать график"
            title="Скачать график"
          >
            <img
              src={downloadIcon}
              width="18"
              height="18"
              alt=""
            />
          </summary>

          <div className="at-options">
            {["png", "pdf"].map((format) => (
              <button
                type="button"
                key={format}
                disabled={busy || !rows.length}
                onClick={() => save(format)}
              >
                Скачать {format.toUpperCase()}
              </button>
            ))}
          </div>
        </details>
      </div>

      {kind === "kam" && (
        <>
          <Tabs
            value={metric.id}
            options={metrics.map((item) => [
              item.id,
              item.tab,
            ])}
            onChange={setMetricId}
          />

          <small className="at-muted aw-unit">
            {metric.unit}
          </small>
        </>
      )}

      {!rows.length ? (
        <Empty
          title={
            empty
              ? kind === "kam"
                ? "Нет данных по эффективности КАМов"
                : "Данных пока нет"
              : "Нет статистических данных для выбранных фильтров"
          }
        >
          {empty
            ? "Статистика появится после загрузки или синхронизации данных."
            : "В демонстрационном наборе нет детализации для этого сочетания."}
        </Empty>
      ) : (
        <div className="aw-bars">
          {rows.map(([name, value]) => (
            <div className="aw-bar" key={name} tabIndex={kind === "kam" ? 0 : undefined}>
              <span>{name}</span>

              <span className="aw-track">
                <i
                  style={{
                    width: (value / maximum) * 100 + "%",
                  }}
                />
              </span>

              <strong>{value.toLocaleString("ru-RU")}</strong>

              {kind === "kam" && (
                <span className="aw-tooltip">
                  {name}
                  <br />
                  {metric.unit}: {value.toLocaleString("ru-RU")}
                </span>
              )}
            </div>
          ))}
        </div>
      )}


    </section>
  );
}