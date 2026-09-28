import { useEffect, useId, useRef, useState } from "react";

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

export default function DateField({ value = "", onChange, label, disabled = false }) {
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
      {touched && invalid && <small id={errorId} className="aw-date-field-error">{error}</small>}
    </div>
  );
}
