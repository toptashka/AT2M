import { useRef, useState } from "react";
import { Select, Field } from "./WorkspaceUI";
import {
  OWNERS,
  PROGRAMS,
  PRODUCTS,
  INITIAL_FILTERS,
  selection,
} from "./workspaceModel";

const iso = (date) =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");

export function ProductFilter({ value, onChange }) {
  return (
    <Select
      multiple
      allMeansEmpty
      menuTitle="ИТ-продукты"
      label="Все продукты"
      allLabel="Все продукты"
      searchPlaceholder="Поиск продуктов"
      value={selection(value)}
      options={PRODUCTS}
      onChange={onChange}
    />
  );
}

export function PeriodFilter({ value, onChange }) {
  const ref = useRef(null);
  const [draft, setDraft] = useState(value);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  function pick(day) {
    if (!draft.start || draft.end) {
      setDraft({ start: day, end: "" });
    } else {
      setDraft({
        start: day < draft.start ? day : draft.start,
        end: day < draft.start ? draft.start : day,
      });
    }
  }

  function preset(kind) {
    const today = new Date();
    const y = today.getFullYear();
    const m = today.getMonth();

    let start;
    let end;

    if (kind === 0) {
      start = new Date(y, m, 1);
      end = new Date(y, m + 1, 0);
    }

    if (kind === 1) {
      start = new Date(y, m - 1, 1);
      end = new Date(y, m, 0);
    }

    if (kind === 2) {
      start = new Date(y, Math.floor(m / 3) * 3, 1);
      end = new Date(y, Math.floor(m / 3) * 3 + 3, 0);
    }

    if (kind === 3) {
      start = new Date(m < 8 ? y - 1 : y, 8, 1);
      end = new Date(start.getFullYear() + 1, 7, 31);
    }

    setDraft({ start: iso(start), end: iso(end) });
    setMonth(start.getMonth());
    setYear(start.getFullYear());
  }

  return (
    <details ref={ref} className="at-select aw-period">
      <summary onClick={() => setDraft(value)}>
        <span>
          {value.start
            ? value.start.split("-").reverse().join(".") +
              " — " +
              value.end.split("-").reverse().join(".")
            : "Период"}
        </span>

        <i className="at-chevron" />
      </summary>

      <div className="aw-calendar at-options">
        <div className="aw-presets">
          {[
            "Текущий месяц",
            "Прошлый месяц",
            "Квартал",
            "Учебный год",
          ].map((name, index) => (
            <button
              type="button"
              key={name}
              onClick={() => preset(index)}
            >
              {name}
            </button>
          ))}
        </div>

        <div className="aw-months">
          {[0, 1].map((offset) => {
            const first = new Date(year, month + offset, 1);
            const blank = (first.getDay() + 6) % 7;

            const days = new Date(
              first.getFullYear(),
              first.getMonth() + 1,
              0
            ).getDate();

            return (
              <div key={offset}>
                <div className="aw-month-title">
                  <button
                    type="button"
                    className="at-icon"
                    aria-label="Предыдущий месяц"
                    onClick={() => setMonth(month - 1)}
                  >
                    ‹
                  </button>

                  <strong>
                    {first.toLocaleDateString("ru-RU", {
                      month: "long",
                      year: "numeric",
                    })}
                  </strong>

                  <button
                    type="button"
                    className="at-icon"
                    aria-label="Следующий месяц"
                    onClick={() => setMonth(month + 1)}
                  >
                    ›
                  </button>
                </div>

                <div className="aw-days">
                  {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map(
                    (day) => <small key={day}>{day}</small>
                  )}

                  {Array.from({ length: blank }, (_, index) => (
                    <span key={"blank-" + index} />
                  ))}

                  {Array.from({ length: days }, (_, index) => {
                    const day = iso(
                      new Date(
                        first.getFullYear(),
                        first.getMonth(),
                        index + 1
                      )
                    );

                    const selected =
                      day === draft.start || day === draft.end;

                    const inRange =
                      day > draft.start && day < draft.end;

                    return (
                      <button
                        type="button"
                        key={day}
                        onClick={() => pick(day)}
                        aria-label={day}
                        aria-pressed={selected}
                        className={
                          selected
                            ? "selected"
                            : inRange
                              ? "range"
                              : ""
                        }
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="at-form-actions">
          <button
            type="button"
            className="at-button"
            onClick={() => {
              onChange({ start: "", end: "" });
              ref.current.removeAttribute("open");
            }}
          >
            Сбросить
          </button>

          <button
            type="button"
            className="at-button primary"
            disabled={!draft.start || !draft.end}
            onClick={() => {
              onChange(draft);
              ref.current.removeAttribute("open");
            }}
          >
            Применить
          </button>
        </div>
      </div>
    </details>
  );
}

export default function WorkspaceFilters({
  value,
  onChange,
  interactions,
}) {
  const change = (key, next) =>
    onChange({ ...value, [key]: next });

  const institutions = [
    ...new Set(interactions.map((item) => item.name)),
  ];

  const cities = [
    ...new Set(
      interactions.map((item) => item.city).filter(Boolean)
    ),
  ];

  return (
    <div className="aw-toolbar">
      <input
        className="at-input"
        placeholder="Поиск"
        aria-label="Поиск взаимодействий"
        value={value.search}
        onChange={(event) =>
          change("search", event.target.value)
        }
      />

      <Select
        multiple
        allMeansEmpty
        value={selection(value.direction)}
        label="IT направления"
        allLabel="Все направления"
        searchPlaceholder="Поиск направлений"
        options={PROGRAMS}
        onChange={(next) => change("direction", next)}
      />

      <ProductFilter
        value={value.products}
        onChange={(next) => change("products", next)}
      />

      <Select
        multiple
        allMeansEmpty
        value={selection(value.status)}
        label="Все статусы"
        allLabel="Все статусы"
        searchPlaceholder="Поиск статусов"
        options={[
          "В работе",
          "Требует внимания",
          "Просрочено",
          "Завершено",
        ]}
        onChange={(next) => change("status", next)}
      />

      <Select
        multiple
        allMeansEmpty
        value={selection(value.owner)}
        label="Ответственный КАМ"
        allLabel="Все ответственные"
        searchPlaceholder="Поиск сотрудников"
        options={OWNERS}
        onChange={(next) => change("owner", next)}
      />

      <PeriodFilter
        value={{
          start: value.start,
          end: value.end,
        }}
        onChange={(next) => onChange({ ...value, ...next })}
      />

      <details className="at-select aw-extra">
        <summary>
          Ещё фильтры
          <i className="at-chevron" />
        </summary>

        <div className="at-options">
          <Select
            multiple
            allMeansEmpty
            value={selection(value.institution)}
            label="Учреждение"
            allLabel="Все учреждения"
            searchPlaceholder="Поиск учреждений"
            options={institutions}
            onChange={(next) => change("institution", next)}
          />

          <Select
            multiple
            allMeansEmpty
            value={selection(value.city)}
            label="Город"
            allLabel="Все города"
            searchPlaceholder="Поиск городов"
            options={cities}
            onChange={(next) => change("city", next)}
          />

          <Field label="Дата изменения">
            <input
              className="at-input"
              type="date"
              value={value.changed}
              onChange={(event) =>
                change("changed", event.target.value)
              }
            />
          </Field>

          <button
            type="button"
            onClick={() => onChange(INITIAL_FILTERS)}
          >
            Сбросить фильтры
          </button>
        </div>
      </details>
    </div>
  );
}