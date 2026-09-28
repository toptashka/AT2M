import { useEffect, useId, useRef, useState } from "react";
import { Popover, Select } from "./WorkspaceUI";
import arrowLeft from "../../assets/ArrowLeft.svg";
import arrowRight from "../../assets/ArrowRight.svg";

const months = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];
const weekdays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const pad = (value) => String(value).padStart(2, "0");

function dateAt(year, month, day) {
  const result = new Date(2000, 0, 1, 12);
  result.setFullYear(year, month, day);
  return result;
}

function toISO(date) {
  return `${String(date.getFullYear()).padStart(4, "0")}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parseISO(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (year < 1 || year > 9999) return null;
  const date = dateAt(year, month - 1, day);
  return toISO(date) === value ? date : null;
}

function formatISO(value) {
  return parseISO(value) ? value.split("-").reverse().join(".") : "";
}

function parseText(value) {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value);
  if (!match) return null;
  const iso = `${match[3]}-${match[2]}-${match[1]}`;
  return parseISO(iso) ? iso : null;
}

function DateCalendar({ value, onChange, close }) {
  const [month, setMonth] = useState(() => {
    const initial = parseISO(value) || new Date();
    return dateAt(initial.getFullYear(), initial.getMonth(), 1);
  });
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const first = (month.getDay() + 6) % 7;
  const count = dateAt(year, monthIndex + 1, 0).getDate();
  const today = toISO(new Date());
  const years = Array.from(
    { length: Math.min(9999, Math.max(2100, year + 50)) - Math.max(1, Math.min(1900, year - 50)) + 1 },
    (_, index) => {
      const next = Math.max(1, Math.min(1900, year - 50)) + index;
      return { value: next, label: String(next) };
    },
  );

  function choose(next) {
    onChange(next);
    close();
  }

  return (
    <div className="aw-single-date-calendar">
      <div className="aw-single-date-heading">
        <button
          type="button"
          className="at-icon"
          aria-label="Предыдущий месяц"
          disabled={year === 1 && monthIndex === 0}
          onClick={() => setMonth(dateAt(year, monthIndex - 1, 1))}
        >
          <span className="aw-single-date-icon" style={{ "--date-icon": `url("${arrowLeft}")` }} aria-hidden="true" />
        </button>
        <strong aria-live="polite">{months[monthIndex]} {year}</strong>
        <button
          type="button"
          className="at-icon"
          aria-label="Следующий месяц"
          disabled={year === 9999 && monthIndex === 11}
          onClick={() => setMonth(dateAt(year, monthIndex + 1, 1))}
        >
          <span className="aw-single-date-icon" style={{ "--date-icon": `url("${arrowRight}")` }} aria-hidden="true" />
        </button>
      </div>
      <div className="aw-single-date-selectors">
        <Select
          inline
          label="Месяц"
          value={monthIndex}
          options={months.map((label, value) => ({ label, value }))}
          onChange={(next) => setMonth(dateAt(year, next, 1))}
        />
        <Select
          inline
          searchable
          label="Год"
          searchPlaceholder="Поиск года"
          value={year}
          options={years}
          onChange={(next) => setMonth(dateAt(next, monthIndex, 1))}
        />
      </div>
      <div className="aw-single-date-grid">
        {weekdays.map((day) => <span key={day}>{day}</span>)}
        {Array.from({ length: first }, (_, index) => <span key={`empty-${index}`} />)}
        {Array.from({ length: count }, (_, index) => {
          const day = index + 1;
          const iso = toISO(dateAt(year, monthIndex, day));
          return (
            <button
              key={iso}
              type="button"
              aria-label={formatISO(iso)}
              aria-pressed={value === iso}
              aria-current={today === iso ? "date" : undefined}
              onClick={() => choose(iso)}
            >
              {day}
            </button>
          );
        })}
      </div>
      <div className="aw-single-date-actions">
        <button type="button" className="at-button" onClick={() => choose("")}>Очистить</button>
        <button type="button" className="at-button primary" onClick={() => choose(today)}>Сегодня</button>
      </div>
    </div>
  );
}

export default function DateField({ value = "", onChange, label, inline = false, disabled = false }) {
  const [draft, setDraft] = useState(() => formatISO(value));
  const [touched, setTouched] = useState(false);
  const input = useRef(null);
  const errorId = useId();
  const parsed = parseText(draft);
  const invalid = Boolean(draft && !parsed);
  const error = "Введите существующую дату в формате дд.мм.гггг";

  useEffect(() => {
    setDraft(formatISO(value));
    setTouched(false);
  }, [value]);

  useEffect(() => {
    input.current?.setCustomValidity(invalid ? error : "");
  }, [invalid]);

  function update(next) {
    setDraft(formatISO(next));
    setTouched(false);
    input.current?.setCustomValidity("");
    onChange(next);
  }

  return (
    <div className="aw-date-field">
      <input
        ref={input}
        className="at-input"
        type="text"
        inputMode="numeric"
        lang="ru"
        autoComplete="off"
        placeholder="дд.мм.гггг"
        aria-label={label}
        aria-invalid={touched && invalid ? true : undefined}
        aria-describedby={touched && invalid ? errorId : undefined}
        disabled={disabled}
        value={draft}
        onChange={(event) => {
          const raw = event.target.value;
          const iso = parseISO(raw);
          const text = iso ? formatISO(raw) : /^\d{8}$/.test(raw)
            ? `${raw.slice(0, 2)}.${raw.slice(2, 4)}.${raw.slice(4)}`
            : raw;
          setDraft(text);
          const next = parseText(text);
          event.target.setCustomValidity(text && !next ? error : "");
          if (!text) onChange("");
          else if (next) onChange(next);
        }}
        onInvalid={() => setTouched(true)}
      />
      <Popover
        label={`Выбрать дату: ${label}`}
        summary="Календарь"
        width={300}
        inline={inline}
        disabled={disabled}
        panelClassName="aw-single-date-popup"
      >
        {(close) => <DateCalendar value={value} onChange={update} close={close} />}
      </Popover>
      {touched && invalid && <small id={errorId} className="aw-date-field-error">{error}</small>}
    </div>
  );
}
