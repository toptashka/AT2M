import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { setAppTheme, useAppTheme } from "../../theme";
import Header from "../Header/Header";
import arrowDown from "../../assets/ArrowDown.svg";
import arrowLeft from "../../assets/ArrowLeft.svg";
import arrowRight from "../../assets/ArrowRight.svg";
import closeIcon from "../../assets/Close.svg";
import "./ReportsPage.css";

const icons = { down: arrowDown, left: arrowLeft, right: arrowRight, close: closeIcon };
const columns = [
  { key: "institution", label: "Учреждение", width: 248 },
  { key: "direction", label: "ИТ-направление", width: 220 },
  { key: "product", label: "ИТ-продукт", width: 172 },
  { key: "stage", label: "Текущий этап / Статус", width: 424, fields: ["stage", "status"] },
  { key: "manager", label: "Ответственный КАМ", width: 216 },
  { key: "studentCount", label: "Количество студентов", width: 190 },
  { key: "contractNumber", label: "Номер договора", width: 190 },
  { key: "licenseYear", label: "Срок действия лицензии (год)", width: 240 },
  { key: "licenseSigned", label: "Подписание лицензии", width: 200 },
  { key: "city", label: "Город / Регион", width: 220 },
];
const defaultColumns = columns.slice(0, 5).map(column => column.key);
const emptyFilters = { from: "", to: "", institutions: [], directions: [], products: [], managers: [] };
const pageSize = 5;
const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
const years = Array.from({ length: 201 }, (_, i) => 1900 + i);
const pad = number => String(number).padStart(2, "0");

const demoToday = new Date();
const demoYear = demoToday.getFullYear();
const demoMonth = demoToday.getMonth();
const demoInstitutions = [
  { name: "МГТУ им. Н. Э. Баумана", city: "Москва" },
  { name: "НИЯУ МИФИ", city: "Москва" },
  { name: "Университет ИТМО", city: "Санкт-Петербург" },
  { name: "СПбПУ Петра Великого", city: "Санкт-Петербург" },
  { name: "Казанский федеральный университет", city: "Казань" },
  { name: "Уральский федеральный университет", city: "Екатеринбург" },
];
const demoDirections = ["DevOps", "Информационная безопасность", "Облачные технологии"];
const demoProducts = ["Solar Dozor", "РТК-Платформа", "Solar webProxy"];
const demoManagers = ["Александр Иванов", "Мария Смирнова", "Дмитрий Соколов", "Елена Орлова"];
const demoStages = [
  { stage: "08 · Сопровождение внедрения", status: "В работе" },
  { stage: "06 · Подписание документов", status: "Просрочено" },
  { stage: "09 · Обучение преподавателей", status: "В работе" },
  { stage: "10 · Завершение внедрения", status: "Завершено" },
];
const demoRecords = Array.from({ length: 24 }, (_, index) => {
  const institution = demoInstitutions[index % demoInstitutions.length];
  const signed = index % 3 !== 1;

  return {
    id: `demo-report-${index + 1}`,
    institution: institution.name,
    city: institution.city,
    direction: demoDirections[index % demoDirections.length],
    product: demoProducts[Math.floor(index / 3) % demoProducts.length],
    manager: demoManagers[index % demoManagers.length],
    ...demoStages[index % demoStages.length],
    startDate: isoDate(new Date(demoYear, demoMonth, index + 1, 12)),
    studentCount: index === 0 ? 0 : 25 + index * 5,
    contractNumber: signed ? `ДЕМО-${demoYear}-${String(index + 1).padStart(3, "0")}` : "",
    licenseYear: signed ? demoYear + 1 : null,
    licenseSigned: signed,
  };
});
const demoFilters = {
  ...emptyFilters,
  from: isoDate(new Date(demoYear, demoMonth, 1, 12)),
  to: isoDate(new Date(demoYear, demoMonth + 1, 0, 12)),
};

function isoDate(date) { return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`; }
function parseDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? "")) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day, 12);
  return isoDate(date) === value ? date : null;
}
function formatDate(value) { const date = parseDate(value); return date ? `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}` : "дд.мм.гггг"; }
function recordCount(count) {
  const mod = count % 100;
  return `${count} ${mod >= 11 && mod <= 14 ? "записей" : count % 10 === 1 ? "запись" : count % 10 >= 2 && count % 10 <= 4 ? "записи" : "записей"}`;
}
function normalizeFilters(value) {
  return { ...emptyFilters, ...value, institutions: [...(value.institutions ?? [])], directions: [...(value.directions ?? value.programs ?? [])], products: [...(value.products ?? [])], managers: [...(value.managers ?? [])] };
}
function cellValue(value) { return value === null || value === undefined || value === "" ? "—" : String(value); }
function PageIcon({ name }) { return <span className="reports-icon" style={{ "--reports-icon-url": `url("${icons[name]}")` }} aria-hidden="true" />; }

function useAnimatedState() {
  const [present, setPresent] = useState(false);
  const [closing, setClosing] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const update = useCallback(next => {
    window.clearTimeout(timer.current);
    if (next) { setClosing(false); setPresent(true); return; }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setPresent(false); setClosing(false); return; }
    setClosing(true);
    timer.current = window.setTimeout(() => { setPresent(false); setClosing(false); }, 180);
  }, []);
  return [present, update, closing];
}

function Popover({ label, trigger, children, className = "", disabled = false }) {
  const id = useId();
  const root = useRef(null);
  const panel = useRef(null);
  const button = useRef(null);
  const [present, setPresent, closing] = useAnimatedState();
  const [session, setSession] = useState(0);
  const open = present && !closing;
  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector('[data-initial-focus="true"], input, button, select')?.focus();
    function outside(event) { if (!root.current?.contains(event.target)) setPresent(false); }
    function escape(event) {
      if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); setPresent(false); button.current?.focus(); }
    }
    const element = root.current;
    document.addEventListener("pointerdown", outside);
    document.addEventListener("focusin", outside);
    element.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("focusin", outside); element.removeEventListener("keydown", escape); };
  }, [open, setPresent]);
  function close() { setPresent(false); document.getElementById(`${id}-trigger`)?.focus({ preventScroll: true }); }
  return <div className={`reports-popover-root ${className}`} ref={root}>
    <button type="button" id={`${id}-trigger`} ref={button} className="reports-popover-trigger" aria-label={label} aria-expanded={open} aria-haspopup="dialog" aria-controls={present ? id : undefined} disabled={disabled} onClick={() => { if (!open) setSession(value => value + 1); setPresent(!open); }}>{trigger}</button>
    {present && <div key={session} className="reports-popover" id={id} ref={panel} role="dialog" aria-label={label} aria-hidden={closing || undefined} inert={closing || undefined} data-closing={closing}>{children(close)}</div>}
  </div>;
}

function FilterMenu({ label, placeholder, searchLabel, options, selected, onApply, disabled }) {
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState(() => selected.length ? [...selected] : [...options]);
  const allChecked = options.length > 0 && options.every(option => draft.includes(option));
  const visible = options.filter(option => option.toLocaleLowerCase("ru").includes(query.trim().toLocaleLowerCase("ru")));
  return <div className="reports-filter-menu">
    <input className="reports-search" type="search" aria-label={searchLabel} placeholder={searchLabel} value={query} disabled={disabled} onChange={event => setQuery(event.target.value)} />
    <div className="reports-options" role="group" aria-label={label}>
      <label className="reports-check"><input type="checkbox" checked={allChecked} disabled={disabled || !options.length} onChange={() => setDraft(allChecked ? [] : [...options])} /><span>{placeholder}</span></label>
      {visible.map(option => <label className="reports-check" key={option}><input type="checkbox" checked={draft.includes(option)} disabled={disabled} onChange={() => setDraft(value => value.includes(option) ? value.filter(item => item !== option) : [...value, option])} /><span>{option}</span></label>)}
      {!visible.length && <p className="reports-menu-empty">{query ? "Ничего не найдено" : "Нет доступных вариантов"}</p>}
    </div>
    {!draft.length && options.length > 0 && <p className="reports-menu-hint">Выберите хотя бы один вариант</p>}
    <button type="button" className="reports-button reports-button-primary" disabled={disabled || !draft.length} onClick={() => onApply(allChecked ? [] : draft)}>Применить</button>
  </div>;
}

function MultiSelect({ label, placeholder, searchLabel, options, selected, onChange, className = "", disabled = false }) {
  const items = [...new Set([...options, ...selected])];
  const summary = selected.length ? `${selected[0]}${selected.length > 1 ? ` + ещё ${selected.length - 1}` : ""}` : placeholder;
  return <div className={`reports-field ${className}`}><span className="reports-label">{label}</span>
    <Popover label={label} disabled={disabled} trigger={<><span className="reports-select-summary">{summary}</span><PageIcon name="down" /></>}>
      {close => <FilterMenu label={label} placeholder={placeholder} searchLabel={searchLabel} options={items} selected={selected} disabled={disabled} onApply={value => { onChange(value); close(); }} />}
    </Popover>
  </div>;
}

function MonthSelect({ label, value, options, disabled, onChange }) {
  const id = useId();
  const root = useRef(null);
  const trigger = useRef(null);
  const list = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const selected = list.current?.querySelector('[aria-selected="true"]');
    selected?.focus({ preventScroll: true });
    if (selected) list.current.scrollTop = selected.offsetTop - list.current.clientHeight / 2 + selected.clientHeight / 2;
    function outside(event) {
      if (!root.current?.contains(event.target)) setOpen(false);
    }
    function escape(event) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      trigger.current?.focus({ preventScroll: true });
    }
    const element = root.current;
    element.addEventListener("keydown", escape);
    document.addEventListener("pointerdown", outside);
    document.addEventListener("focusin", outside);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("focusin", outside);
      element.removeEventListener("keydown", escape);
    };
  }, [open]);

  function choose(next) {
    onChange(next);
    setOpen(false);
    trigger.current?.focus({ preventScroll: true });
  }

  function handleKey(event) {
    if (event.key === "Escape" && open) {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      trigger.current?.focus({ preventScroll: true });
      return;
    }
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    if (!open) { setOpen(true); return; }
    const buttons = [...list.current.querySelectorAll('[role="option"]')];
    const index = buttons.indexOf(document.activeElement);
    const next = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1
      : Math.max(0, Math.min(buttons.length - 1, index + (event.key === "ArrowDown" ? 1 : -1)));
    buttons[next]?.focus({ preventScroll: true });
    buttons[next]?.scrollIntoView({ block: "nearest" });
  }

  return <div className="reports-month-select" ref={root} onKeyDown={handleKey}>
    <button type="button" className="reports-month-select-trigger" ref={trigger} disabled={disabled}
      aria-label={label} aria-haspopup="listbox" aria-expanded={open} aria-controls={open ? id : undefined}
      onClick={() => setOpen(previous => !previous)}>{options.find(option => option.value === value)?.label}</button>
    {open && <div className="reports-month-options" id={id} role="listbox" aria-label={label} ref={list}>
      {options.map(option => <button type="button" role="option" key={option.value}
        aria-selected={option.value === value} tabIndex={-1} onClick={() => choose(option.value)}>{option.label}</button>)}
    </div>}
  </div>;
}


function DateCalendar({ from, to, onApply, onReset, disabled }) {
  const id = useId();
  const seed = parseDate(from) ?? new Date();
  const [baseMonth, setBaseMonth] = useState(() => new Date(seed.getFullYear(), seed.getMonth(), 1, 12));
  const [draft, setDraft] = useState({ from, to });
  const [choosingEnd, setChoosingEnd] = useState(false);
  const [hovered, setHovered] = useState("");
  const [focused, setFocused] = useState("");
  const today = isoDate(new Date());
  useEffect(() => { if (focused) document.getElementById(`${id}-${focused}`)?.focus({ preventScroll: true }); }, [focused, baseMonth, id]);
  function changeMonth(date) {
    const first = new Date(1900, 0, 1, 12);
    const last = new Date(2100, 10, 1, 12);
    setBaseMonth(date < first ? first : date > last ? last : date);
    setFocused("");
  }
  function moveMonth(delta) { changeMonth(new Date(baseMonth.getFullYear(), baseMonth.getMonth() + delta, 1, 12)); }
  function selectDate(value) {
    if (disabled) return;
    if (!choosingEnd) { setDraft({ from: value, to: "" }); setChoosingEnd(true); setHovered(""); return; }
    onApply({ from: value < draft.from ? value : draft.from, to: value < draft.from ? draft.from : value });
  }
  function preset(type) {
    const now = new Date(), year = now.getFullYear(), month = now.getMonth();
    let start, end;
    if (type === "current") { start = new Date(year, month, 1, 12); end = new Date(year, month + 1, 0, 12); }
    if (type === "previous") { start = new Date(year, month - 1, 1, 12); end = new Date(year, month, 0, 12); }
    if (type === "quarter") { const first = Math.floor(month / 3) * 3; start = new Date(year, first, 1, 12); end = new Date(year, first + 3, 0, 12); }
    if (type === "academic") { const first = month >= 8 ? year : year - 1; start = new Date(first, 8, 1, 12); end = new Date(first + 1, 8, 0, 12); }
    onApply({ from: isoDate(start), to: isoDate(end) });
  }
  function dayKey(event, value) {
    const date = parseDate(value);
    const weekday = (date.getDay() + 6) % 7;
    const delta = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7, Home: -weekday, End: 6 - weekday }[event.key];
    if (delta === undefined && !["PageUp", "PageDown"].includes(event.key)) return;
    event.preventDefault();
    if (delta !== undefined) date.setDate(date.getDate() + delta);
    else { const day = date.getDate(); date.setDate(1); date.setMonth(date.getMonth() + (event.key === "PageUp" ? -1 : 1)); date.setDate(Math.min(day, new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate())); }
    if (date.getFullYear() < 1900 || date.getFullYear() > 2100) return;
    const monthOffset = (date.getFullYear() - baseMonth.getFullYear()) * 12 + date.getMonth() - baseMonth.getMonth();
    if (monthOffset < 0 || monthOffset > 1) setBaseMonth(new Date(date.getFullYear(), date.getMonth() - (monthOffset > 1 ? 1 : 0), 1, 12));
    setFocused(isoDate(date));
  }
  const previewEnd = choosingEnd ? hovered || draft.from : draft.to;
  const rangeStart = draft.from < previewEnd ? draft.from : previewEnd;
  const rangeEnd = draft.from < previewEnd ? previewEnd : draft.from;
  return <div className="reports-date-calendar"><div className="reports-date-presets">
    {[["current", "Текущий месяц"], ["previous", "Прошлый месяц"], ["quarter", "Квартал"], ["academic", "Учебный год"]].map(([key, label]) => <button type="button" disabled={disabled} key={key} onClick={() => preset(key)}>{label}</button>)}
  </div><div className="reports-calendar-months">
    {[0, 1].map(offset => {
      const month = new Date(baseMonth.getFullYear(), baseMonth.getMonth() + offset, 1, 12);
      const year = month.getFullYear(), monthIndex = month.getMonth();
      const blanks = (month.getDay() + 6) % 7;
      const count = new Date(year, monthIndex + 1, 0).getDate();
      const cells = Array.from({ length: Math.ceil((blanks + count) / 7) * 7 }, (_, i) => i >= blanks && i < blanks + count ? i - blanks + 1 : null);
      return <section className="reports-calendar-month" key={offset} aria-label={`${monthNames[monthIndex]} ${year}`}>
        <div className="reports-month-heading"><button className="reports-calendar-arrow" type="button" disabled={disabled || (baseMonth.getFullYear() === 1900 && baseMonth.getMonth() === 0)} aria-label={`Предыдущий месяц, календарь ${offset + 1}`} onClick={() => moveMonth(-1)}><PageIcon name="left" /></button>
          <div className="reports-month-selects">
            <MonthSelect label={`Месяц, календарь ${offset + 1}`} value={monthIndex} disabled={disabled}
              options={monthNames.map((label, value) => ({ value, label }))}
              onChange={value => changeMonth(new Date(year, value - offset, 1, 12))} />
            <MonthSelect label={`Год, календарь ${offset + 1}`} value={year} disabled={disabled}
              options={years.map(value => ({ value, label: String(value) }))}
              onChange={value => changeMonth(new Date(value, monthIndex - offset, 1, 12))} />
          </div>
          <button className="reports-calendar-arrow" type="button" disabled={disabled || (baseMonth.getFullYear() === 2100 && baseMonth.getMonth() >= 10)} aria-label={`Следующий месяц, календарь ${offset + 1}`} onClick={() => moveMonth(1)}><PageIcon name="right" /></button>
        </div>
        <div role="grid" aria-label={`${monthNames[monthIndex]} ${year}`} className="reports-calendar-grid"><div role="row" className="reports-calendar-week">{["пн", "вт", "ср", "чт", "пт", "сб", "вс"].map(day => <span role="columnheader" key={day}>{day}</span>)}</div>
          {Array.from({ length: cells.length / 7 }, (_, week) => <div role="row" className="reports-calendar-week" key={week}>{cells.slice(week * 7, week * 7 + 7).map((day, index) => {
            if (!day) return <span role="gridcell" key={`blank-${index}`} />;
            const value = `${year}-${pad(monthIndex + 1)}-${pad(day)}`;
            const endpoint = value === draft.from || value === draft.to;
            const inRange = Boolean(rangeStart && rangeEnd && value >= rangeStart && value <= rangeEnd);
            return <button type="button" role="gridcell" id={`${id}-${value}`} key={day} disabled={disabled} tabIndex={focused ? focused === value ? 0 : -1 : day === (parseDate(draft.from)?.getMonth() === monthIndex && parseDate(draft.from)?.getFullYear() === year ? parseDate(draft.from).getDate() : 1) ? 0 : -1} aria-label={formatDate(value)} aria-selected={endpoint || inRange} aria-current={value === today ? "date" : undefined} data-endpoint={endpoint} data-in-range={inRange} onMouseEnter={() => { if (choosingEnd) setHovered(value); }} onKeyDown={event => dayKey(event, value)} onClick={() => selectDate(value)}>{day}</button>;
          })}</div>)}
        </div>
      </section>;
    })}
    <div className="reports-calendar-footer"><span role="status">{choosingEnd ? "Выберите дату окончания" : "Выберите начало и конец периода"}</span><button type="button" className="reports-text-button" disabled={disabled} onClick={() => { setDraft({ from: "", to: "" }); setChoosingEnd(false); setHovered(""); setFocused(""); onReset(); }}>Сбросить период</button></div>
  </div></div>;
}

function DateRange({ from, to, onChange, disabled }) {
  return <div className="reports-field reports-period"><span className="reports-label">Период</span>
    <Popover className="reports-date-picker" label="Выбрать период" disabled={disabled} trigger={<><span className="reports-date-prefix">С</span><span className="reports-date-value">{formatDate(from)}<PageIcon name="down" /></span><span className="reports-date-prefix">По</span><span className="reports-date-value">{formatDate(to)}<PageIcon name="down" /></span></>}>
      {close => <DateCalendar from={from} to={to} disabled={disabled} onReset={() => onChange({ from: "", to: "" })} onApply={value => { onChange(value); close(); }} />}
    </Popover>
  </div>;
}

function Pagination({ page, count, onChange }) {
  const pages = count <= 7 ? Array.from({ length: count }, (_, index) => index + 1) : [...new Set([1, count, page - 1, page, page + 1].filter(value => value >= 1 && value <= count))].sort((a, b) => a - b);
  return <nav className="reports-pagination" aria-label="Страницы отчёта"><button type="button" aria-label="Предыдущая страница" disabled={page === 1} onClick={() => onChange(page - 1)}><PageIcon name="left" /></button>
    {pages.map((value, index) => <span className="reports-page-item" key={value}>{index > 0 && value - pages[index - 1] > 1 && <span className="reports-page-gap">…</span>}<button type="button" aria-label={`Страница ${value}`} aria-current={page === value ? "page" : undefined} onClick={() => onChange(value)}>{value}</button></span>)}
    <button type="button" aria-label="Следующая страница" disabled={page === count} onClick={() => onChange(page + 1)}><PageIcon name="right" /></button>
  </nav>;
}

function TableCell({ row, column }) {
  if (column.key === "stage") return <><span className="reports-stage">{cellValue(row.stage)}</span><span className="reports-status" data-status={row.status}>{row.status || "Статус не указан"}</span></>;
  if (column.key === "licenseSigned") return row.licenseSigned === true ? "Да" : row.licenseSigned === false ? "Нет" : cellValue(row.licenseSigned);
  return cellValue(row[column.key]);
}

export default function ReportsPage({ records = demoRecords, initialFilters = records === demoRecords ? demoFilters : emptyFilters, filterOptions = {}, loading = false, error = "", onExport, lockedManager = "" }) {
  const { theme } = useAppTheme();
  const id = useId();
  const [profileOpen, setProfileOpen] = useState(false);
  const [filters, setFilters] = useState(() => normalizeFilters(initialFilters));
  const [selectedColumns, setSelectedColumns] = useState(defaultColumns);
  const [page, setPage] = useState(1);
  const [exporting, setExporting] = useState("");
  const [notification, setNotification] = useState(null);
  const exportLock = useRef(false);
  const exportRequest = useRef(null);
  const downloads = useRef(new Map());
  useEffect(() => {
    const urls = downloads.current;
    return () => { exportRequest.current?.abort(); for (const [url, timer] of urls) { window.clearTimeout(timer); URL.revokeObjectURL(url); } urls.clear(); };
  }, []);
  useEffect(() => {
    if (notification?.type !== "success") return;
    const timer = window.setTimeout(() => setNotification(null), 8000);
    return () => window.clearTimeout(timer);
  }, [notification]);
  const normalizedRecords = useMemo(() => records.map(row => ({ ...row, direction: row.direction ?? row.program ?? "" })), [records]);
  const options = useMemo(() => {
    const values = key => [...new Set(normalizedRecords.map(row => row[key]).filter(Boolean))].sort((a, b) => a.localeCompare(b, "ru"));
    return { institutions: values("institution"), directions: values("direction"), products: values("product"), managers: values("manager") };
  }, [normalizedRecords]);
  const ready = Boolean(filters.from && filters.to);
  const invalidPeriod = ready && (!parseDate(filters.from) || !parseDate(filters.to) || filters.from > filters.to);
  const filtered = useMemo(() => {
    if (!ready || invalidPeriod) return [];
    return normalizedRecords.filter(row => {
      const date = String(row.startDate ?? "").slice(0, 10);
      return Boolean(parseDate(date)) && date >= filters.from && date <= filters.to &&
        (!filters.institutions.length || filters.institutions.includes(row.institution)) &&
        (!filters.directions.length || filters.directions.includes(row.direction)) &&
        (!filters.products.length || filters.products.includes(row.product)) &&
        (lockedManager ? row.manager === lockedManager : !filters.managers.length || filters.managers.includes(row.manager));
    });
  }, [normalizedRecords, filters, ready, invalidPeriod, lockedManager]);
  const visibleColumns = columns.filter(column => selectedColumns.includes(column.key));
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const activePage = Math.min(page, pageCount), first = (activePage - 1) * pageSize;
  const canExport = Boolean(onExport) && !loading && !error && !exporting && filtered.length > 0 && visibleColumns.length > 0;

  function changeFilters(patch) { setFilters(previous => ({ ...previous, ...patch })); setPage(1); setNotification(null); }
  function resetFilters() { setFilters(normalizeFilters(emptyFilters)); setPage(1); setNotification(null); }
  function changeColumns(value) { setSelectedColumns(value); setNotification(null); }
  function changeTheme(value) { const dark = typeof value === "function" ? value(theme === "dark") : value; setAppTheme(dark ? "dark" : "light"); }
  async function exportReport(format) {
    if (!canExport || exportLock.current) return;
    exportLock.current = true;
    const controller = new AbortController(); exportRequest.current = controller;
    const snapshot = { ...filters, programs: [...filters.directions], institutions: [...filters.institutions], directions: [...filters.directions], products: [...filters.products], managers: lockedManager ? [lockedManager] : [...filters.managers] };
    const filename = `report_rtk_${formatDate(snapshot.from)}-${formatDate(snapshot.to)}.${format}`;
    setExporting(format); setNotification(null);
    try {
      const file = await onExport({ format, filters: snapshot, columns: visibleColumns.map(({ key, label, fields }) => ({ key, label, ...(fields ? { fields } : {}) })), records: filtered.map(row => ({ ...row })), signal: controller.signal });
      if (controller.signal.aborted) return;
      if (!(file instanceof Blob) || !file.size) throw new Error("Сервис вернул пустой файл.");
      const url = URL.createObjectURL(file), link = document.createElement("a");
      const timer = window.setTimeout(() => { URL.revokeObjectURL(url); downloads.current.delete(url); }, 30000);
      downloads.current.set(url, timer);
      link.href = url; link.download = filename; document.body.append(link); link.click(); link.remove();
      setNotification({ type: "success", title: "Отчёт успешно сформирован", message: `Файл ${filename} передан для скачивания.` });
    } catch (failure) {
      if (controller.signal.aborted) return;
      const status = Number(failure?.status ?? failure?.response?.status);
      const statusNames = { 400: "Bad Request", 401: "Unauthorized", 403: "Forbidden", 500: "Internal Server Error", 502: "Bad Gateway", 503: "Service Unavailable", 504: "Gateway Timeout" };
      setNotification({ type: "error", title: "Ошибка формирования отчёта", code: Number.isInteger(status) && status >= 400 && status <= 599 ? `${status} ${statusNames[status] ?? ""}`.trim() : "",
        message: status === 504 ? "Не удалось сгенерировать файл за выбранный диапазон. Попробуйте сузить период или повторите попытку позже." : status === 401 || status === 403 ? "Нет доступа к выгрузке отчёта. Проверьте учётную запись и права доступа." : "Не удалось сформировать файл. Повторите попытку позже." });
    } finally { exportLock.current = false; if (!controller.signal.aborted) setExporting(""); }
  }

  return <div className="reports-page" data-theme={theme}>
    <Header activePage="Отчёты" profileOpen={profileOpen} setProfileOpen={setProfileOpen} dark={theme === "dark"} setDark={changeTheme} />
    <main className="reports-main"><div className="reports-heading"><h1>Отчёты</h1><p>Формирование и выгрузка данных по взаимодействиям с учебными заведениями</p></div>
      <section className="reports-filter-panel" aria-labelledby={`${id}-filters`}><h2 id={`${id}-filters`}>Параметры отчёта</h2><div className="reports-filter-grid">
        <DateRange from={filters.from} to={filters.to} onChange={changeFilters} disabled={Boolean(exporting)} />
        <MultiSelect className="reports-institutions" label="Учреждения" placeholder="Все учреждения" searchLabel="Поиск учреждений" options={filterOptions.institutions ?? options.institutions} selected={filters.institutions} onChange={value => changeFilters({ institutions: value })} disabled={Boolean(exporting)} />
        <MultiSelect label="ИТ-направления" placeholder="Все направления" searchLabel="Поиск направлений" options={filterOptions.directions ?? filterOptions.programs ?? options.directions} selected={filters.directions} onChange={value => changeFilters({ directions: value })} disabled={Boolean(exporting)} />
        <MultiSelect label="ИТ-продукты" placeholder="Все продукты" searchLabel="Поиск продуктов" options={filterOptions.products ?? options.products} selected={filters.products} onChange={value => changeFilters({ products: value })} disabled={Boolean(exporting)} />
        {lockedManager ? <div className="reports-field"><label className="reports-label" htmlFor={`${id}-manager`}>Ответственные КАМы</label><input className="reports-locked-field" id={`${id}-manager`} value={lockedManager} disabled readOnly /></div> : <MultiSelect label="Ответственные КАМы" placeholder="Все ответственные" searchLabel="Поиск сотрудников" options={filterOptions.managers ?? options.managers} selected={filters.managers} onChange={value => changeFilters({ managers: value })} disabled={Boolean(exporting)} />}
      </div>{invalidPeriod && <p className="reports-period-error" role="alert">Укажите корректный период: дата начала не может быть позже даты окончания.</p>}</section>
      <section className="reports-column-bar" aria-label="Настройка колонок"><div className="reports-section-heading"><h2>Колонки отчёта</h2><span>Выбрано {selectedColumns.length} из {columns.length}</span></div>
        <Popover label="Настроить колонки" trigger="Настроить колонки" className="reports-column-picker" disabled={Boolean(exporting)}>{close => <>
          <div className="reports-popover-heading"><h3>Колонки отчёта</h3><button type="button" className="reports-icon-button" aria-label="Закрыть настройку колонок" onClick={close}><PageIcon name="close" /></button></div>
          <div className="reports-options">{columns.map(column => <label className="reports-check" key={column.key}><input type="checkbox" checked={selectedColumns.includes(column.key)} disabled={Boolean(exporting)} onChange={() => changeColumns(selectedColumns.includes(column.key) ? selectedColumns.filter(key => key !== column.key) : [...selectedColumns, column.key])} /><span>{column.label}</span></label>)}</div>
          <div className="reports-popover-footer"><button type="button" className="reports-button" disabled={Boolean(exporting)} onClick={() => changeColumns(columns.map(column => column.key))}>Выбрать все</button><button type="button" className="reports-button" disabled={Boolean(exporting)} onClick={() => changeColumns(defaultColumns)}>Сбросить</button></div>
        </>}</Popover>
      </section>
      <section className="reports-preview" aria-labelledby={`${id}-preview`} aria-busy={loading}>
        <div className="reports-preview-bar"><div className="reports-section-heading"><h2 id={`${id}-preview`}>Предпросмотр</h2><span aria-live="polite">{loading ? "Загрузка…" : recordCount(filtered.length)}</span></div><div className="reports-export-actions" aria-label="Экспорт отчёта" aria-busy={Boolean(exporting)}>
          {["xlsx", "xls", "pdf"].map(format => <button type="button" key={format} className={`reports-button${format === "xlsx" ? " reports-button-primary" : ""}`} data-exporting={exporting === format} disabled={!canExport} title={!onExport ? "Экспорт пока не подключён" : undefined} onClick={() => exportReport(format)}>{exporting === format ? <><span className="reports-spinner" aria-hidden="true" />Генерация…</> : `Экспортировать ${format.toUpperCase()}`}</button>)}
        </div></div>
        {loading ? <div className="reports-empty" role="status"><span className="reports-spinner" /><h3>Загружаем данные отчёта…</h3></div> : error ? <div className="reports-empty" role="alert"><h3>Не удалось загрузить отчёт</h3><p>{error}</p></div> : !ready || invalidPeriod ? <div className="reports-empty"><h3>Настройте параметры отчёта, чтобы увидеть данные</h3><p>Укажите период и выберите нужные фильтры</p></div> : !filtered.length ? <div className="reports-empty"><h3>По выбранным параметрам данные не найдены</h3><p>Измените период или параметры фильтрации</p><button type="button" className="reports-button" onClick={resetFilters}>Сбросить фильтры</button></div> : !visibleColumns.length ? <div className="reports-empty"><h3>Выберите колонки отчёта</h3><p>Для предпросмотра нужна хотя бы одна колонка</p></div> : <div className="reports-table-card">
          <div className="reports-table-scroll" role="region" aria-label="Таблица отчёта" tabIndex={0}><table className="reports-table" style={{ minWidth: selectedColumns.length <= 5 ? 920 : visibleColumns.reduce((sum, column) => sum + column.width, 0) }}>
            <caption className="reports-visually-hidden">Взаимодействия с учебными заведениями</caption><colgroup>{visibleColumns.map(column => <col key={column.key} style={{ width: `${column.width / visibleColumns.reduce((sum, item) => sum + item.width, 0) * 100}%` }} />)}</colgroup>
            <thead><tr>{visibleColumns.map(column => <th scope="col" key={column.key}>{column.label}</th>)}</tr></thead><tbody>{filtered.slice(first, first + pageSize).map(row => <tr key={row.id}>{visibleColumns.map(column => <td key={column.key} data-column={column.key}><TableCell row={row} column={column} /></td>)}</tr>)}</tbody>
          </table></div><footer className="reports-table-footer"><span>{first + 1}–{Math.min(first + pageSize, filtered.length)} из {filtered.length}</span><Pagination page={activePage} count={pageCount} onChange={setPage} /></footer>
        </div>}
      </section>
    </main>{notification && <div className="reports-notification" data-type={notification.type} role={notification.type === "error" ? "alert" : "status"}><button type="button" className="reports-icon-button" aria-label="Скрыть уведомление" onClick={() => setNotification(null)}><PageIcon name="close" /></button><h3>{notification.title}</h3>{notification.code && <p>Код: {notification.code}</p>}<p>{notification.message}</p></div>}
  </div>;
}
