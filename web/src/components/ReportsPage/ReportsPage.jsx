import { useEffect, useId, useMemo, useRef, useState } from "react";
import { setAppTheme, useAppTheme } from "../../theme";
import Header from "../Header/Header";
import "./ReportsPage.css";

const columns = [
  { key: "institution", label: "Учреждение", width: 240 },
  { key: "city", label: "Город", width: 160 },
  { key: "program", label: "ИТ-программа", width: 224 },
  { key: "product", label: "ИТ-продукт", width: 112 },
  { key: "manager", label: "Ответственный КАМ", width: 192 },
  { key: "stage", label: "Текущий этап", width: 336 },
  { key: "status", label: "Статус", width: 176 },
  { key: "startDate", label: "Дата начала", width: 144 },
  { key: "dueDate", label: "Срок этапа", width: 144 },
  { key: "updatedAt", label: "Последнее изменение", width: 192 },
];

const defaultColumns = [
  "institution",
  "program",
  "product",
  "manager",
  "stage",
  "status",
];

const emptyFilters = {
  from: "",
  to: "",
  institutions: [],
  programs: [],
  managers: [],
};

const emptyRecords = [];
const pageSize = 5;
const dateKeys = new Set(["startDate", "dueDate", "updatedAt"]);

function formatDate(value) {
  if (!value) return "—";

  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);

  return match
    ? `${match[3]}.${match[2]}.${match[1]}`
    : String(value);
}

function recordCount(count) {
  const last = count % 10;
  const lastTwo = count % 100;

  const word =
    last === 1 && lastTwo !== 11
      ? "запись"
      : last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)
        ? "записи"
        : "записей";

  return `${count} ${word}`;
}

function Icon({ name }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {name === "chevron" && <path d="m8 10 4 4 4-4" />}
      {name === "close" && <path d="m7 7 10 10M17 7 7 17" />}
    </svg>
  );
}

function Popover({ label, trigger, className = "", children }) {
  const id = useId();
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const panelRef = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    panelRef.current?.querySelector("input, button")?.focus();

    function dismiss(event) {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleKey(event) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("focusin", dismiss);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("focusin", dismiss);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  function close() {
    setOpen(false);
    document.getElementById(`${id}-trigger`)?.focus();
  }

  return (
    <div
      className={`reports-popover-root ${className}`}
      ref={rootRef}
    >
      <button
        type="button"
        id={`${id}-trigger`}
        ref={buttonRef}
        className="reports-popover-trigger"
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => setOpen((value) => !value)}
      >
        {trigger}
      </button>

      {open && (
        <div
          className="reports-popover"
          ref={panelRef}
          id={id}
          role="dialog"
          aria-label={label}
        >
          {children(close)}
        </div>
      )}
    </div>
  );
}

function MultiSelect({
  label,
  placeholder,
  options,
  selected,
  onChange,
}) {
  const summary = selected.length
    ? `${selected[0]}${
        selected.length > 1 ? ` + ещё ${selected.length - 1}` : ""
      }`
    : placeholder;

  return (
    <div className="reports-field">
      <span className="reports-label">{label}</span>

      <Popover
        label={label}
        trigger={
          <>
            <span className="reports-select-summary">{summary}</span>
            <Icon name="chevron" />
          </>
        }
      >
        {() => (
          <>
            <div className="reports-options">
              {options.length ? (
                options.map((option) => (
                  <label className="reports-check" key={option}>
                    <input
                      type="checkbox"
                      checked={selected.includes(option)}
                      onChange={() =>
                        onChange(
                          selected.includes(option)
                            ? selected.filter((item) => item !== option)
                            : [...selected, option],
                        )
                      }
                    />
                    <span>{option}</span>
                  </label>
                ))
              ) : (
                <p className="reports-muted">
                  Нет доступных вариантов
                </p>
              )}
            </div>

            <button
              type="button"
              className="reports-text-button"
              onClick={() => onChange([])}
            >
              Сбросить выбор
            </button>
          </>
        )}
      </Popover>
    </div>
  );
}

function Pagination({ page, count, onChange }) {
  const pages =
    count <= 7
      ? Array.from({ length: count }, (_, index) => index + 1)
      : [
          ...new Set(
            [1, count, page - 1, page, page + 1].filter(
              (value) => value >= 1 && value <= count,
            ),
          ),
        ].sort((a, b) => a - b);

  const items = [];

  pages.forEach((value, index) => {
    if (index && value - pages[index - 1] > 1) {
      items.push(
        <span className="reports-page-gap" key={`gap-${value}`}>
          …
        </span>,
      );
    }

    items.push(
      <button
        type="button"
        key={value}
        aria-label={`Страница ${value}`}
        aria-current={page === value ? "page" : undefined}
        onClick={() => onChange(value)}
      >
        {value}
      </button>,
    );
  });

  return (
    <nav className="reports-pagination" aria-label="Страницы отчёта">
      <button
        type="button"
        aria-label="Предыдущая страница"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        ‹
      </button>

      {items}

      <button
        type="button"
        aria-label="Следующая страница"
        disabled={page === count}
        onClick={() => onChange(page + 1)}
      >
        ›
      </button>
    </nav>
  );
}

export default function ReportsPage({
  records = emptyRecords,
  initialFilters = emptyFilters,
  filterOptions = {},
  loading = false,
  error = "",
  onExport,
}) {
  const { theme } = useAppTheme();
  const id = useId();

  const [profileOpen, setProfileOpen] = useState(false);
  const [filters, setFilters] = useState(() => ({
    ...emptyFilters,
    ...initialFilters,
  }));
  const [selectedColumns, setSelectedColumns] = useState(defaultColumns);
  const [page, setPage] = useState(1);
  const [exporting, setExporting] = useState("");
  const [exportError, setExportError] = useState("");

  const exportLock = useRef(false);

  const options = useMemo(() => {
    const values = (key) =>
      [...new Set(records.map((row) => row[key]).filter(Boolean))].sort(
        (a, b) => a.localeCompare(b, "ru"),
      );

    return {
      institutions: values("institution"),
      programs: values("program"),
      managers: values("manager"),
    };
  }, [records]);

  const ready = Boolean(filters.from && filters.to);
  const invalidPeriod = ready && filters.from > filters.to;

  const filtered = useMemo(() => {
    if (!ready || invalidPeriod) return [];

    return records.filter((row) => {
      const date = String(row.startDate ?? "").slice(0, 10);

      return (
        date >= filters.from &&
        date <= filters.to &&
        (!filters.institutions.length ||
          filters.institutions.includes(row.institution)) &&
        (!filters.programs.length ||
          filters.programs.includes(row.program)) &&
        (!filters.managers.length ||
          filters.managers.includes(row.manager))
      );
    });
  }, [records, filters, ready, invalidPeriod]);

  const visibleColumns = columns.filter((column) =>
    selectedColumns.includes(column.key),
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const activePage = Math.min(page, pageCount);
  const first = (activePage - 1) * pageSize;
  const pageRows = filtered.slice(first, first + pageSize);

  const canExport =
    Boolean(onExport) &&
    !loading &&
    !error &&
    !exporting &&
    filtered.length > 0 &&
    visibleColumns.length > 0;

  function changeTheme(value) {
    const dark =
      typeof value === "function" ? value(theme === "dark") : value;

    setAppTheme(dark ? "dark" : "light");
  }

  function changeFilter(key, value) {
    setFilters((previous) => ({ ...previous, [key]: value }));
    setPage(1);
    setExportError("");
  }

  function resetFilters() {
    setFilters({ ...emptyFilters });
    setPage(1);
    setExportError("");
  }

  async function exportReport(format) {
    if (!canExport || exportLock.current) return;

    exportLock.current = true;
    setExporting(format);
    setExportError("");

    try {
      const file = await onExport({
        format,
        filters: { ...filters },
        columns: visibleColumns.map(({ key, label }) => ({ key, label })),
        records: [...filtered],
      });

      if (!(file instanceof Blob) || file.size === 0) {
        throw new Error("Empty export");
      }

      const url = URL.createObjectURL(file);
      const link = document.createElement("a");

      link.href = url;
      link.download = `report-${filters.from}-${filters.to}.${format}`;

      document.body.append(link);
      link.click();
      link.remove();

      window.setTimeout(() => URL.revokeObjectURL(url), 30000);
    } catch {
      setExportError(
        "Не удалось экспортировать отчёт. Попробуйте ещё раз.",
      );
    } finally {
      exportLock.current = false;
      setExporting("");
    }
  }

  return (
    <div className="reports-page" data-theme={theme}>
      <Header
        activePage="Отчёты"
        profileOpen={profileOpen}
        setProfileOpen={setProfileOpen}
        dark={theme === "dark"}
        setDark={changeTheme}
      />

      <main className="reports-main">
        <div className="reports-heading">
          <h1>Отчёты</h1>
          <p>
            Формирование и выгрузка данных по взаимодействиям
            с учебными заведениями
          </p>
        </div>

        <section
          className="reports-filter-panel"
          aria-labelledby={`${id}-filters`}
        >
          <h2 id={`${id}-filters`}>Параметры отчёта</h2>

          <div className="reports-filter-grid">
            <fieldset className="reports-period">
              <legend>Период</legend>

              <div className="reports-date-range">
                <label htmlFor={`${id}-from`}>с</label>
                <input
                  id={`${id}-from`}
                  type="date"
                  aria-label="Период с"
                  value={filters.from}
                  max={filters.to || undefined}
                  onChange={(event) =>
                    changeFilter("from", event.target.value)
                  }
                  aria-invalid={invalidPeriod}
                  aria-describedby={
                    invalidPeriod ? `${id}-date-error` : undefined
                  }
                />

                <label htmlFor={`${id}-to`}>по</label>
                <input
                  id={`${id}-to`}
                  type="date"
                  aria-label="Период по"
                  value={filters.to}
                  min={filters.from || undefined}
                  onChange={(event) =>
                    changeFilter("to", event.target.value)
                  }
                  aria-invalid={invalidPeriod}
                  aria-describedby={
                    invalidPeriod ? `${id}-date-error` : undefined
                  }
                />
              </div>
            </fieldset>

            <MultiSelect
              label="Учреждения"
              placeholder="Все учреждения"
              options={filterOptions.institutions ?? options.institutions}
              selected={filters.institutions}
              onChange={(value) => changeFilter("institutions", value)}
            />

            <MultiSelect
              label="ИТ-программы"
              placeholder="Все ИТ-программы"
              options={filterOptions.programs ?? options.programs}
              selected={filters.programs}
              onChange={(value) => changeFilter("programs", value)}
            />

            <MultiSelect
              label="Ответственные КАМы"
              placeholder="Все ответственные"
              options={filterOptions.managers ?? options.managers}
              selected={filters.managers}
              onChange={(value) => changeFilter("managers", value)}
            />
          </div>

          {invalidPeriod && (
            <p
              className="reports-error"
              id={`${id}-date-error`}
              role="alert"
            >
              Дата начала не может быть позже даты окончания.
            </p>
          )}
        </section>

        <section
          className="reports-column-bar"
          aria-label="Настройка колонок"
        >
          <div className="reports-section-heading">
            <h2>Колонки отчёта</h2>
            <span>
              Выбрано {selectedColumns.length} из {columns.length}
            </span>
          </div>

          <Popover
            label="Настроить колонки"
            trigger="Настроить колонки"
            className="reports-column-picker"
          >
            {(close) => (
              <>
                <div className="reports-popover-heading">
                  <h3>Колонки отчёта</h3>
                  <button
                    className="reports-icon-button"
                    type="button"
                    aria-label="Закрыть настройку колонок"
                    onClick={close}
                  >
                    <Icon name="close" />
                  </button>
                </div>

                <div className="reports-options">
                  {columns.map((column) => (
                    <label className="reports-check" key={column.key}>
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes(column.key)}
                        onChange={() =>
                          setSelectedColumns((previous) =>
                            previous.includes(column.key)
                              ? previous.filter(
                                  (key) => key !== column.key,
                                )
                              : [...previous, column.key],
                          )
                        }
                      />
                      <span>{column.label}</span>
                    </label>
                  ))}
                </div>

                <div className="reports-popover-footer">
                  <button
                    type="button"
                    className="reports-text-button"
                    onClick={() =>
                      setSelectedColumns(
                        columns.map((column) => column.key),
                      )
                    }
                  >
                    Выбрать все
                  </button>
                  <button
                    type="button"
                    className="reports-text-button"
                    onClick={() => setSelectedColumns(defaultColumns)}
                  >
                    Сбросить
                  </button>
                </div>
              </>
            )}
          </Popover>
        </section>

        <section
          className="reports-preview"
          aria-labelledby={`${id}-preview`}
          aria-busy={loading}
        >
          <div className="reports-preview-bar">
            <div className="reports-section-heading">
              <h2 id={`${id}-preview`}>Предпросмотр</h2>
              <span aria-live="polite">
                {loading ? "Загрузка…" : recordCount(filtered.length)}
              </span>
            </div>

            <div
              className="reports-export-actions"
              aria-label="Экспорт отчёта"
            >
              {["xlsx", "xls", "pdf"].map((format) => (
                <button
                  key={format}
                  type="button"
                  className={`reports-button${
                    format === "xlsx" ? " reports-button-primary" : ""
                  }`}
                  disabled={!canExport}
                  title={!onExport ? "Экспорт пока не подключён" : undefined}
                  onClick={() => exportReport(format)}
                >
                  {exporting === format
                    ? "Экспортируем…"
                    : `Экспортировать ${format.toUpperCase()}`}
                </button>
              ))}
            </div>
          </div>

          {exportError && (
            <p className="reports-error" role="alert">
              {exportError}
            </p>
          )}

          {loading ? (
            <div className="reports-empty" role="status">
              <h3>Загружаем данные отчёта…</h3>
            </div>
          ) : error ? (
            <div className="reports-empty" role="alert">
              <h3>Не удалось загрузить отчёт</h3>
              <p>{error}</p>
            </div>
          ) : !ready || invalidPeriod ? (
            <div className="reports-empty reports-empty-initial">
              <h3>Настройте параметры отчёта, чтобы увидеть данные</h3>
              <p>Укажите период и выберите нужные фильтры</p>
            </div>
          ) : !filtered.length ? (
            <div className="reports-empty">
              <h3>По выбранным параметрам данные не найдены</h3>
              <p>Измените период или параметры фильтрации</p>
              <button
                type="button"
                className="reports-button"
                onClick={resetFilters}
              >
                Сбросить фильтры
              </button>
            </div>
          ) : !visibleColumns.length ? (
            <div className="reports-empty reports-empty-initial">
              <h3>Выберите колонки отчёта</h3>
              <p>Для предпросмотра нужна хотя бы одна колонка</p>
            </div>
          ) : (
            <div className="reports-table-card">
              <div
                className="reports-table-scroll"
                role="region"
                aria-label="Таблица отчёта"
                tabIndex={0}
              >
                <table
                  className="reports-table"
                  style={{
                    minWidth: visibleColumns.reduce(
                      (sum, column) => sum + column.width,
                      0,
                    ),
                  }}
                >
                  <caption className="reports-visually-hidden">
                    Взаимодействия с учебными заведениями
                  </caption>

                  <colgroup>
                    {visibleColumns.map((column) => (
                      <col
                        key={column.key}
                        style={{ width: column.width }}
                      />
                    ))}
                  </colgroup>

                  <thead>
                    <tr>
                      {visibleColumns.map((column) => (
                        <th scope="col" key={column.key}>
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {pageRows.map((row) => (
                      <tr key={row.id}>
                        {visibleColumns.map((column) => (
                          <td key={column.key}>
                            {column.key === "status" ? (
                              <span
                                className="reports-status"
                                data-status={row.status}
                              >
                                {row.status || "—"}
                              </span>
                            ) : dateKeys.has(column.key) ? (
                              formatDate(row[column.key])
                            ) : (
                              row[column.key] || "—"
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <footer className="reports-table-footer">
                <span>
                  {first + 1}–
                  {Math.min(first + pageSize, filtered.length)} из{" "}
                  {filtered.length}
                </span>

                <Pagination
                  page={activePage}
                  count={pageCount}
                  onChange={setPage}
                />
              </footer>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}