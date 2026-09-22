import { useState, useEffect, useRef } from "react";
import "./WorkRegion.css";


function LogoMark() {
  return (
    <svg className="wr-logo-mark" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 2l14 8-14 8V2z" fill="var(--wr-purple)" />
      <path d="M5 10h14l-14 8V10z" fill="var(--wr-orange)" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 9a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M9.5 17a2.5 2.5 0 0 0 5 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4.5 20c1.3-4 4.2-6 7.5-6s6.2 2 7.5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 3v2.2M12 18.8V21M21 12h-2.2M5.2 12H3M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6M18.4 18.4l-1.6-1.6M7.2 7.2 5.6 5.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" fill="currentColor" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 2v2.2M12 19.8V22M22 12h-2.2M4.2 12H2M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6M18.4 18.4l-1.6-1.6M7.2 7.2 5.6 5.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M13 8l4 4-4 4M17 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="wr-search-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20l-3.2-3.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg className="wr-filter-chevron" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg className="wr-card-chevron" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12l5 5 9-10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PdfIcon() {
  return (
    <svg className="wr-file-icon" viewBox="0 0 24 26" fill="none" aria-hidden="true">
      <path
        d="M4 1h11l5 5v18a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M15 1v5h5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 4v11m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 19h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Fixture data — everything here is fictional, inline in the file.   */
/* ------------------------------------------------------------------ */

const FILTERS = ["Учреждение", "ИТ-программа", "ИТ-продукт", "Статус", "Ещё фильтры"];

const TOTAL_RECORDS = 24;

const STEP_TITLES = [
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

function pad(n) {
  return String(n).padStart(2, "0");
}

function buildWorkflow(currentStep, doneDates, currentExtra) {
  return STEP_TITLES.map((title, i) => {
    const step = i + 1;
    if (step < currentStep) {
      return {
        title: `${pad(step)}. ${title}`,
        status: "done",
        date: `Завершено ${doneDates[i]}`,
      };
    }
    if (step === currentStep) {
      return {
        title: `${pad(step)}. ${title}`,
        status: "current",
        date: "Текущий этап",
        extra: currentExtra,
      };
    }
    return {
      title: `${pad(step)}. ${title}`,
      status: "pending",
    };
  });
}

const INTERACTIONS = [
  {
    id: "mgtu",
    shortName: "МГТУ",
    name: "МГТУ им. Н. Э. Баумана",
    program: "DevOps",
    partner: "Solar",
    city: "Москва",
    contractNumber: "142/26",
    licenseUntil: "31.08.2027",
    currentStep: 8,
    totalSteps: STEP_TITLES.length,
    stageTitle: "Сопровождение внедрения",
    stageDeadline: "до 20 сентября 2026",
    status: "В работе",
    responsible: { initials: "АИ", name: "Александр Иванов" },
    startedAt: "12 сентября 2026",
    dueAt: "20 сентября 2026",
    updatedAt: "Сегодня, 12:45",
    comments: [
      {
        initials: "АИ",
        author: "Александр Иванов",
        timestamp: "Сегодня, 12:45",
        text: "Получены технические материалы от вуза. Необходимо подтвердить дату начала внедрения.",
      },
    ],
    files: [
      { name: "Документация_внедрения.pdf", type: "PDF", size: "2.4 МБ", uploadedAt: "сегодня, 11:20" },
    ],
    workflow: buildWorkflow(
      8,
      ["02.09.2026", "03.09.2026", "04.09.2026", "05.09.2026", "06.09.2026", "07.09.2026", "08.09.2026"],
      "До 20 сентября",
    ),
  },
  {
    id: "mifi",
    shortName: "МИФИ",
    name: "НИЯУ МИФИ",
    program: "Информационная безопасность",
    partner: "Solar",
    city: "Москва",
    contractNumber: "158/26",
    licenseUntil: "30.06.2027",
    currentStep: 8,
    totalSteps: STEP_TITLES.length,
    stageTitle: "Сопровождение внедрения",
    stageDeadline: "до 25 сентября 2026",
    status: "В работе",
    responsible: { initials: "МС", name: "Мария Смирнова" },
    startedAt: "9 сентября 2026",
    dueAt: "25 сентября 2026",
    updatedAt: "Сегодня, 11:20",
    comments: [
      {
        initials: "МС",
        author: "Мария Смирнова",
        timestamp: "Сегодня, 11:20",
        text: "Согласовали список преподавателей для обучения, ждём подтверждения расписания от вуза.",
      },
    ],
    files: [
      { name: "Договор_МИФИ_158.pdf", type: "PDF", size: "1.1 МБ", uploadedAt: "вчера, 09:40" },
    ],
    workflow: buildWorkflow(
      8,
      ["30.08.2026", "01.09.2026", "02.09.2026", "03.09.2026", "04.09.2026", "05.09.2026", "07.09.2026"],
      "До 25 сентября",
    ),
  },
  {
    id: "itmo",
    shortName: "ИТМО",
    name: "ИТМО",
    program: "Облачные технологии",
    partner: "Облако",
    city: "Санкт-Петербург",
    contractNumber: "171/26",
    licenseUntil: "15.09.2027",
    currentStep: 8,
    totalSteps: STEP_TITLES.length,
    stageTitle: "Сопровождение внедрения",
    stageDeadline: "до 27 сентября 2026",
    status: "В работе",
    responsible: { initials: "ДС", name: "Дмитрий Соколов" },
    startedAt: "10 сентября 2026",
    dueAt: "27 сентября 2026",
    updatedAt: "Вчера, 17:30",
    comments: [
      {
        initials: "ДС",
        author: "Дмитрий Соколов",
        timestamp: "Вчера, 17:30",
        text: "Материалы переданы вузу, назначили ответственного за сопровождение на стороне ИТМО.",
      },
    ],
    files: [
      { name: "Лицензия_ИТМО.pdf", type: "PDF", size: "0.8 МБ", uploadedAt: "вчера, 17:10" },
    ],
    workflow: buildWorkflow(
      8,
      ["28.08.2026", "29.08.2026", "31.08.2026", "01.09.2026", "02.09.2026", "04.09.2026", "05.09.2026"],
      "До 27 сентября",
    ),
  },
];

/* ------------------------------------------------------------------ */
/* Dashboard fixture data — "Рабочая область" block above the list.   */
/* ------------------------------------------------------------------ */

const NAV_LINKS = ["Главная", "Отчёты", "Календарь", "FAQ", "Администрирование"];

const DASH_FILTERS = ["Учреждение", "программа", "ИТ-продукт", "Статус", "Ответственный КАМ", "Город"];

const STAT_CARDS = [
  { label: "В работе", value: 24, tone: "default" },
  { label: "Требуют внимания", value: 6, tone: "warn" },
  { label: "Просрочено", value: 2, tone: "danger" },
  { label: "Завершено за месяц", value: 8, tone: "default" },
];

const DEMAND_DATA = [
  { name: "Информационная безопасность", value: 124 },
  { name: "DevOps", value: 96 },
  { name: "Облачные технологии", value: 82 },
  { name: "Data Science", value: 61 },
  { name: "QA", value: 49 },
];

const DEADLINES = [
  { time: "18 сентября · 16:00", org: "НИЯУ МИФИ", desc: "Подписание документов", status: "overdue" },
  { time: "Сегодня · 17:00", org: "МГТУ им. Н. Э. Баумана", desc: "Передача материалов", status: "hot" },
  { time: "25 сентября", org: "ИТМО", desc: "Обучение преподавателей", status: "planned" },
];

const STATUS_LABEL = { overdue: "Просрочено", hot: "Горящий срок", planned: "Планово" };

const KAM_DATA = [
  { name: "Иванов А.А.", value: 14 },
  { name: "Смирнова М.С.", value: 11 },
  { name: "Соколов Д.В.", value: 9 },
];

/* ------------------------------------------------------------------ */

function Header({ profileOpen, setProfileOpen, dark, setDark }) {
  const profileRef = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [setProfileOpen]);

  return (
    <header className="wr-header">
      <div className="wr-header-inner">
        <div className="wr-logo">
          <LogoMark />
          <span>ИТ Школа</span>
        </div>

        <nav className="wr-nav" aria-label="Основная навигация">
          {NAV_LINKS.map((link, i) => (
            <a key={link} href="#" className={i === 0 ? "is-active" : ""}>
              {link}
            </a>
          ))}
        </nav>

        <div className="wr-header-actions">
          <button type="button" className="wr-icon-btn" aria-label="Уведомления">
            <BellIcon />
          </button>

          <div className="wr-profile" ref={profileRef}>
            <button
              type="button"
              className="wr-avatar-btn"
              onClick={() => setProfileOpen((open) => !open)}
              aria-expanded={profileOpen}
              aria-haspopup="true"
            >
              <span className="wr-avatar">АИ</span>
            </button>

            {profileOpen && <ProfileMenu dark={dark} setDark={setDark} />}
          </div>
        </div>
      </div>
    </header>
  );
}

function ProfileMenu({ dark, setDark }) {
  return (
    <div className={`wr-profile-menu ${dark ? "is-dark" : ""}`} role="menu">
      <div className="wr-profile-menu-head">
        <span className="wr-avatar">АИ</span>
        <div className="wr-profile-id">
          <p className="wr-profile-name">Алексей Иванов</p>
          <p className="wr-profile-email">alex.ivanov@mail.ru</p>
        </div>
      </div>

      <button type="button" className="wr-profile-item" role="menuitem">
        <UserIcon /> Профиль
      </button>
      <button type="button" className="wr-profile-item" role="menuitem">
        <GearIcon /> Настройки
      </button>
      <button type="button" className="wr-profile-item" role="menuitem" onClick={() => setDark((d) => !d)}>
        {dark ? <SunIcon /> : <MoonIcon />} {dark ? "Светлая тема" : "Тёмная тема"}
      </button>
      <button type="button" className="wr-profile-item wr-profile-item--danger" role="menuitem">
        <LogoutIcon /> Выйти
      </button>
    </div>
  );
}

function DashboardHead({ audience, setAudience }) {
  return (
    <div className="wr-dash-head">
      <div>
        <h1 className="wr-title">Рабочая область</h1>
        <p className="wr-subtitle">Контроль взаимодействий и текущих этапов работы</p>
      </div>

      <div className="wr-audience-toggle" role="tablist" aria-label="Сегмент">
        <button type="button" className={audience === "b2b" ? "is-active" : ""} onClick={() => setAudience("b2b")}>
          B2B
        </button>
        <button type="button" className={audience === "b2c" ? "is-active" : ""} onClick={() => setAudience("b2c")}>
          B2C
        </button>
      </div>
    </div>
  );
}

function DashboardToolbar({ search, setSearch }) {
  return (
    <div className="wr-toolbar">
      <label className="wr-search">
        <SearchIcon />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Найти учреждение, программу или ИТ-продукт..."
          aria-label="Найти учреждение, программу или ИТ-продукт"
        />
      </label>

      {DASH_FILTERS.map((filter) => (
        <button key={filter} type="button" className="wr-filter-btn">
          {filter}
          <ChevronDownIcon />
        </button>
      ))}
    </div>
  );
}

function DashboardTabs({ tab, setTab }) {
  return (
    <div className="wr-section-tabs">
      <button type="button" className={tab === "processes" ? "is-active" : ""} onClick={() => setTab("processes")}>
        Процессы
      </button>
      <button type="button" className={tab === "learning" ? "is-active" : ""} onClick={() => setTab("learning")}>
        Обучение и продукты
      </button>
    </div>
  );
}

function StatCards() {
  return (
    <div className="wr-stat-grid">
      {STAT_CARDS.map((card) => (
        <div className="wr-stat-card" key={card.label}>
          <p className="wr-stat-label">{card.label}</p>
          <p className={`wr-stat-value wr-stat-value--${card.tone}`}>
            {card.value} <span className="wr-stat-unit">взаимодействия</span>
          </p>
        </div>
      ))}
    </div>
  );
}

function BarList({ items, maxValue }) {
  const max = maxValue ?? Math.max(...items.map((i) => i.value));
  return (
    <div className="wr-bar-list">
      {items.map((item) => (
        <div className="wr-bar-row" key={item.name}>
          <span className="wr-bar-name">{item.name}</span>
          <div className="wr-bar-track">
            <div className="wr-bar-fill" style={{ width: `${(item.value / max) * 100}%` }} />
          </div>
          <span className="wr-bar-value">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

function DemandPanel({ tab, setTab }) {
  return (
    <div className="wr-panel">
      <div className="wr-panel-head">
        <h3>Востребованность ИТ-программ</h3>
        <div className="wr-tabs wr-tabs--pill">
          <button type="button" className={tab === "requests" ? "is-active" : ""} onClick={() => setTab("requests")}>
            По заявкам
          </button>
          <button type="button" className={tab === "students" ? "is-active" : ""} onClick={() => setTab("students")}>
            По студентам
          </button>
          <button type="button" className={tab === "flows" ? "is-active" : ""} onClick={() => setTab("flows")}>
            По потокам
          </button>
        </div>
      </div>
      <BarList items={DEMAND_DATA} maxValue={124} />
    </div>
  );
}

function DeadlinePanel({ tab, setTab }) {
  const filtered = tab === "all" ? DEADLINES : DEADLINES.filter((d) => d.status === tab);
  return (
    <div className="wr-panel">
      <div className="wr-panel-head">
        <h3>Ближайшие сроки</h3>
        <button type="button" className="wr-panel-link">
          Все →
        </button>
      </div>

      <div className="wr-tabs">
        <button type="button" className={tab === "all" ? "is-active" : ""} onClick={() => setTab("all")}>
          Все
        </button>
        <button type="button" className={tab === "overdue" ? "is-active" : ""} onClick={() => setTab("overdue")}>
          Просрочено
        </button>
        <button type="button" className={tab === "hot" ? "is-active" : ""} onClick={() => setTab("hot")}>
          Горящие
        </button>
        <button type="button" className={tab === "planned" ? "is-active" : ""} onClick={() => setTab("planned")}>
          Плановые
        </button>
      </div>

      <div className="wr-deadline-list">
        {filtered.map((d, i) => (
          <div className="wr-deadline-item" key={i}>
            <div>
              <p className="wr-deadline-time">{d.time}</p>
              <p className="wr-deadline-org">{d.org}</p>
              <p className="wr-deadline-desc">{d.desc}</p>
            </div>
            <span className={`wr-status-pill wr-status-pill--${d.status}`}>{STATUS_LABEL[d.status]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function KamPanel({ tab, setTab }) {
  return (
    <div className="wr-panel wr-panel--wide">
      <div className="wr-panel-head">
        <h3>Эффективность и нагрузка КАМов</h3>
        <label className="wr-select">
          KAM: Все
          <ChevronDownIcon />
        </label>
      </div>

      <div className="wr-tabs">
        <button type="button" className={tab === "launches" ? "is-active" : ""} onClick={() => setTab("launches")}>
          Запуски
        </button>
        <button type="button" className={tab === "active" ? "is-active" : ""} onClick={() => setTab("active")}>
          В активной работе
        </button>
        <button type="button" className={tab === "sla" ? "is-active" : ""} onClick={() => setTab("sla")}>
          SLA / просрочки
        </button>
        <button type="button" className={tab === "speed" ? "is-active" : ""} onClick={() => setTab("speed")}>
          Скорость прохождения
        </button>
      </div>

      <p className="wr-panel-sub">Запуски программ · количество</p>
      <BarList items={KAM_DATA} maxValue={14} />
    </div>
  );
}

function ProgressTrack({ currentStep, totalSteps }) {
  return (
    <div className="wr-progress-track" role="img" aria-label={`Этап ${currentStep} из ${totalSteps}`}>
      {Array.from({ length: totalSteps }).map((_, i) => {
        const step = i + 1;
        const cls =
          step < currentStep ? "is-done" : step === currentStep ? "is-current" : "";
        return <span key={i} className={`wr-progress-seg ${cls}`} />;
      })}
    </div>
  );
}

function WorkflowSteps({ steps }) {
  return (
    <ol className="wr-steps">
      {steps.map((step, i) => (
        <li key={i} className={`wr-step wr-step--${step.status}`}>
          <span className="wr-step-icon">{step.status === "done" && <CheckIcon />}</span>
          <div className="wr-step-text">
            <p className="wr-step-title">{step.title}</p>
            {step.date && <p className="wr-step-date">{step.date}</p>}
            {step.extra && <p className="wr-step-date">{step.extra}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

function InteractionDetail({ item }) {
  return (
    <div className="wr-detail">
      <div className="wr-workflow">
        <h2>Workflow</h2>
        <p className="wr-workflow-sub">
          Этап {item.currentStep} из {item.totalSteps}
        </p>
        <WorkflowSteps steps={item.workflow} />
      </div>

      <div className="wr-info">
        <div className="wr-info-head">
          <div>
            <h2>{item.name}</h2>
            <p className="wr-info-breadcrumb">
              {item.program} / {item.partner} &nbsp;•&nbsp; {item.city} / {item.responsible.name}
            </p>
            <p className="wr-info-contract">
              Договор №{item.contractNumber} &nbsp;•&nbsp; Лицензия до {item.licenseUntil}
            </p>
          </div>
          <button type="button" className="wr-info-link">
            Подробнее о взаимодействии <span aria-hidden="true">•</span>
          </button>
        </div>

        <div className="wr-stage">
          <div className="wr-stage-row">
            <span className="wr-stage-num">Этап {pad(item.currentStep)}</span>
            <span className="wr-status">
              <span className="wr-status-dot" aria-hidden="true" />
              {item.status}
            </span>
          </div>
          <h3 className="wr-stage-title">{item.stageTitle}</h3>
          <p className="wr-stage-deadline">{item.stageDeadline}</p>
        </div>

        <dl className="wr-meta-grid">
          <div>
            <dt>Ответственный</dt>
            <dd>{item.responsible.name}</dd>
          </div>
          <div>
            <dt>Начало</dt>
            <dd>{item.startedAt}</dd>
          </div>
          <div>
            <dt>Срок</dt>
            <dd>{item.dueAt}</dd>
          </div>
          <div>
            <dt>Последнее изменение</dt>
            <dd>{item.updatedAt}</dd>
          </div>
        </dl>

        <section className="wr-comments">
          <h4>Комментарии</h4>
          {item.comments.map((comment, i) => (
            <div className="wr-comment" key={i}>
              <span className="wr-avatar" aria-hidden="true">
                {comment.initials}
              </span>
              <div className="wr-comment-body">
                <p className="wr-comment-head">
                  <strong>{comment.author}</strong>
                  <span>{comment.timestamp}</span>
                </p>
                <p className="wr-comment-text">{comment.text}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="wr-files">
          <h4>Файлы</h4>
          {item.files.map((file, i) => (
            <div className="wr-file" key={i}>
              <PdfIcon /> {/* FILE ICON: replace with <img src={fileThumbnail} alt="" className="wr-file-icon" /> if real previews are added */}
              <div className="wr-file-text">
                <p className="wr-file-name">{file.name}</p>
                <p className="wr-file-meta">
                  {file.type} &nbsp;•&nbsp; {file.size} &nbsp;•&nbsp; {file.uploadedAt}
                </p>
              </div>
              <button type="button" className="wr-file-download" aria-label={`Скачать файл ${file.name}`}>
                <DownloadIcon />
              </button>
            </div>
          ))}
        </section>

        <div className="wr-actions">
          <button type="button" className="wr-btn wr-btn--outline">
            + Комментарий
          </button>
          <button type="button" className="wr-btn wr-btn--outline">
            + Файл
          </button>
          <button type="button" className="wr-btn wr-btn--primary">
            Завершить этап
          </button>
        </div>
      </div>
    </div>
  );
}

function InteractionCard({ item, expanded, onToggle }) {
  return (
    <li className={`wr-card ${expanded ? "is-expanded" : ""}`}>
      <button
        type="button"
        className="wr-card-summary"
        onClick={onToggle}
        aria-expanded={expanded}
      >
        <div className="wr-card-org">
          <span className={`wr-badge ${expanded ? "wr-badge--plain" : ""}`}>{item.shortName}</span>
          <div className="wr-org-text">
            <p className="wr-org-name">{item.name}</p>
            <p className="wr-org-program">{item.program}</p>
            <p className="wr-org-meta">
              {item.partner} &nbsp;•&nbsp; {item.city}
            </p>
          </div>
        </div>

        <div className="wr-card-progress">
          <ProgressTrack currentStep={item.currentStep} totalSteps={item.totalSteps} />
          <p className="wr-progress-step">Текущий этап: {pad(item.currentStep)}</p>
          <p className="wr-progress-title">{item.stageTitle}</p>
        </div>

        <div className="wr-card-owner">
          <p className="wr-owner-label">Ответственный</p>
          <div className="wr-owner-name">
            <span className="wr-avatar" aria-hidden="true">
              {item.responsible.initials}
            </span>
            <span>{item.responsible.name}</span>
          </div>
          <p className="wr-owner-time">{item.updatedAt}</p>
        </div>

        <ChevronRightIcon />
      </button>

      {expanded && <InteractionDetail item={item} />}
    </li>
  );
}

export default function WorkRegion() {
  const [expandedId, setExpandedId] = useState(INTERACTIONS[0].id);
  const [search, setSearch] = useState("");

  // Header
  const [profileOpen, setProfileOpen] = useState(false);
  const [dark, setDark] = useState(false);

  // Dashboard ("Рабочая область")
  const [audience, setAudience] = useState("b2b");
  const [dashSearch, setDashSearch] = useState("");
  const [dashTab, setDashTab] = useState("processes");
  const [demandTab, setDemandTab] = useState("requests");
  const [deadlineTab, setDeadlineTab] = useState("all");
  const [kamTab, setKamTab] = useState("launches");

  function toggleCard(id) {
    setExpandedId((current) => (current === id ? null : id));
  }

  return (
    <div className="work-region">
      <Header profileOpen={profileOpen} setProfileOpen={setProfileOpen} dark={dark} setDark={setDark} />

      <div className="wr-page">
        <DashboardHead audience={audience} setAudience={setAudience} />
        <DashboardToolbar search={dashSearch} setSearch={setDashSearch} />
        <DashboardTabs tab={dashTab} setTab={setDashTab} />
        <StatCards />

        <div className="wr-panel-grid">
          <DemandPanel tab={demandTab} setTab={setDemandTab} />
          <DeadlinePanel tab={deadlineTab} setTab={setDeadlineTab} />
        </div>

        <KamPanel tab={kamTab} setTab={setKamTab} />

        <div className="wr-headline wr-headline--interactions">
          <h1 className="wr-title">Взаимодействия</h1>
          <span className="wr-count">{TOTAL_RECORDS} записи</span>
        </div>

        <div className="wr-toolbar">
          <label className="wr-search">
            <SearchIcon />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Найти учреждение, программу или ИТ-продукт..."
              aria-label="Найти учреждение, программу или ИТ-продукт"
            />
          </label>

          {FILTERS.map((filter) => (
            <button key={filter} type="button" className="wr-filter-btn">
              {filter}
              <ChevronDownIcon />
            </button>
          ))}
        </div>

        <ul className="wr-list">
          {INTERACTIONS.map((item) => (
            <InteractionCard
              key={item.id}
              item={item}
              expanded={expandedId === item.id}
              onToggle={() => toggleCard(item.id)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}