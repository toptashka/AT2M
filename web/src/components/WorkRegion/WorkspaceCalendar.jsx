import { useEffect, useId, useRef, useState } from "react";
import arrowLeft from "../../assets/ArrowLeft.svg";
import arrowRight from "../../assets/ArrowRight.svg";

const monthNames = [
  "Январь", "Февраль", "Март", "Апрель",
  "Май", "Июнь", "Июль", "Август",
  "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

const years = Array.from({ length: 201 }, (_, i) => 1900 + i);
const pad = (number) => String(number).padStart(2, "0");

function isoDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parseDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? "")) return null;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day, 12);

  return isoDate(date) === value ? date : null;
}

function formatDate(value) {
  const date = parseDate(value);

  return date
    ? `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`
    : "дд.мм.гггг";
}

function PageIcon({ name }) {
  return (
    <img
      className="aw-date-icon"
      src={name === "left" ? arrowLeft : arrowRight}
      alt=""
    />
  );
}

function MonthSelect({
  label,
  value,
  options,
  disabled,
  onChange,
}) {
  const id = useId();
  const root = useRef(null);
  const trigger = useRef(null);
  const list = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const selected = list.current?.querySelector(
      '[aria-selected="true"]'
    );

    selected?.focus({ preventScroll: true });

    if (selected) {
      list.current.scrollTop =
        selected.offsetTop -
        list.current.clientHeight / 2 +
        selected.clientHeight / 2;
    }

    function outside(event) {
      if (!root.current?.contains(event.target)) {
        setOpen(false);
      }
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

    if (
      !["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)
    ) {
      return;
    }

    event.preventDefault();

    if (!open) {
      setOpen(true);
      return;
    }

    const buttons = [
      ...list.current.querySelectorAll('[role="option"]'),
    ];

    const index = buttons.indexOf(document.activeElement);

    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? buttons.length - 1
          : Math.max(
              0,
              Math.min(
                buttons.length - 1,
                index + (event.key === "ArrowDown" ? 1 : -1)
              )
            );

    buttons[next]?.focus({ preventScroll: true });
    buttons[next]?.scrollIntoView({ block: "nearest" });
  }

  return (
    <div
      className="aw-date-month-select"
      ref={root}
      onKeyDown={handleKey}
    >
      <button
        type="button"
        className="aw-date-month-select-trigger"
        ref={trigger}
        disabled={disabled}
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => setOpen((previous) => !previous)}
      >
        {options.find((option) => option.value === value)?.label}
      </button>

      {open && (
        <div
          className="aw-date-month-options"
          id={id}
          role="listbox"
          aria-label={label}
          ref={list}
        >
          {options.map((option) => (
            <button
              type="button"
              role="option"
              key={option.value}
              aria-selected={option.value === value}
              tabIndex={-1}
              onClick={() => choose(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function WorkspaceCalendar({
  from,
  to,
  onApply,
  onReset,
  disabled = false,
}) {
  const id = useId();
  const seed = parseDate(from) ?? new Date();

  const [baseMonth, setBaseMonth] = useState(
    () => new Date(seed.getFullYear(), seed.getMonth(), 1, 12)
  );

  const [draft, setDraft] = useState({ from, to });
  const [choosingEnd, setChoosingEnd] = useState(false);
  const [hovered, setHovered] = useState("");
  const [focused, setFocused] = useState("");

  const today = isoDate(new Date());

  useEffect(() => {
    if (focused) {
      document
        .getElementById(`${id}-${focused}`)
        ?.focus({ preventScroll: true });
    }
  }, [focused, baseMonth, id]);

  function changeMonth(date) {
    const first = new Date(1900, 0, 1, 12);
    const last = new Date(2100, 10, 1, 12);

    setBaseMonth(
      date < first ? first : date > last ? last : date
    );

    setFocused("");
  }

  function moveMonth(delta) {
    changeMonth(
      new Date(
        baseMonth.getFullYear(),
        baseMonth.getMonth() + delta,
        1,
        12
      )
    );
  }

  function selectDate(value) {
    if (disabled) return;

    if (!choosingEnd) {
      setDraft({ from: value, to: "" });
      setChoosingEnd(true);
      setHovered("");
      return;
    }

    onApply({
      from: value < draft.from ? value : draft.from,
      to: value < draft.from ? draft.from : value,
    });
  }

  function preset(type) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    let start;
    let end;

    if (type === "current") {
      start = new Date(year, month, 1, 12);
      end = new Date(year, month + 1, 0, 12);
    }

    if (type === "previous") {
      start = new Date(year, month - 1, 1, 12);
      end = new Date(year, month, 0, 12);
    }

    if (type === "quarter") {
      const first = Math.floor(month / 3) * 3;
      start = new Date(year, first, 1, 12);
      end = new Date(year, first + 3, 0, 12);
    }

    if (type === "academic") {
      const first = month >= 8 ? year : year - 1;
      start = new Date(first, 8, 1, 12);
      end = new Date(first + 1, 8, 0, 12);
    }

    onApply({
      from: isoDate(start),
      to: isoDate(end),
    });
  }

  function dayKey(event, value) {
    const date = parseDate(value);
    const weekday = (date.getDay() + 6) % 7;

    const delta = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
      Home: -weekday,
      End: 6 - weekday,
    }[event.key];

    if (
      delta === undefined &&
      !["PageUp", "PageDown"].includes(event.key)
    ) {
      return;
    }

    event.preventDefault();

    if (delta !== undefined) {
      date.setDate(date.getDate() + delta);
    } else {
      const day = date.getDate();

      date.setDate(1);
      date.setMonth(
        date.getMonth() + (event.key === "PageUp" ? -1 : 1)
      );

      date.setDate(
        Math.min(
          day,
          new Date(
            date.getFullYear(),
            date.getMonth() + 1,
            0
          ).getDate()
        )
      );
    }

    if (
      date.getFullYear() < 1900 ||
      date.getFullYear() > 2100
    ) {
      return;
    }

    const monthOffset =
      (date.getFullYear() - baseMonth.getFullYear()) * 12 +
      date.getMonth() -
      baseMonth.getMonth();

    if (monthOffset < 0 || monthOffset > 1) {
      setBaseMonth(
        new Date(
          date.getFullYear(),
          date.getMonth() - (monthOffset > 1 ? 1 : 0),
          1,
          12
        )
      );
    }

    setFocused(isoDate(date));
  }

  const previewEnd = choosingEnd
    ? hovered || draft.from
    : draft.to;

  const rangeStart =
    draft.from < previewEnd ? draft.from : previewEnd;

  const rangeEnd =
    draft.from < previewEnd ? previewEnd : draft.from;

  return (
    <div className="aw-date-calendar">
      <div className="aw-date-presets">
        {[
          ["current", "Текущий месяц"],
          ["previous", "Прошлый месяц"],
          ["quarter", "Квартал"],
          ["academic", "Учебный год"],
        ].map(([key, label]) => (
          <button
            type="button"
            disabled={disabled}
            key={key}
            onClick={() => preset(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="aw-date-calendar-months">
        {[0, 1].map((offset) => {
          const month = new Date(
            baseMonth.getFullYear(),
            baseMonth.getMonth() + offset,
            1,
            12
          );

          const year = month.getFullYear();
          const monthIndex = month.getMonth();
          const blanks = (month.getDay() + 6) % 7;

          const count = new Date(
            year,
            monthIndex + 1,
            0
          ).getDate();

          const cells = Array.from(
            { length: Math.ceil((blanks + count) / 7) * 7 },
            (_, index) =>
              index >= blanks && index < blanks + count
                ? index - blanks + 1
                : null
          );

          return (
            <section
              className="aw-date-calendar-month"
              key={offset}
              aria-label={`${monthNames[monthIndex]} ${year}`}
            >
              <div className="aw-date-month-heading">
                <button
                  className="aw-date-calendar-arrow"
                  type="button"
                  disabled={
                    disabled ||
                    (baseMonth.getFullYear() === 1900 &&
                      baseMonth.getMonth() === 0)
                  }
                  aria-label={`Предыдущий месяц, календарь ${offset + 1}`}
                  onClick={() => moveMonth(-1)}
                >
                  <PageIcon name="left" />
                </button>

                <div className="aw-date-month-selects">
                  <MonthSelect
                    label={`Месяц, календарь ${offset + 1}`}
                    value={monthIndex}
                    disabled={disabled}
                    options={monthNames.map((label, value) => ({
                      value,
                      label,
                    }))}
                    onChange={(value) =>
                      changeMonth(
                        new Date(year, value - offset, 1, 12)
                      )
                    }
                  />

                  <MonthSelect
                    label={`Год, календарь ${offset + 1}`}
                    value={year}
                    disabled={disabled}
                    options={years.map((value) => ({
                      value,
                      label: String(value),
                    }))}
                    onChange={(value) =>
                      changeMonth(
                        new Date(
                          value,
                          monthIndex - offset,
                          1,
                          12
                        )
                      )
                    }
                  />
                </div>

                <button
                  className="aw-date-calendar-arrow"
                  type="button"
                  disabled={
                    disabled ||
                    (baseMonth.getFullYear() === 2100 &&
                      baseMonth.getMonth() >= 10)
                  }
                  aria-label={`Следующий месяц, календарь ${offset + 1}`}
                  onClick={() => moveMonth(1)}
                >
                  <PageIcon name="right" />
                </button>
              </div>

              <div
                role="grid"
                aria-label={`${monthNames[monthIndex]} ${year}`}
                className="aw-date-calendar-grid"
              >
                <div
                  role="row"
                  className="aw-date-calendar-week"
                >
                  {["пн", "вт", "ср", "чт", "пт", "сб", "вс"].map(
                    (day) => (
                      <span role="columnheader" key={day}>
                        {day}
                      </span>
                    )
                  )}
                </div>

                {Array.from(
                  { length: cells.length / 7 },
                  (_, week) => (
                    <div
                      role="row"
                      className="aw-date-calendar-week"
                      key={week}
                    >
                      {cells
                        .slice(week * 7, week * 7 + 7)
                        .map((day, index) => {
                          if (!day) {
                            return (
                              <span
                                role="gridcell"
                                key={`blank-${index}`}
                              />
                            );
                          }

                          const value =
                            `${year}-${pad(monthIndex + 1)}-${pad(day)}`;

                          const endpoint =
                            value === draft.from ||
                            value === draft.to;

                          const inRange = Boolean(
                            rangeStart &&
                              rangeEnd &&
                              value >= rangeStart &&
                              value <= rangeEnd
                          );

                          const startDate = parseDate(draft.from);

                          const initialDay =
                            startDate?.getMonth() === monthIndex &&
                            startDate?.getFullYear() === year
                              ? startDate.getDate()
                              : 1;

                          return (
                            <button
                              type="button"
                              role="gridcell"
                              id={`${id}-${value}`}
                              key={day}
                              disabled={disabled}
                              tabIndex={
                                focused
                                  ? focused === value
                                    ? 0
                                    : -1
                                  : day === initialDay
                                    ? 0
                                    : -1
                              }
                              aria-label={formatDate(value)}
                              aria-selected={endpoint || inRange}
                              aria-current={
                                value === today ? "date" : undefined
                              }
                              data-endpoint={endpoint}
                              data-in-range={inRange}
                              onMouseEnter={() => {
                                if (choosingEnd) {
                                  setHovered(value);
                                }
                              }}
                              onKeyDown={(event) =>
                                dayKey(event, value)
                              }
                              onClick={() => selectDate(value)}
                            >
                              {day}
                            </button>
                          );
                        })}
                    </div>
                  )
                )}
              </div>
            </section>
          );
        })}

        <div className="aw-date-calendar-footer">
          <span role="status">
            {choosingEnd
              ? "Выберите дату окончания"
              : "Выберите начало и конец периода"}
          </span>

          <button
            type="button"
            className="aw-date-text-button"
            disabled={disabled}
            onClick={() => {
              setDraft({ from: "", to: "" });
              setChoosingEnd(false);
              setHovered("");
              setFocused("");
              onReset();
            }}
          >
            Сбросить период
          </button>
        </div>
      </div>
    </div>
  );
}