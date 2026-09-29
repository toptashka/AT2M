import { useRef, useState } from "react";
import {
  Empty,
  Select,
  Tabs,
  usePreference,
} from "./WorkspaceUI";
import { ProductFilter } from "./WorkspaceFilters";
import {
  filterLabels,
  OWNERS,
  selection,
  includesSelection,
  listText,
} from "./workspaceModel";
import { downloadChart } from "./chartExport";
import downloadIcon from "../../assets/download.svg";

export const INCOMING_DEMO = [];

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

const KAM_TABS = [
  { id: "launches", tab: "Запуски", unit: "Запуски программ · количество" },
  { id: "active", tab: "В активной работе", unit: "Взаимодействия в активной работе" },
  { id: "overdue", tab: "SLA / просрочки", unit: "Просрочки · меньше — лучше" },
  { id: "speed", tab: "Скорость прохождения", unit: "Медиана прохождения этапа, дни · меньше — лучше" },
];

const SORTS = [
  { value: "newest", label: "Сначала новые" },
  { value: "oldest", label: "Сначала старые" },
  { value: "kam", label: "Сначала КАМ" },
  { value: "cms", label: "Сначала CMS" },
];

export function sortRequests(requests, mode) {
  return (requests || [])
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
  interactions = [],
}) {
  const metrics = kind === "kam" ? KAM_TABS : DEMAND;

  const [metricId, setMetricId] = usePreference(
    "workspace:metric:" + kind,
    metrics[0].id
  );

  const [owner, setOwner] = usePreference(
    "workspace:local-owner",
    ""
  );

  const [products, setProducts] = usePreference(
    "workspace:local-products:" + kind,
    []
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
    selection(products).length ||
    (filters.start &&
      (filters.start > "2026-09-01" ||
        filters.end < "2026-09-30")) ||
    (kind === "kam" && selection(filters.direction).length) ||
    (kind === "demand" && selection(filters.owner).length);

  // Динамический список ответственных КАМов только из реальных данных
  const kamOptions = [
    ...new Set((interactions || []).map((item) => item.owner).filter(Boolean)),
  ];

  let rows = [];

  if (kind === "demand") {
    rows = (empty || unsupported)
      ? []
      : metric.rows.filter(([name]) => includesSelection(filters.direction, name));
  } else {
    if (empty || unsupported || !kamOptions.length) {
      rows = [];
    } else {
      rows = kamOptions
        .map((kamName) => {
          const list = (interactions || []).filter((item) => item.owner === kamName);
          let value = 0;
          if (metric.id === "launches") {
            value = list.filter((item) => item.stage >= 11 || item.done).length;
          } else if (metric.id === "active") {
            value = list.filter((item) => !item.done).length;
          } else if (metric.id === "overdue") {
            value = list.filter((item) => item.status === "Просрочено").length;
          } else {
            value = list.length;
          }
          return [kamName, value];
        })
        .filter(([kamName]) => {
          return (
            (!selection(filters.owner).length || includesSelection(filters.owner, kamName)) &&
            includesSelection(owner, kamName) &&
            (manager || kamName === kamOptions[0])
          );
        });
    }
  }

  const maximum = Math.max(
    1,
    ...rows.map(([, value]) => value)
  );

  const total = rows.reduce(
    (sum, [, value]) => sum + value,
    0
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
          [
            "Локальные продукты",
            listText(products) || "Все продукты",
          ],
          ...(kind === "kam"
            ? [
                [
                  "КАМ графика",
                  listText(owner) ||
                    (manager ? "Все" : kamOptions[0] || "—"),
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
            options={kamOptions}
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
            empty || (kind === "kam" && !kamOptions.length)
              ? kind === "kam"
                ? "Нет данных по эффективности КАМов"
                : "Данных пока нет"
              : "Нет статистических данных для выбранных фильтров"
          }
        >
          {empty || (kind === "kam" && !kamOptions.length)
            ? "Статистика появится после загрузки или синхронизации данных."
            : "В наборе нет данных для выбранных параметров фильтрации."}
        </Empty>
      ) : (
        <div className="aw-bars">
          {rows.map(([name, value]) => (
            <div className="aw-bar" key={name} tabIndex={0}>
              <span>{name}</span>

              <span className="aw-track">
                <i
                  style={{
                    width: (value / maximum) * 100 + "%",
                  }}
                />
              </span>

              <strong>{value.toLocaleString("ru-RU")}</strong>

              <span className="aw-tooltip">
                {name}
                <br />
                {metric.unit}: {value.toLocaleString("ru-RU")}

                {kind === "demand" && (
                  <>
                    <br />
                    {Math.round((value / total) * 100)}% от общего
                    числа
                  </>
                )}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="aw-chart-products">
        <ProductFilter
          value={products}
          onChange={setProducts}
        />
      </div>
    </section>
  );
}