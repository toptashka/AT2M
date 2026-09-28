import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import Header from "../Header/Header";
import { setAppTheme, useAppTheme } from "../../theme";
import "./CalendarPage.css";

import arrowDown from "../../assets/ArrowDown.svg";
import arrowLeft from "../../assets/ArrowLeft.svg";
import arrowRight from "../../assets/ArrowRight.svg";
import close from "../../assets/Close.svg";

const icons = { down: arrowDown, left: arrowLeft, right: arrowRight, close };

function PageIcon({ name, className = "" }) {
  return (
    <span
      className={`calendar-control-icon ${className}`}
      style={{ "--calendar-control-icon": `url("${icons[name]}")` }}
      aria-hidden="true"
    />
  );
}



function useAnimatedState(initialValue = null) {
  const [value, setValue] = useState(initialValue);
  const [closing, setClosing] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const update = useCallback((nextValue) => {
    window.clearTimeout(timer.current);
    if (nextValue !== null) {
      setClosing(false);
      setValue(nextValue);
      return;
    }
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setClosing(false);
      setValue(null);
      return;
    }
    setClosing(true);
    timer.current = window.setTimeout(() => {
      setValue(null);
      setClosing(false);
    }, 220);
  }, []);

  return [value, update, closing];
}


function FilterChoices({ label, items, value, onApply }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(() => value.length ? [...value] : items.map(item => item.value));
  const all = items.length > 0 && items.every(item => selected.includes(item.value));
  const visible = items.filter(item => item.label.toLocaleLowerCase("ru").includes(query.trim().toLocaleLowerCase("ru")));

  return <>
    <input type="search" className="calendar-filter-search" aria-label={`Поиск: ${label}`} placeholder="Поиск"
      value={query} onChange={event => setQuery(event.target.value)} />
    <div className="calendar-filter-options" role="group" aria-label={label}>
      <label className="calendar-filter-check"><input type="checkbox" checked={all} disabled={!items.length}
        onChange={() => setSelected(all ? [] : items.map(item => item.value))} /><span>Все</span></label>
      {visible.map(item => <label className="calendar-filter-check" key={item.value}>
        <input type="checkbox" checked={selected.includes(item.value)} onChange={() => setSelected(previous => previous.includes(item.value)
          ? previous.filter(value => value !== item.value) : [...previous, item.value])} /><span>{item.label}</span>
      </label>)}
      {!visible.length && <p className="calendar-filter-hint">Ничего не найдено</p>}
    </div>
    {!selected.length && items.length > 0 && <p className="calendar-filter-hint">Выберите хотя бы один вариант</p>}
    <button type="button" className="calendar-button calendar-primary calendar-filter-apply" disabled={!selected.length}
      onClick={() => onApply(all ? [] : selected)}>Применить</button>
  </>;
}

function SelectFilter({ label, value, options, onChange }) {
  const id = useId();
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const listRef = useRef(null);
  const [present, setPresent, closing] = useAnimatedState();
  const [session, setSession] = useState(0);
  const open = Boolean(present) && !closing;
  const items = options.map(option => typeof option === "string" ? { value: option, label: option } : option);
  const summary = value.length ? `${items.find(item => item.value === value[0])?.label ?? value[0]}${value.length > 1 ? ` + ещё ${value.length - 1}` : ""}` : label;

  useEffect(() => {
    if (listRef.current) listRef.current.inert = closing;
    if (!open) return;
    listRef.current?.querySelector('input[type="search"]')?.focus({ preventScroll: true });
    function outside(event) {
      if (!rootRef.current?.contains(event.target)) setPresent(null);
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("focusin", outside);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("focusin", outside);
    };
  }, [open, closing, setPresent]);

  function close() {
    setPresent(null);
    triggerRef.current?.focus({ preventScroll: true });
  }

  return <div className="calendar-control-select" ref={rootRef} onKeyDown={event => {
    if (event.key === "Escape" && open) { event.preventDefault(); event.stopPropagation(); close(); }
  }}>
    <button type="button" className="calendar-select" ref={triggerRef} aria-label={value.length ? `${label}: ${summary}` : label}
      title={label} aria-haspopup="dialog" aria-expanded={open} aria-controls={present ? id : undefined}
      onClick={() => { if (!open) setSession(previous => previous + 1); setPresent(open ? null : true); }}>
      <span className="calendar-control-select-value">{summary}</span>
      <PageIcon name="down" className="calendar-control-select-arrow" />
    </button>
    {present && <div className="calendar-filter-reveal calendar-control-motion" data-closing={closing}>
      <div className="calendar-filter-clip">
        <div className="calendar-control-select-list" ref={listRef} id={id} role="dialog" aria-label={label} aria-hidden={closing || undefined}>
          <FilterChoices key={session} label={label} items={items} value={value} onApply={next => { onChange(next); close(); }} />
        </div>
      </div>
    </div>}
  </div>;
}


const emptyEvents = [];
const emptyFilters = { program: [], product: [], manager: [], type: [], institution: [], city: [], urgency: [] };
const types = { deadline: "Дедлайн этапа", license: "Передача лицензии", training: "Старт обучения" };
const statuses = { overdue: "Просрочено", urgent: "Горящий срок", planned: "Плановое" };
const weekdays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
function eventCount(count) {
  const last = count % 10;
  const lastTwo = count % 100;
  const word = last === 1 && lastTwo !== 11 ? "событие"
    : last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14) ? "события" : "событий";
  return `${count} ${word}`;
}
const pad = (value) => String(value).padStart(2, "0");
const toDate = (value) => new Date(`${value}T12:00:00Z`);
const dateKey = (date) => date.toISOString().slice(0, 10);
const addDays = (value, count) => {
  const date = toDate(value);
  date.setUTCDate(date.getUTCDate() + count);
  return dateKey(date);
};
const weekStart = (value) => addDays(value, -((toDate(value).getUTCDay() + 6) % 7));
const formatDate = (value, options) => toDate(value).toLocaleDateString("ru-RU", { timeZone: "UTC", ...options });
const fullDate = (value) => formatDate(value, { day: "numeric", month: "long", year: "numeric" });
const minutes = (time) => {
  const [hours, mins] = time.split(":").map(Number);
  return hours * 60 + mins;
};

function moscowToday() {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Europe/Moscow", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(new Date());
  const get = (key) => parts.find((part) => part.type === key).value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

function useToday() {
  const [today, setToday] = useState(moscowToday);
  useEffect(() => {
    const update = () => setToday(moscowToday());
    const timer = window.setInterval(update, 60000);
    window.addEventListener("focus", update);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", update);
    };
  }, []);
  return today;
}

function urgency(event, today) {
  return event.urgency ?? (event.date < today ? "overdue" : event.date === today ? "urgent" : "planned");
}

function eventTime(event) {
  if (!event.startTime) return "Весь день";
  if (event.type === "deadline") return `до ${event.startTime}`;
  return event.endTime ? `${event.startTime}–${event.endTime}` : event.startTime;
}

function eventInterval(event) {
  const start = minutes(event.startTime);
  const end = event.endTime ? minutes(event.endTime) : start + 60;
  return { event, start, end: Math.min(1440, Math.max(start + 1, end)) };
}

function layoutEvents(events, hourHeight) {
  const intervals = events.map(eventInterval).map((item) => ({
    ...item, displayEnd: Math.min(1440, Math.max(item.end, item.start + (40 / hourHeight) * 60)),
  })).sort((a, b) => a.start - b.start || a.end - b.end);
  const result = [];
  let group = [];
  let groupEnd = -1;
  function flush() {
    const lanes = [];
    const placed = group.map((item) => {
      let lane = lanes.findIndex((end) => end <= item.start);
      if (lane === -1) lane = lanes.length;
      lanes[lane] = item.displayEnd;
      return { ...item, lane };
    });
    result.push(...placed.map((item) => ({ ...item, lanes: lanes.length })));
    group = [];
  }
  intervals.forEach((item) => {
    if (group.length && item.start >= groupEnd) flush();
    if (!group.length) groupEnd = item.displayEnd;
    group.push(item);
    groupEnd = Math.max(groupEnd, item.displayEnd);
  });
  flush();
  return result;
}

function EventButton({ event, detailed = false, showTime = false, onOpen, style }) {
  return (
    <button
      type="button"
      className={`calendar-event${detailed ? " calendar-event-detailed" : ""}`}
      data-type={event.type}
      style={style}
      aria-label={`${event.institution}, ${event.title}, ${fullDate(event.date)}, ${eventTime(event)}`}
      aria-haspopup="dialog"
      onClick={(click) => onOpen(event, click.currentTarget)}
    >
      {detailed && <span className="calendar-event-time">{eventTime(event)}</span>}
      <strong>{detailed ? event.institution : event.shortInstitution || event.institution}</strong>
      <span>{showTime ? `${eventTime(event)} · ` : ""}{event.title}</span>
      {detailed && <>
        <span>{[event.program, event.product].filter(Boolean).join(" · ")}</span>
        <span>Ответственный: {event.manager || "Не назначен"}</span>
      </>}
    </button>
  );
}

function FloatingPanel({ anchor, title, onClose, children, closing }) {
  const ref = useRef(null);
  const titleId = useId();
  useLayoutEffect(() => {
    const panel = ref.current;
    function position() {
      const rect = anchor.getBoundingClientRect();
      const width = panel.offsetWidth;
      const height = panel.offsetHeight;
      const left = Math.max(12, Math.min(rect.right + 8, window.innerWidth - width - 12));
      const top = Math.max(12, Math.min(rect.top, window.innerHeight - height - 12));
      panel.style.left = `${left}px`;
      panel.style.top = `${top}px`;
    }
    position();
    panel.querySelector("button, select")?.focus({ preventScroll: true });
    const observer = new ResizeObserver(position);
    observer.observe(panel);
    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, true);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", position);
      window.removeEventListener("scroll", position, true);
    };
  }, [anchor]);

  useEffect(() => {
    if (ref.current) ref.current.inert = closing;
    if (closing) return;
    function outside(event) {
      if (!ref.current?.contains(event.target) && !anchor.contains(event.target)) onClose(false);
    }
    function keydown(event) {
      if (event.key === "Escape") { event.preventDefault(); onClose(true); }
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", keydown);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", keydown);
    };
  }, [anchor, onClose, closing]);

  return (
    <section className="calendar-popover calendar-control-motion" data-closing={closing} aria-hidden={closing || undefined} ref={ref} role="dialog" aria-labelledby={titleId}>
      <div className="calendar-popover-heading">
        <h2 id={titleId}>{title}</h2>
        <button className="calendar-close" type="button" aria-label="Закрыть" onClick={() => onClose(true)}><PageIcon name="close" /></button>
      </div>
      {children}
    </section>
  );
}

function MonthView({ date, today, days, events, onOpen, onMore, onDay }) {
  return (
    <div className="calendar-month" role="region" aria-label="Календарь на месяц">
      {weekdays.map((day) => <div className="calendar-weekday" key={day}>{day}</div>)}
      {days.map((day) => {
        const items = events.filter((event) => event.date === day);
        return (
          <div className="calendar-cell" key={day} data-outside={day.slice(0, 7) !== date.slice(0, 7)}>
            <div className="calendar-cell-heading">
              <button type="button" className="calendar-date" data-today={day === today} aria-label={`Открыть день: ${fullDate(day)}`} aria-current={day === today ? "date" : undefined} onClick={() => onDay(day)}>{Number(day.slice(-2))}</button>
              
            </div>
            {items.slice(0, 2).map((event) => <EventButton key={event.id} event={event} onOpen={onOpen} />)}
            {items.length > 2 && <button className="calendar-more" type="button" aria-haspopup="dialog" onClick={(event) => onMore(day, event.currentTarget)}>+{eventCount(items.length - 2)}</button>}
          </div>
        );
      })}
    </div>
  );
}

function TimeView({ days, today, events, view, onOpen, onDay }) {
  const timed = events.filter((event) => event.startTime);
  const start = Math.min(8, ...timed.map((event) => Math.floor(minutes(event.startTime) / 60)));
  const end = Math.min(24, Math.max(20, ...timed.map((event) => Math.ceil(eventInterval(event).end / 60))));
  const hourHeight = view === "day" ? 112 : 48;
  const height = (end - start) * hourHeight;
  const hours = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  return (
    <div className={`calendar-time calendar-time-${view}`} style={{ "--calendar-days": days.length, "--hour-height": `${hourHeight}px` }}>
      <div className="calendar-time-head">
        <div />
        {days.map((day) => <div className="calendar-time-date" key={day}>
          <button type="button" className="calendar-date" data-today={day === today} aria-label={`Открыть день: ${fullDate(day)}`} onClick={() => onDay(day)}>{Number(day.slice(-2))}</button>
          <span>{formatDate(day, view === "day" ? { weekday: "long", day: "numeric", month: "long" } : { weekday: "short" })}</span>
          
        </div>)}
      </div>
      <div className="calendar-all-day">
        <span className="calendar-time-label">Весь день</span>
        {days.map((day) => {
          const items = events.filter((event) => event.date === day && !event.startTime);
          return <div className="calendar-all-day-cell" key={day}>
            {items.map((event) => <EventButton key={event.id} event={event} onOpen={onOpen} />)}
            {!items.length && view === "day" && <span className="calendar-muted">Нет событий без точного времени</span>}
          </div>;
        })}
      </div>
      <div className="calendar-time-body" style={{ height }}>
        <div className="calendar-time-axis">
          {hours.map((hour) => <span key={hour} style={{ top: (hour - start) * hourHeight }}>{pad(hour)}:00</span>)}
        </div>
        {days.map((day) => <div className="calendar-time-column" key={day}>
          {layoutEvents(timed.filter((event) => event.date === day), hourHeight).map((item) => (
            <EventButton key={item.event.id} event={item.event} detailed={view === "day"} onOpen={onOpen} style={{
              position: "absolute",
              top: ((item.start - start * 60) / 60) * hourHeight + 2,
              height: ((item.displayEnd - item.start) / 60) * hourHeight - 4,
              left: `calc(${(item.lane / item.lanes) * 100}% + 4px)`,
              width: `calc(${100 / item.lanes}% - 8px)`,
            }} />
          ))}
        </div>)}
      </div>
    </div>
  );
}

/**
 * events: id, date (YYYY-MM-DD, МСК), type (deadline/license/training), title,
 * institution, shortInstitution, program, product, manager, city,
 * startTime/endTime (HH:mm, МСК; без startTime — весь день), interactionId.
 * События через полночь передаются отдельными записями для каждого дня.
 * onOpenInteraction(event) подключается к существующей главной странице.
 */
export default function CalendarPage({ events = emptyEvents, initialDate, filterOptions = {}, onOpenInteraction, loading = false, error = "" }) {
  const { theme } = useAppTheme();
  const today = useToday();
  const [date, setDate] = useState(() => initialDate || moscowToday());
  const [view, setView] = useState("month");
  const [profileOpen, setProfileOpen] = useState(false);
  const [filters, setFilters] = useState(emptyFilters);
  const [draft, setDraft] = useState(emptyFilters);
  const [popup, setPopup, closing] = useAnimatedState();

  const closePopup = useCallback((restoreFocus = true) => {
    if (restoreFocus) popup?.anchor?.focus();
    setPopup(null);
  }, [popup, setPopup]);

  const options = useMemo(() => {
    const result = {};
    for (const key of ["program", "product", "manager", "institution", "city"]) {
      result[key] = [...new Set(events.map((event) => event[key]).filter(Boolean))].sort((a, b) => a.localeCompare(b, "ru"));
    }
    return result;
  }, [events]);

  const firstOfMonth = `${date.slice(0, 7)}-01`;
  const nextMonth = new Date(Date.UTC(toDate(date).getUTCFullYear(), toDate(date).getUTCMonth() + 1, 1, 12));
  const lastOfMonth = addDays(dateKey(nextMonth), -1);
  const from = view === "month" ? weekStart(firstOfMonth) : view === "week" ? weekStart(date) : date;
  const to = view === "month" ? addDays(weekStart(lastOfMonth), 6) : view === "week" ? addDays(from, 6) : date;
  const days = Array.from({ length: Math.round((toDate(to) - toDate(from)) / 86400000) + 1 }, (_, i) => addDays(from, i));

  const filtered = events.filter((event) => Object.entries(filters).every(([key, value]) => !value.length || value.includes(key === "urgency" ? urgency(event, today) : event[key])));
  const visible = filtered.filter((event) => event.date >= from && event.date <= to);
  const hasEvents = view === "month" ? visible.some((event) => event.date.slice(0, 7) === date.slice(0, 7)) : visible.length > 0;
  const hasFilters = Object.values(filters).some(value => value.length > 0);
  const extraCount = [filters.institution, filters.city, filters.urgency].filter(value => value.length > 0).length;
  const title = view === "month" ? formatDate(date, { month: "long", year: "numeric" }).replace(/ г\.$/, "")
    : view === "day" ? fullDate(date)
      : from.slice(0, 7) === to.slice(0, 7) ? `${Number(from.slice(-2))}–${fullDate(to)}` : `${fullDate(from)} — ${fullDate(to)}`;

  function changeFilter(key, value) { setFilters((previous) => ({ ...previous, [key]: value })); setPopup(null); }
  function openEvent(event, anchor) { setPopup({ kind: "event", event, anchor }); }
  function openDay(day) { setDate(day); setView("day"); setPopup(null); }
  function resetFilters() { setFilters(emptyFilters); setPopup(null); }
  function move(direction) {
    if (view === "month") {
      const current = toDate(firstOfMonth);
      current.setUTCMonth(current.getUTCMonth() + direction);
      setDate(dateKey(current));
    } else setDate(addDays(date, direction * (view === "week" ? 7 : 1)));
    setPopup(null);
  }

  return (
    <div className="calendar-page" data-theme={theme}>
      <Header activePage="Календарь" profileOpen={profileOpen} setProfileOpen={setProfileOpen} dark={theme === "dark"} setDark={(value) => setAppTheme((typeof value === "function" ? value(theme === "dark") : value) ? "dark" : "light")} />
      <main className="calendar-main">
        <h1>Календарь</h1>
        <p className="calendar-subtitle">Сроки, события и активности по взаимодействиям с учебными заведениями</p>
        <div className="calendar-toolbar">
          <div className="calendar-segments" role="group" aria-label="Вид календаря">
            {[["month", "Месяц"], ["week", "Неделя"], ["day", "День"]].map(([key, label]) => <button key={key} type="button" aria-pressed={view === key} onClick={() => { setView(key); setPopup(null); }}>{label}</button>)}
          </div>
          <div className="calendar-navigation">
            <button className="calendar-button calendar-arrow" type="button" aria-label="Предыдущий период" onClick={() => move(-1)}><PageIcon name="left" /></button>
            <span className="calendar-period" aria-live="polite">{title}</span>
            <button className="calendar-button calendar-arrow" type="button" aria-label="Следующий период" onClick={() => move(1)}><PageIcon name="right" /></button>
            <button className="calendar-button" type="button" onClick={() => { setDate(today); setPopup(null); }}>{view === "month" ? "Текущий месяц" : view === "week" ? "Текущая неделя" : "Текущий день"}</button>
          </div>
        </div>
        <div className="calendar-filters">
          {[["program", "ИТ-направление"], ["product", "ИТ-продукт"], ["manager", "Ответственный КАМ"]].map(([key, label]) => <SelectFilter key={key} label={label} options={filterOptions[key] ?? options[key]} value={filters[key]} onChange={(value) => changeFilter(key, value)} />)}
          <SelectFilter label="Тип события" options={Object.entries(types).map(([value, label]) => ({ value, label }))} value={filters.type} onChange={(value) => changeFilter("type", value)} />
          <button className="calendar-button" type="button" aria-haspopup="dialog" aria-expanded={popup?.kind === "filters" && !closing} onClick={(event) => { setDraft(filters); setPopup({ kind: "filters", anchor: event.currentTarget }); }}>Ещё фильтры{extraCount ? ` · ${extraCount}` : ""}</button>
          {hasFilters && <button className="calendar-reset" type="button" onClick={resetFilters}>Сбросить фильтры</button>}
        </div>
        <div className="calendar-legend">
          {Object.entries(types).map(([key, label]) => <span className="calendar-legend-item" data-type={key} key={key}>{label}</span>)}
          <span className="calendar-timezone">Время московское</span>
        </div>
        <div aria-busy={loading}>
          {loading ? <div className="calendar-empty" role="status">Загружаем события…</div>
            : error ? <div className="calendar-empty" role="alert"><h2>Не удалось загрузить календарь</h2><p>{error}</p></div>
              : !hasEvents ? <div className="calendar-empty"><h2>На выбранный период событий нет</h2><p>Измените период или параметры фильтрации</p><button className="calendar-button" type="button" onClick={resetFilters}>Сбросить фильтры</button></div>
                : <div className="calendar-scroll" role="region" aria-label="События календаря" tabIndex={0}>
                  {view === "month" ? <MonthView date={date} today={today} days={days} events={visible} onOpen={openEvent} onDay={openDay} onMore={(day, anchor) => setPopup({ kind: "list", day, anchor })} />
                    : <TimeView days={days} today={today} events={visible} view={view} onOpen={openEvent} onDay={openDay} />}
                </div>}
        </div>
      </main>
      {popup && <FloatingPanel closing={closing} key={popup.kind} anchor={popup.anchor} onClose={closePopup} title={popup.kind === "filters" ? "Ещё фильтры" : popup.kind === "list" ? fullDate(popup.day) : popup.event.title}>
        {popup.kind === "filters" ? <form className="calendar-extra-filters" onSubmit={(event) => { event.preventDefault(); setFilters(draft); closePopup(); }}>
          {[["institution", "Учреждение"], ["city", "Город"], ["urgency", "Статус срочности"]].map(([key, label]) => <SelectFilter key={key} label={label} value={draft[key]} options={key === "urgency" ? Object.entries(statuses).map(([value, text]) => ({ value, label: text })) : filterOptions[key] ?? options[key]} onChange={(value) => setDraft((previous) => ({ ...previous, [key]: value }))} />)}
          <div className="calendar-filter-actions"><button type="button" className="calendar-button" onClick={() => setDraft((previous) => ({ ...previous, institution: [], city: [], urgency: [] }))}>Сбросить</button><button className="calendar-button calendar-primary" type="submit">Применить</button></div>
        </form> : popup.kind === "list" ? <div className="calendar-event-list">
          {visible.filter((event) => event.date === popup.day).sort((a, b) => (a.startTime || "").localeCompare(b.startTime || "")).map((event) => <EventButton key={event.id} event={event} showTime onOpen={(item) => openEvent(item, popup.anchor)} />)}
        </div> : <div className="calendar-details">
          <div><span className="calendar-detail-label">Учреждение</span><p>{popup.event.institution}</p><p className="calendar-muted">{[popup.event.program, popup.event.product].filter(Boolean).join(" · ")}</p></div>
          <div><span className="calendar-detail-label">Ответственный КАМ</span><p>{popup.event.manager || "Не назначен"}</p></div>
          <div><p>{fullDate(popup.event.date)}</p><p className="calendar-muted">{eventTime(popup.event)}{popup.event.startTime ? " · МСК" : ""}</p></div>
          <span className="calendar-status" data-status={urgency(popup.event, today)}>{statuses[urgency(popup.event, today)]}</span>
          <button className="calendar-button calendar-primary" type="button" disabled={!onOpenInteraction} title={!onOpenInteraction ? "Переход к взаимодействию пока не подключён" : undefined} onClick={() => { onOpenInteraction(popup.event); closePopup(false); }}>Открыть взаимодействие</button>
        </div>}
      </FloatingPanel>}
    </div>
  );
}
