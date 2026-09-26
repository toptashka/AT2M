import { useState } from "react";
import { useAppTheme, setAppTheme } from "../../theme";
import Header from "../Header/Header";
import pdfIcon from "../../assets/pdf.svg";
import downloadIcon from "../../assets/download.svg";
import "./WorkRegionUser.css";

const programs = [
  ["Информационная безопасность", 124],
  ["DevOps", 96],
  ["Облачные технологии", 82],
  ["Data Science", 61],
  ["QA", 49],
];

const deadlines = [
  [
    "18 сентября · 16:00",
    "НИЯУ МИФИ",
    "Подписание документов",
    "Просрочено",
  ],
  [
    "Сегодня · 17:00",
    "МГТУ им. Н. Э. Баумана",
    "Передача материалов",
    "Горящий срок",
  ],
  [
    "25 сентября",
    "ИТМО",
    "Обучение преподавателей",
    "Планово",
  ],
];

const interactions = [
  {
    id: "bmstu",
    badge: "МГТУ",
    name: "МГТУ им. Н. Э. Баумана",
    program: "DevOps",
    partner: "Solar",
    city: "Москва",
    initials: "АИ",
    owner: "Александр Иванов",
    updated: "Сегодня, 12:45",
    segments: 8,
  },
  {
    id: "mephi",
    badge: "МИФИ",
    name: "НИЯУ МИФИ",
    program: "Информационная безопасность",
    partner: "Solar",
    city: "Москва",
    initials: "МС",
    owner: "Мария Смирнова",
    updated: "Сегодня, 11:20",
    segments: 6,
  },
  {
    id: "itmo",
    badge: "ИТМО",
    name: "ИТМО",
    program: "Облачные технологии",
    partner: "Облако",
    city: "Санкт-Петербург",
    initials: "ДС",
    owner: "Дмитрий Соколов",
    updated: "Вчера, 17:30",
    segments: 9,
  },
];

const steps = [
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

function Detail({ manager, onAction }) {
  return (
    <div className="wu-detail">
      <aside className="wu-workflow">
        <h3>Этапы взаимодействия</h3>

        <p className="wu-muted wu-small">
          Текущий этап: 08
        </p>

        <ol className="wu-steps">
          {steps.map((step, index) => (
            <li
              key={step}
              className={
                index < 7
                  ? "is-done"
                  : index === 7
                    ? "is-current"
                    : ""
              }
            >
              <span className="wu-step-dot">
                {index < 7 ? "✓" : ""}
              </span>

              <div>
                <p>
                  {String(index + 1).padStart(2, "0")}. {step}
                </p>

                {index < 7 && (
                  <small>
                    Завершено{" "}
                    {String(index + 2).padStart(2, "0")}.09.2026
                  </small>
                )}

                {index === 7 && (
                  <small>
                    Текущий этап
                    <br />
                    До 20 сентября
                  </small>
                )}
              </div>
            </li>
          ))}
        </ol>
      </aside>

      <div className="wu-detail-main">
        <section className="wu-stage">
          <div className="wu-stage-top">
            <span className="wu-muted wu-small">
              Этап 08
            </span>

            <span className="wu-status">
              ● В работе
            </span>
          </div>

          <h2>Сопровождение внедрения</h2>

          <p className="wu-muted wu-stage-deadline">
            до 20 сентября 2026
          </p>

          {manager ? (
            <label className="wu-owner-field">
              <span className="wu-muted wu-small">
                Ответственный КАМ
              </span>

              <select
                defaultValue="Александр Иванов"
                onChange={(event) =>
                  onAction?.("change-owner", {
                    id: "bmstu",
                    owner: event.target.value,
                  })
                }
              >
                {interactions.map(({ owner }) => (
                  <option key={owner} value={owner}>
                    {owner}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <p className="wu-responsible">
              Ответственный — Александр Иванов
            </p>
          )}

          <dl className="wu-meta">
            {[
              ["Начало", "12 сентября 2026"],
              ["Срок", "20 сентября 2026"],
              ["Последнее изменение", "Сегодня, 12:45"],
            ].map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="wu-contact wu-box">
          <h3>Контакты вуза</h3>

          <p>
            {manager ? "Мария Сергеева" : "М*** С***"}
          </p>

          <dl>
            <div>
              <dt>Телефон</dt>
              <dd>
                {manager
                  ? "+7 999 123-45-41"
                  : "+7 *** ***-**-41"}
              </dd>
            </div>

            <div>
              <dt>Почта</dt>
              <dd>
                {manager
                  ? "m.sergeeva@bmstu.ru"
                  : "m***@bmstu.ru"}
              </dd>
            </div>
          </dl>
        </section>

        <section className="wu-conditions wu-box">
          <h3>Условия завершения</h3>
          <p>✓ Получены необходимые материалы</p>
          <p>✓ Прикреплён обязательный документ</p>
          <p>○ Подтверждено целевое действие</p>
        </section>

        <section className="wu-comments">
          <h3>Комментарии</h3>

          <div className="wu-comment">
            <span className="wr-avatar">АИ</span>

            <div>
              <p>
                Александр Иванов
                <small className="wu-muted">
                  Сегодня, 12:45
                </small>
              </p>

              <p>
                Получены технические материалы от вуза. Необходимо
                подтвердить дату начала внедрения.
              </p>
            </div>
          </div>
        </section>

        <section className="wu-files">
          <h3>Файлы</h3>

          <div className="wu-file wu-box">
            <img
              src={pdfIcon}
              alt=""
              width="15"
              height="23"
            />

            <div>
              <p>Документация_внедрения.pdf</p>
              <small className="wu-muted">
                PDF • 2,4 МБ • сегодня, 11:20
              </small>
            </div>

            <button
              type="button"
              className="wu-download"
              aria-label="Скачать Документация_внедрения.pdf"
              onClick={() => onAction?.("download", "bmstu")}
            >
              <img src={downloadIcon} alt="" />
            </button>
          </div>
        </section>

        <p className="wu-completion-note wu-muted wu-small">
          Выполните все обязательные условия этапа
        </p>

        <div className="wu-detail-actions">
          <button
            type="button"
            className="wu-button"
            onClick={() => onAction?.("comment", "bmstu")}
          >
            + Комментарий
          </button>

          <button
            type="button"
            className="wu-button"
            onClick={() => onAction?.("file", "bmstu")}
          >
            + Файл
          </button>

          <button
            type="button"
            className="wu-button wu-primary"
            disabled
          >
            Завершить этап
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WorkRegionUser({
  manager = false,
  children,
  onAction,
}) {
  const { theme } = useAppTheme();

  const [profileOpen, setProfileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(true);
  const [deadlineTab, setDeadlineTab] = useState("Все");

  function changeTheme(value) {
    const dark =
      typeof value === "function"
        ? value(theme === "dark")
        : value;

    setAppTheme(dark ? "dark" : "light");
  }

  const filtered = interactions.filter((item) =>
    [
      item.name,
      item.program,
      item.partner,
      item.city,
      item.owner,
    ]
      .join(" ")
      .toLocaleLowerCase("ru")
      .includes(search.trim().toLocaleLowerCase("ru")),
  );

  const visibleDeadlines = deadlines.filter(
    (item) =>
      deadlineTab === "Все" ||
      item[3] ===
        {
          Просрочено: "Просрочено",
          Горящие: "Горящий срок",
          Плановые: "Планово",
        }[deadlineTab],
  );

  return (
    <div
      className={`work-region wu${manager ? " wu-manager" : ""}`}
      data-theme={theme}
    >
      <Header
        activePage="Главная"
        profileOpen={profileOpen}
        setProfileOpen={setProfileOpen}
        dark={theme === "dark"}
        setDark={changeTheme}
      />

      <main className="wu-page">
        <div className="wu-heading">
          <h1>Рабочая область</h1>

          <p className="wu-muted">
            Контроль взаимодействий и текущих этапов работы
          </p>
        </div>

        <div className="wu-top-actions">
          <button
            type="button"
            className="wu-button"
            onClick={() => onAction?.("site-request")}
          >
            Получить заявку с сайта
          </button>

          <button
            type="button"
            className="wu-button"
            onClick={() => onAction?.("sync-lms")}
          >
            Синхронизировать с LMS
          </button>
        </div>

        <div className="wu-toolbar">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Найти учреждение, программу или ИТ-продукт..."
            aria-label="Поиск взаимодействий"
          />

          {[
            "ИТ-программа",
            "ИТ-продукт",
            "Статус",
            "Ответственный КАМ",
            "Ещё фильтры",
          ].map((label) => (
            <button
              type="button"
              className="wu-button wu-filter"
              key={label}
              onClick={() => onAction?.("filter", label)}
            >
              {label}
              <span className="wu-chevron" />
            </button>
          ))}
        </div>

        <div className="wu-tabs wu-main-tabs">
          <button
            type="button"
            className="is-active"
            aria-pressed="true"
          >
            Процессы
          </button>

          <button
            type="button"
            onClick={() => onAction?.("learning-products")}
          >
            Обучение и продукты
          </button>
        </div>

        <div className="wu-stats">
          {[
            ["В работе", 24, "взаимодействия", ""],
            [
              "Требуют внимания",
              6,
              "взаимодействий",
              "attention",
            ],
            ["Просрочено", 2, "взаимодействия", "overdue"],
            ["Завершено за месяц", 8, "взаимодействий", ""],
          ].map(([title, count, label, status]) => (
            <section
              className="wu-panel wu-stat"
              key={title}
            >
              <p className="wu-muted">{title}</p>

              <div>
                <strong className={status}>{count}</strong>
                <small className="wu-muted">{label}</small>
              </div>
            </section>
          ))}
        </div>

        <div className="wu-dashboard">
          <section className="wu-panel wu-demand">
            <div className="wu-panel-head">
              <h3>Востребованность ИТ-программ</h3>

              <div className="wu-tabs">
                {[
                  "По заявкам",
                  "По студентам",
                  "По потокам",
                ].map((label, index) => (
                  <button
                    type="button"
                    key={label}
                    className={index === 0 ? "is-active" : ""}
                    aria-pressed={index === 0}
                    onClick={() => {
                      if (index > 0) {
                        onAction?.("demand", label);
                      }
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="wu-bars">
              {programs.map(([label, count]) => (
                <div className="wu-bar-row" key={label}>
                  <span>{label}</span>

                  <div className="wu-track">
                    <span
                      style={{
                        width: `${(count / 124) * 100}%`,
                      }}
                    />
                  </div>

                  <span>{count}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="wu-panel wu-deadlines">
            <div className="wu-panel-head">
              <h3>Ближайшие сроки</h3>

              <button
                type="button"
                className="wu-link"
                onClick={() => onAction?.("deadlines")}
              >
                Все →
              </button>
            </div>

            <div className="wu-tabs">
              {[
                "Все",
                "Просрочено",
                "Горящие",
                "Плановые",
              ].map((label) => (
                <button
                  type="button"
                  key={label}
                  className={
                    deadlineTab === label ? "is-active" : ""
                  }
                  aria-pressed={deadlineTab === label}
                  onClick={() => setDeadlineTab(label)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="wu-deadline-list">
              {visibleDeadlines.map(
                ([date, name, stage, status]) => (
                  <div className="wu-deadline" key={name}>
                    <p className="wu-muted">{date}</p>
                    <p>{name}</p>
                    <p className="wu-muted">{stage}</p>

                    <span
                      className="wu-deadline-status"
                      data-status={status}
                    >
                      {status}
                    </span>
                  </div>
                ),
              )}
            </div>
          </section>
        </div>

        {children}

        <div className="wu-list-heading">
          <h2>Взаимодействия</h2>

          <span className="wu-muted wu-small">
            24 записи
          </span>

          <button
            type="button"
            className="wu-button"
            onClick={() => onAction?.("create-partnership")}
          >
            + Создать партнёрство
          </button>
        </div>

        <div className="wu-interactions">
          {filtered.map((item) => {
            const open = item.id === "bmstu" && expanded;

            return (
              <article
                className={`wu-card${open ? " is-expanded" : ""}`}
                key={item.id}
              >
                <button
                  type="button"
                  className="wu-summary"
                  aria-expanded={open}
                  onClick={() => {
                    if (item.id === "bmstu") {
                      setExpanded((value) => !value);
                    } else {
                      onAction?.("open-interaction", item.id);
                    }
                  }}
                >
                  <span className="wu-organisation">
                    <span className="wu-badge">
                      {item.badge}
                    </span>

                    <span>
                      <strong>{item.name}</strong>
                      <span>{item.program}</span>

                      <small className="wu-muted">
                        {item.partner} • {item.city}
                      </small>
                    </span>
                  </span>

                  <span className="wu-progress">
                    <span
                      className="wu-segments"
                      aria-hidden="true"
                    >
                      {Array.from(
                        { length: 14 },
                        (_, index) => (
                          <i
                            key={index}
                            className={
                              index < item.segments - 1
                                ? "is-done"
                                : index === item.segments - 1
                                  ? "is-current"
                                  : ""
                            }
                          />
                        ),
                      )}
                    </span>

                    <small className="wu-muted">
                      Текущий этап: 08
                    </small>

                    <span>
                      Сопровождение внедрения
                    </span>
                  </span>

                  <span className="wu-summary-owner">
                    <small className="wu-muted">
                      Ответственный
                    </small>

                    <span>
                      <span className="wr-avatar">
                        {item.initials}
                      </span>
                      {item.owner}
                    </span>

                    <small className="wu-muted">
                      {item.updated}
                    </small>
                  </span>

                  <span
                    className={`wu-chevron${open ? " is-up" : ""}`}
                  />
                </button>

                {open && (
                  <Detail
                    manager={manager}
                    onAction={onAction}
                  />
                )}
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}