import { Fragment, useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import Header from "../Header/Header";
import { setAppTheme, useAppTheme } from "../../theme";
import arrowDown from "../../assets/ArrowDown.svg";
import arrowLeft from "../../assets/ArrowLeft.svg";
import arrowRight from "../../assets/ArrowRight.svg";
import closeIcon from "../../assets/Close.svg";
import moreIcon from "../../assets/More.svg";
import { applyWorkflowChange, catalogs, conditions, createDemoData, createSample, migrationTargets, numberStage, pageNumbers, studentCatalog, validateImport } from "./adminModel";
import "./AdminPage.css";

const tabs = ["Справочники", "Списки студентов", "Workflow", "Журнал аудита"];
const scopeNotice = "Изменение будет применено ко всем текущим и будущим взаимодействиям.";

const mobileQuery = "(max-width: 767px)";

function subscribeMobile(callback) {
  const media = window.matchMedia(mobileQuery);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function useMobile() {
  return useSyncExternalStore(subscribeMobile, () => window.matchMedia(mobileQuery).matches, () => false);
}

function Icon({ src }) {
  return <span className="admin-icon" style={{ "--admin-icon-url": `url("${src}")` }} aria-hidden="true" />;
}

function Button({ children, variant = "secondary", className = "", ...props }) {
  return <button type="button" className={`admin-button admin-button-${variant} ${className}`} {...props}>{children}</button>;
}

function Select({ label, value, options, onChange, placeholder = "Выберите значение", disabled = false, error = false }) {
  const id = useId();
  const root = useRef(null);
  const trigger = useRef(null);
  const [open, setOpen] = useState(false);
  const selected = options.find(option => option.value === value);
  useEffect(() => {
    if (!open) return;
    function outside(event) { if (!root.current?.contains(event.target)) setOpen(false); }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);
  useEffect(() => {
    if (open) (root.current?.querySelector('[aria-selected="true"]') ?? root.current?.querySelector('[role="option"]'))?.focus();
  }, [open]);
  function choose(option) {
    onChange(option.value);
    setOpen(false);
    trigger.current?.focus();
  }
  function keyDown(event) {
    if (event.key === "Escape") { event.stopPropagation(); setOpen(false); trigger.current?.focus(); }
    if (event.key === "Tab") setOpen(false);
    const items = [...root.current.querySelectorAll('[role="option"]')];
    let index = items.indexOf(document.activeElement);
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) { setOpen(true); return; }
      index = (index + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
      items[index]?.focus();
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault(); items[event.key === "Home" ? 0 : items.length - 1]?.focus();
    } else if (open && event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
      items.find(item => item.textContent.trim().toLocaleLowerCase().startsWith(event.key.toLocaleLowerCase()))?.focus();
    }
  }
  return <div className="admin-select" ref={root} onKeyDown={keyDown} data-open={open}>
    <button ref={trigger} type="button" className="admin-select-trigger" aria-label={label} aria-expanded={open} aria-haspopup="listbox" aria-controls={id} aria-invalid={error || undefined} disabled={disabled} onClick={() => setOpen(!open)}>
      <span className={selected ? "" : "admin-muted"}>{selected?.label ?? placeholder}</span><Icon src={arrowDown} />
    </button>
    <div className="admin-select-popup" inert={!open ? true : undefined} aria-hidden={!open}>
      <div id={id} role="listbox" aria-label={label} className="admin-options">
        {options.map(option => <button type="button" role="option" key={option.value} aria-selected={option.value === value} tabIndex={-1} onClick={() => choose(option)}>{option.label}</button>)}
        {!options.length && <span className="admin-empty-option">Нет доступных вариантов</span>}
      </div>
    </div>
  </div>;
}

function Modal({ title, children, onClose, busy = false, wide = false, className = "" }) {
  const dialog = useRef(null);
  const titleId = useId();
  const [closing, setClosing] = useState(false);
  useEffect(() => {
    if (!closing) return;
    const timer = setTimeout(onClose, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 180);
    return () => clearTimeout(timer);
  }, [closing, onClose]);
  useEffect(() => {
    const element = dialog.current;
    const html = document.documentElement;
    const before = { overflow: html.style.overflow, scrollbarGutter: html.style.scrollbarGutter, paddingRight: html.style.paddingRight };
    const gap = window.innerWidth - html.clientWidth;
    if (window.matchMedia(mobileQuery).matches) html.style.scrollbarGutter = "auto";
    else if (window.CSS?.supports("scrollbar-gutter", "stable")) html.style.scrollbarGutter = "stable";
    else if (gap > 0) html.style.paddingRight = `${parseFloat(getComputedStyle(html).paddingRight) + gap}px`;
    html.style.overflow = "hidden";
    const previousFocus = document.activeElement;
    element.showModal();
    return () => {
      element.close();
      Object.assign(html.style, before);
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);
  const close = useCallback(() => {
    if (busy || closing) return;
    setClosing(true);
  }, [busy, closing]);
  return <dialog ref={dialog} aria-labelledby={titleId} className={`admin-modal ${wide ? "admin-modal-wide" : ""} ${className}`} data-closing={closing} onCancel={event => { event.preventDefault(); close(); }}>
    <Button variant="plain" className="admin-mobile-close" disabled={busy} onClick={close}>Закрыть</Button>
    <div className="admin-modal-heading"><h2 id={titleId}>{title}</h2><Button className="admin-icon-button" aria-label="Закрыть окно" disabled={busy} onClick={close}><Icon src={closeIcon} /></Button></div>
    {typeof children === "function" ? children(close) : children}
  </dialog>;
}

function Alert({ title, children }) {
  return <div className="admin-alert" role="alert"><strong>{title}</strong>{children && <div>{children}</div>}</div>;
}

function Pagination({ page, total, onChange, count, size = 10 }) {
  if (count === 0) return null;
  return <div className="admin-pagination"><span className="admin-muted">{(page - 1) * size + 1}–{Math.min(page * size, count)} из {count}</span>
    <nav aria-label="Страницы таблицы">
      <Button className="admin-icon-button" aria-label="Предыдущая страница" disabled={page <= 1} onClick={() => onChange(page - 1)}><Icon src={arrowLeft} /></Button>
      {pageNumbers(page, total).map(n => typeof n === "string" ? <span key={n}>…</span> : <Button key={n} aria-label={`Страница ${n}`} aria-current={page === n ? "page" : undefined} onClick={() => onChange(n)}>{n}</Button>)}
      <Button className="admin-icon-button" aria-label="Следующая страница" disabled={page >= total} onClick={() => onChange(page + 1)}><Icon src={arrowRight} /></Button>
    </nav>
  </div>;
}

function ImportPanel({ students = false, partnerships, api, demo, onImported }) {
  const mobile = useMobile();
  const [step, setStep] = useState("mapping");
  const [contextOpen, setContextOpen] = useState(false);
  const stepHeading = useRef(null);
  const [catalogId, setCatalogId] = useState(() => typeof window !== "undefined" && window.matchMedia(mobileQuery).matches ? "interactions" : "institutions");
  const [partnership, setPartnership] = useState("");
  const catalog = students ? studentCatalog : catalogs.find(item => item.id === catalogId);
  const [data, setData] = useState(null);
  const [mapping, setMapping] = useState({});
  const [excluded, setExcluded] = useState(new Set());
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [page, setPage] = useState(1);
  const [dragging, setDragging] = useState(false);
  const input = useRef(null);
  const request = useRef(null);
  const lastAttempt = useRef(null);
  const busy = status === "checking" || status === "importing";
  const context = { catalog: catalog.id, partnershipId: students ? partnership : null };
  const validation = data ? validateImport(catalog, data, mapping, excluded) : null;
  const canUpload = !students || Boolean(partnership);
  useEffect(() => () => request.current?.abort(), []);

  function reset() {
    request.current?.abort();
    setData(null); setMapping({}); setExcluded(new Set()); setStatus("idle"); setError(null); setResult(null); setConfirm(false); setPage(1);
    setStep("mapping"); setContextOpen(false);
    lastAttempt.current = null;
    if (input.current) input.current.value = "";
  }

  async function inspect(file, sampleScenario) {
    if (!canUpload || busy) return;
    request.current?.abort();
    const controller = new AbortController(); request.current = controller;
    lastAttempt.current = { file, sampleScenario };
    setStep("mapping");
    setResult(null); setData(null); setExcluded(new Set()); setPage(1); setError(null); setConfirm(false);
    if (file && !/\.(xlsx|xls)$/i.test(file.name)) {
      setError({ title: "Неверный формат файла", message: "Поддерживаются файлы XLS и XLSX." }); setStatus("idle"); return;
    }
    if (file && demo) {
      setError({ title: "Импорт временно недоступен", message: "Не удалось обработать файл. Повторите попытку позже." }); setStatus("idle"); return;
    }
    setStatus("checking");
    setData({ filename: file?.name ?? catalog.filename, size: file?.size ?? 84 * 1024, rows: [], columns: [] });
    try {
      let inspected;
      if (demo) {
        await new Promise(resolve => setTimeout(resolve, 550));
        if (sampleScenario === "upload-error") throw new Error("Проверьте подключение и повторите загрузку. Проверка содержимого ещё не началась.");
        inspected = createSample(catalog, sampleScenario);
      } else inspected = await api.inspectFile({ file, ...context, signal: controller.signal });
      if (controller.signal.aborted) return;
      if (!inspected?.jobId || !Array.isArray(inspected.rows) || !Array.isArray(inspected.columns)) throw new Error("Сервер вернул некорректные данные проверки.");
      setData({ ...inspected, filename: inspected.filename ?? file?.name, size: inspected.size ?? file?.size });
      setMapping(inspected.mapping ?? Object.fromEntries(inspected.columns.map(column => [column.id, ""])));
      const contentError = demo && sampleScenario === "content-error" ? "Строка 12. Не заполнено поле «Учреждение». Исправьте файл и загрузите повторно." : inspected.blockingError;
      setError(contentError ? { title: "Файл содержит ошибки", message: contentError, blocking: true } : null);
      setStatus("ready");
    } catch (failure) {
      if (controller.signal.aborted) return;
      setData(null); setStatus("idle"); setError({ title: "Не удалось загрузить файл", message: failure.message || "Повторите попытку позже.", retry: true });
    }
  }

  async function importData() {
    if (busy || !validation?.valid || error?.blocking) return;
    const controller = new AbortController(); request.current = controller;
    setStatus("importing"); setError(null);
    try {
      let response;
      if (demo) {
        await new Promise(resolve => setTimeout(resolve, 450));
        const added = data.rows.filter(row => row.isNew && !excluded.has(row.id)).length;
        response = { processed: validation.count, added, updated: validation.count - added };
      } else response = await api.importData({ jobId: data.jobId, ...context, mapping, excludedRowIds: [...excluded], signal: controller.signal });
      if (controller.signal.aborted) return;
      if (!response || ![response.processed, response.updated, response.added].every(n => Number.isInteger(n) && n >= 0) || response.processed !== response.updated + response.added) throw new Error("Сервер не подтвердил результат импорта. Проверьте журнал перед повторной отправкой.");
      setResult(response); setStatus("success"); setConfirm(false);
      onImported(`${catalog.label} · ${response.processed} записей`);
    } catch (failure) {
      if (controller.signal.aborted) return;
      setStatus("ready"); setConfirm(false); setError({ title: "Импорт не подтверждён", message: failure.message || "Проверьте журнал аудита перед повторной отправкой." });
    }
  }

  const visibleColumns = data?.columns.filter(column => mapping[column.id]) ?? [];
  const previewRows = data?.rows.slice((page - 1) * 5, page * 5) ?? [];
  if (mobile) {
    const titleId = students ? "admin-students-title" : "admin-import-title";
    const contextLabel = students ? "Партнёрство" : "Тип справочника";
    const contextItems = students ? partnerships : catalogs;
    const contextValue = students ? partnership : catalogId;
    const currentPage = Math.min(page, Math.max(1, Math.ceil((data?.rows.length ?? 0) / 3)));
    const changeContext = value => { reset(); if (students) setPartnership(value); else setCatalogId(value); };
    const goToStep = next => {
      setStep(next); setPage(1);
      requestAnimationFrame(() => { stepHeading.current?.focus({ preventScroll: true }); stepHeading.current?.scrollIntoView({ block: "start" }); });
    };
    const toggleRow = id => setExcluded(current => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; });
    const mappingReady = validation && !validation.missing.length && !validation.duplicates.length && visibleColumns.length > 0;
    return <section className="admin-card admin-mobile-import" aria-labelledby={titleId}>
      {contextOpen ? <>
        <h2 id={titleId} tabIndex={-1}>{contextLabel}</h2>
        <div className="admin-context-options" role="group" aria-label={contextLabel}>
          {contextItems.map(item => <Button variant="plain" key={item.id} aria-pressed={item.id === contextValue} onClick={() => changeContext(item.id)}>{item.label}</Button>)}
          {!contextItems.length && <p className="admin-muted">Нет доступных вариантов</p>}
        </div>
        <Button variant="plain" onClick={() => setContextOpen(false)}>Назад</Button>
      </> : <>
        <h2 id={titleId} className={!students && (data || result) ? "admin-sr-only" : undefined}>{students ? "Списки студентов" : "Импорт каталогов"}</h2>
        {(!result || students) && <div className="admin-mobile-context">
          <span>{contextLabel}</span>
          <button type="button" className="admin-select-trigger" aria-label={contextLabel} disabled={busy} onClick={() => setContextOpen(true)}>
            <span>{contextItems.find(item => item.id === contextValue)?.label ?? "Выберите партнёрство"}</span><Icon src={arrowDown} />
          </button>
        </div>}
        <input ref={input} className="admin-file-input" type="file" accept=".xls,.xlsx" tabIndex={-1} aria-label="Файл для импорта" onChange={event => { const file = event.target.files?.[0]; event.target.value = ""; if (file) inspect(file); }} />
        {error && <Alert title={error.title}>{error.message}{error.retry && <Button onClick={() => { const attempt = lastAttempt.current; if (attempt) inspect(attempt.file, attempt.sampleScenario); }}>Повторить загрузку</Button>}</Alert>}
        {!data && !result && <>
          <div className="admin-dropzone" aria-disabled={!canUpload}>
            <strong>Перетащите файл сюда или выберите на компьютере</strong>
            <p className="admin-hint">XLS / XLSX · Файл ещё не выбран</p>
            <Button disabled={!canUpload} onClick={() => input.current.click()}>Выбрать файл</Button>
          </div>
          <p>{canUpload ? "Файл ещё не выбран" : "Выберите партнёрство и загрузите список студентов."}</p>
        </>}
        {data && !result && (students || step === "mapping" || status === "checking") && <div className="admin-file-row">
          <div><strong>{data.filename}</strong><p className="admin-hint">{status === "checking" ? "Проверка содержимого файла…" : `Проверен · ${data.rows.length} записей`}</p></div>
          <Button variant="plain" disabled={busy} onClick={() => input.current.click()}>Заменить</Button>
          <Button variant="plain" disabled={status === "importing"} onClick={reset}>Удалить</Button>
        </div>}
        {status === "checking" && <p role="status"><span className="admin-spinner" />Проверка файла…</p>}
        {data && status !== "checking" && !result && (step === "mapping" ? <>
          <h3 ref={stepHeading} tabIndex={-1}>Сопоставление колонок</h3>
          {(validation.missing.length > 0 || validation.duplicates.length > 0) && <Alert title="Проверьте сопоставление колонок">
            {validation.missing.length ? `Сопоставьте поля: ${validation.missing.map(field => field.label).join(", ")}.` : "Одно поле системы нельзя назначить нескольким колонкам."}
          </Alert>}
          <div className="admin-mobile-mapping">{data.columns.map(column => <div className="admin-mobile-field" key={column.id}>
            <span>{column.label}</span>
            <Select label={`Поле для колонки «${column.label}»`} value={mapping[column.id] ?? ""} disabled={busy}
              error={validation.duplicates.includes(mapping[column.id])}
              options={[{ value: "", label: "Не импортировать" }, ...catalog.fields.map(field => ({ value: field.id, label: field.label }))]}
              onChange={value => setMapping(current => ({ ...current, [column.id]: value }))} />
          </div>)}</div>
          <Button variant="primary" disabled={busy || !mappingReady || error?.blocking} onClick={() => goToStep("preview")}>Предпросмотр данных</Button>
        </> : <>
          <h3 ref={stepHeading} tabIndex={-1}>Предпросмотр данных</h3>
          <p>Всего {data.rows.length} записей</p>
          <div className="admin-preview-cards">{data.rows.slice((currentPage - 1) * 3, currentPage * 3).map(row => {
            const rowErrors = validation.errors.get(row.id);
            const isExcluded = excluded.has(row.id);
            return <article key={row.id} className={`admin-preview-card ${isExcluded ? "admin-row-excluded" : rowErrors ? "admin-row-error" : ""}`} aria-label={`Строка ${row.line}`}>
              <dl>{visibleColumns.map(column => <div key={column.id}>
                <dt>{catalog.fields.find(field => field.id === mapping[column.id])?.label}</dt>
                <dd className={!isExcluded && rowErrors?.[column.id] ? "admin-error-text" : undefined}>{String(row.values[column.id] ?? "") || "—"}
                  {!isExcluded && rowErrors?.[column.id] && <small>{rowErrors[column.id]}</small>}
                </dd>
              </div>)}</dl>
              {!isExcluded && rowErrors?._row && <p className="admin-error-text">{rowErrors._row}</p>}
              {(rowErrors || isExcluded) && <Button variant="plain" disabled={busy} aria-label={`${isExcluded ? "Вернуть" : "Исключить"} строку ${row.line}`} onClick={() => toggleRow(row.id)}>{isExcluded ? "Вернуть" : "Исключить"}</Button>}
            </article>;
          })}</div>
          {!data.rows.length && <p>В файле нет записей</p>}
          {data.rows.length > 3 && <div className="admin-mobile-pagination">
            <span>{(currentPage - 1) * 3 + 1}–{Math.min(currentPage * 3, data.rows.length)} из {data.rows.length}</span>
            <Button className="admin-icon-button" aria-label="Предыдущая страница" disabled={currentPage === 1 || busy} onClick={() => setPage(currentPage - 1)}><Icon src={arrowLeft} /></Button>
            <Button className="admin-icon-button" aria-label="Следующая страница" disabled={currentPage * 3 >= data.rows.length || busy} onClick={() => setPage(currentPage + 1)}><Icon src={arrowRight} /></Button>
          </div>}
          {validation.invalid.length > 0 && <div className="admin-mobile-validation" role="status"><p className="admin-error-text">Исправьте или исключите ошибочные строки</p>
            <Button variant="plain" disabled={busy} onClick={() => { const first = data.rows.findIndex(row => validation.invalid.includes(row.id)); setPage(Math.floor(first / 3) + 1); }}>К первой ошибке</Button>
          </div>}
          {excluded.size > 0 && <p aria-live="polite">К импорту: {validation.count} записей · Исключено: {excluded.size}</p>}
          <Button variant="primary" disabled={busy || !validation.valid || error?.blocking} onClick={() => setConfirm(true)}>{busy ? "Импорт…" : "Импортировать данные"}</Button>
          <Button variant="plain" disabled={busy} onClick={() => goToStep("mapping")}>К сопоставлению</Button>
        </>)}
        {result && <div className="admin-mobile-result" role="status">
          <h3>{students ? "Импорт завершён" : "Справочник обновлён"}</h3>
          <p>{result.processed} записей обработано</p>
          <Button variant="primary" onClick={reset}>Загрузить другой файл</Button>
        </div>}
        {confirm && <Modal title="Подтвердить импорт?" busy={busy} onClose={() => setConfirm(false)}>{close => <>
          <p>Будет обработано записей: <strong>{validation.count}</strong>. Исключено: {excluded.size}.</p>
          <p className="admin-description">{students ? partnerships.find(item => item.id === partnership)?.label : catalog.label}</p>
          <div className="admin-modal-actions"><Button disabled={busy} onClick={close}>Отмена</Button><Button variant="primary" disabled={busy} onClick={importData}>{busy ? "Импорт…" : "Подтвердить импорт"}</Button></div>
        </>}</Modal>}
      </>}
    </section>;
  }

  return <section className="admin-card" aria-labelledby={students ? "admin-students-title" : "admin-import-title"}>
    <h2 id={students ? "admin-students-title" : "admin-import-title"}>{students ? "Списки студентов" : "Импорт каталогов"}</h2>
    <p className="admin-description">{catalog.description}</p>
    <div className="admin-context-row"><span>{students ? "Партнёрство" : "Тип справочника"}</span>
      <Select label={students ? "Партнёрство" : "Тип справочника"} value={students ? partnership : catalogId} disabled={busy}
        placeholder="Выберите партнёрство" options={(students ? partnerships : catalogs).map(item => ({ value: item.id, label: item.label }))}
        onChange={value => { reset(); if (students) setPartnership(value); else setCatalogId(value); }} />
      {students && <span className="admin-badge">Персональные данные</span>}
    </div>
    {students && !partnership && <p className="admin-hint">Выберите партнёрство и загрузите список студентов.</p>}
    <input ref={input} className="admin-file-input" type="file" accept=".xls,.xlsx" tabIndex={-1} aria-label="Файл для импорта" onChange={event => { const file = event.target.files?.[0]; event.target.value = ""; if (file) inspect(file); }} />
    {error && <Alert title={error.title}>{error.message}{error.retry && <Button onClick={() => { const attempt = lastAttempt.current; if (attempt) inspect(attempt.file, attempt.sampleScenario); }}>Повторить загрузку</Button>}</Alert>}
    {!data && !result && <div className="admin-dropzone" data-dragging={dragging} aria-disabled={!canUpload}
      onDragOver={event => { event.preventDefault(); if (canUpload) setDragging(true); }}
      onDragLeave={event => { if (!event.currentTarget.contains(event.relatedTarget)) setDragging(false); }}
      onDrop={event => { event.preventDefault(); setDragging(false); const files = event.dataTransfer.files; if (files.length === 1) inspect(files[0]); else if (canUpload) setError({ title: "Выберите один файл", message: "Загружайте файлы по очереди." }); }}>
      <div><strong>Перетащите файл сюда или выберите на компьютере</strong><p className="admin-hint">XLS / XLSX · Файл ещё не выбран</p></div>
      <Button disabled={!canUpload} onClick={() => input.current.click()}>Выбрать файл</Button>
    </div>}
    {data && !result && <div className="admin-file-row"><div><strong>{data.filename}</strong><p className="admin-hint">{Math.ceil((data.size ?? 0) / 1024)} КБ · {status === "checking" ? "Проверка содержимого файла…" : `Проверка завершена · ${data.rows.length} записей`}</p></div>
      <Button variant="plain" disabled={busy} onClick={() => input.current.click()}>Заменить</Button><Button variant="plain" disabled={status === "importing"} onClick={reset}>Удалить</Button>
    </div>}
    {status === "checking" && <p className="admin-hint" role="status"><span className="admin-spinner" />Проверка файла. Сопоставление будет доступно после проверки.</p>}
    {data && status !== "checking" && !result && <>
      <h3>Сопоставление колонок</h3>
      {(validation.missing.length > 0 || validation.duplicates.length > 0) && <Alert title="Не удалось определить обязательные колонки">
        {validation.missing.length ? `Сопоставьте поля: ${validation.missing.map(f => f.label).join(", ")}.` : "Одно поле системы нельзя назначить нескольким колонкам."}
      </Alert>}
      <div className="admin-mapping"><div className="admin-mapping-head"><span>Колонка в файле</span><span /><span>Поле системы</span></div>
        {data.columns.map(column => <div className="admin-mapping-row" key={column.id}><span>{column.label}</span><span aria-hidden="true">→</span>
          <Select label={`Поле для колонки «${column.label}»`} value={mapping[column.id] ?? ""} disabled={busy}
            error={validation.duplicates.includes(mapping[column.id]) || (!mapping[column.id] && validation.missing.some(f => f.id === column.id))}
            options={[{ value: "", label: "Не импортировать" }, ...catalog.fields.map(f => ({ value: f.id, label: f.label + (f.required ? " *" : "") }))]}
            onChange={value => setMapping(current => ({ ...current, [column.id]: value }))} />
        </div>)}
      </div><p className="admin-hint">* Обязательное поле{catalog.fields.some(f => f.id === "signed") ? " · Подписание лицензии: да / нет" : ""}</p>
      <div className="admin-section-heading"><h3>Предпросмотр данных</h3><span className="admin-hint">Всего {data.rows.length} записей</span></div>
      {validation.invalid.length > 0 && <Alert title="Файл содержит ошибки">Строк с ошибками: {validation.invalid.length}. Исправьте файл или исключите эти строки из импорта.
        <Button variant="plain" disabled={busy} onClick={() => { const first = data.rows.findIndex(row => validation.invalid.includes(row.id)); setPage(Math.floor(first / 5) + 1); }}>К первой ошибке</Button>
      </Alert>}
      <div className="admin-table-frame"><div className="admin-table-scroll" role="region" aria-label="Предпросмотр импортируемых данных" tabIndex={0}>
        <table className="admin-table admin-preview-table"><thead><tr>{visibleColumns.map(column => <th key={column.id} scope="col">{catalog.fields.find(f => f.id === mapping[column.id])?.label}</th>)}<th scope="col"><span className="admin-sr-only">Действия со строкой</span></th></tr></thead>
          <tbody>{previewRows.map(row => <tr key={row.id} className={excluded.has(row.id) ? "admin-row-excluded" : validation.errors.has(row.id) ? "admin-row-error" : ""}>
            {visibleColumns.map((column, index) => <td key={column.id}>{String(row.values[column.id] ?? "") || "—"}
              {excluded.has(row.id) && index === 0 ? <small>Исключена из импорта</small> : !excluded.has(row.id) && validation.errors.get(row.id)?.[column.id] ? <small className="admin-error-text">{validation.errors.get(row.id)[column.id]}</small> : null}
              {index === 0 && !excluded.has(row.id) && validation.errors.get(row.id)?._row && <small className="admin-error-text">{validation.errors.get(row.id)._row}</small>}
            </td>)}
            <td className="admin-row-actions"><Button variant="plain" disabled={busy} aria-label={`${excluded.has(row.id) ? "Вернуть" : "Исключить"} строку ${row.line}`} onClick={() => setExcluded(current => { const next = new Set(current); if (next.has(row.id)) next.delete(row.id); else next.add(row.id); return next; })}>{excluded.has(row.id) ? "Вернуть" : "Исключить"}</Button></td>
          </tr>)}{!data.rows.length && <tr><td colSpan={visibleColumns.length + 1} className="admin-empty">В файле нет записей</td></tr>}</tbody>
        </table>
      </div>{data.rows.length > 5 && <Pagination page={page} total={Math.ceil(data.rows.length / 5)} count={data.rows.length} size={5} onChange={setPage} />}</div>
      <p className="admin-hint">Показаны все сопоставленные поля. «Не импортировать» скрывает колонку.{visibleColumns.length > 4 ? " Прокрутите таблицу вправо." : ""}</p>
    </>}
    {result ? <div className="admin-import-result" role="status"><h3>Импорт завершён</h3><div className="admin-result-numbers"><strong>{result.processed} записей обработано</strong><span>{result.updated} обновлено</span><span>{result.added} добавлено</span></div>
      {excluded.size > 0 && <p className="admin-hint">Исключено строк: {excluded.size}</p>}<Button onClick={reset}>Загрузить другой файл</Button>
    </div> : <div className="admin-import-footer"><p className="admin-hint" aria-live="polite">{validation?.valid ? `К импорту: ${validation.count} записей · Данные готовы` : data && status !== "checking" ? "Проверьте обязательные поля и ошибки перед импортом" : ""}</p>
      <Button variant="primary" disabled={busy || !validation?.valid || error?.blocking} onClick={() => setConfirm(true)}>Импортировать данные</Button></div>}
    {confirm && <Modal title="Подтвердить импорт?" busy={status === "importing"} onClose={() => setConfirm(false)}>{close => <>
      <p>Будет обработано записей: <strong>{validation.count}</strong>. Исключено: {excluded.size}.</p>
      <p className="admin-description">{students ? partnerships.find(p => p.id === partnership)?.label : catalog.label}</p>
      
      <div className="admin-modal-actions"><Button disabled={busy} onClick={close}>Отмена</Button><Button variant="primary" disabled={busy} onClick={importData}>{busy ? "Импорт…" : "Подтвердить импорт"}</Button></div>
    </>}</Modal>}
  </section>;
}

function StageMenu({ stage, index, onAction }) {
  const mobile = useMobile();
  const root = useRef(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open || mobile) return;
    function outside(event) { if (!root.current?.contains(event.target)) setOpen(false); }
    document.addEventListener("pointerdown", outside);
    root.current?.querySelector('[role="menuitem"]')?.focus();
    return () => document.removeEventListener("pointerdown", outside);
  }, [open, mobile]);
  if (mobile) return <div className="admin-stage-menu">
    <Button className="admin-icon-button" aria-label={`Действия: ${stage.name}`} aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}><Icon src={moreIcon} /></Button>
    {open && <Modal title={`${numberStage(index)} · ${stage.name}`} className="admin-stage-sheet" onClose={() => setOpen(false)}>
      <div className="admin-stage-sheet-actions">{[["edit", "Редактировать"], ["move", "Переместить"], ["delete", "Удалить"]].map(([action, label]) => <Button variant="plain" key={action} onClick={() => { setOpen(false); onAction(action, stage); }}>{label}</Button>)}</div>
    </Modal>}
  </div>;
  return <div className="admin-stage-menu" ref={root} data-open={open} onKeyDown={event => {
    if (event.key === "Escape") { event.stopPropagation(); setOpen(false); root.current.firstElementChild.focus(); }
    if (event.key === "Tab") setOpen(false);
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault(); if (!open) { setOpen(true); return; }
      const items = [...root.current.querySelectorAll('[role="menuitem"]')];
      const index = items.indexOf(document.activeElement);
      items[event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : (index + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length]?.focus();
    }
  }}>
    <Button className="admin-icon-button" aria-label={`Действия: ${stage.name}`} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)}><Icon src={moreIcon} /></Button>
    <div role="menu" aria-label={stage.name} className="admin-stage-popup" inert={!open ? true : undefined} aria-hidden={!open}>
      {[["add", "Добавить этап здесь"], ["edit", "Редактировать"], ["move", "Переместить"], ["delete", "Удалить"]].map(([action, label]) => <button type="button" role="menuitem" tabIndex={-1} key={action} className={action === "delete" ? "admin-error-text" : ""} onClick={() => { setOpen(false); root.current.firstElementChild.focus(); onAction(action, stage); }}>{label}</button>)}
    </div>
  </div>;
}

function WorkflowEditor({ action, stage, stages, onClose, onApply }) {
  const mobile = useMobile();
  const [name, setName] = useState(action === "add" ? "" : stage.name);
  const [after, setAfter] = useState(action === "add" && stage ? stage.id : "");
  const [target, setTarget] = useState("");
  const [required, setRequired] = useState(stage?.conditions ?? [true, true, true]);
  const [touched, setTouched] = useState({});
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const controller = useRef(null);
  const generatedId = useRef(null);
  const inputId = useId();
  useEffect(() => () => controller.current?.abort(), []);
  const needsName = action === "add" || action === "edit";
  const needsPosition = action === "add" || action === "move";
  const nameDuplicate = stages.some(s => (action === "add" || s.id !== stage?.id) && s.name.toLocaleLowerCase() === name.trim().toLocaleLowerCase());
  const nameError = !name.trim() ? "Введите название этапа" : nameDuplicate ? "Этап с таким названием уже существует" : "";
  const valid = (!needsName || !nameError) && (!needsPosition || after !== "") && (action !== "delete" || stage.count === 0 || target !== "");
  const positions = [{ value: "start", label: "В начале маршрута" }, ...stages.filter(s => action !== "move" || s.id !== stage.id).map(s => ({ value: s.id, label: `После этапа ${numberStage(stages.indexOf(s))} — ${s.name}` }))];
  const neighbours = action === "delete" ? migrationTargets(stages, stage.id) : [];
  const index = stages.findIndex(s => s.id === stage?.id);
  const position = after === "start" ? -1 : stages.findIndex(s => s.id === after);
  const title = result ? "Workflow обновлён" : confirm ? "Применить изменение Workflow?" : ({ add: "Добавить этап", edit: "Редактировать этап", move: "Переместить этап", delete: "Удаление этапа" })[action];

  function prepare() { setTouched({ name: true, position: true }); if (valid) { setError(""); setConfirm(true); } }
  async function apply() {
    if (busy || !valid) return;
    if (!generatedId.current) generatedId.current = globalThis.crypto.randomUUID();
    const change = { type: action, id: action === "add" ? generatedId.current : stage.id, name: name.trim(), after, target, conditions: required };
    controller.current = new AbortController();
    setBusy(true); setError("");
    try {
      const message = await onApply(change, controller.current.signal);
      if (controller.current.signal.aborted) return;
      setResult(message); setConfirm(false);
    } catch (failure) {
      if (!controller.current.signal.aborted) setError(failure.message || "Не удалось сохранить изменение. Повторите попытку.");
    } finally { if (!controller.current.signal.aborted) setBusy(false); }
  }
  return <Modal title={title} className="admin-workflow-editor" busy={busy} onClose={onClose} wide={!confirm && !result}>{close => <>
    {error && <Alert title="Изменение не сохранено">{error}</Alert>}
    {result ? <><p role="status">{result}</p><div className="admin-modal-actions"><Button variant="primary" onClick={close}>Понятно</Button></div></> : confirm ? <>
      <p>{scopeNotice}</p><p className="admin-description">{action === "delete" ? `Будет удалён этап «${stage.name}».` : `Этап «${name || stage?.name}». Проверьте название, порядок этапов и условия завершения перед применением.`}</p>
      {action === "delete" && stage.count > 0 && <p>Перенос: {stage.count} взаимодействий → «{stages.find(s => s.id === target)?.name}».</p>}
      <div className="admin-modal-actions"><Button disabled={busy} onClick={() => setConfirm(false)}>Назад</Button><Button variant={action === "delete" ? "danger" : "primary"} disabled={busy} onClick={apply}>{busy ? "Сохранение…" : "Применить изменение"}</Button></div>
    </> : <>
      {action === "add" && <p className="admin-description">Новый этап будет добавлен в единый Workflow и станет доступен для всех взаимодействий.</p>}
      {(action === "delete" || (action === "move" && !mobile)) && <p><strong>{numberStage(index)} — {stage.name}</strong></p>}
      {needsName && <div className="admin-form-field"><label htmlFor={inputId}>Название этапа *</label><input id={inputId} className="admin-input" value={name} maxLength={160} placeholder="Введите название этапа" aria-invalid={touched.name && Boolean(nameError)} aria-describedby={touched.name && nameError ? `${inputId}-error` : undefined} onBlur={() => setTouched(current => ({ ...current, name: true }))} onChange={event => setName(event.target.value)} />
        {touched.name && nameError && <span id={`${inputId}-error`} className="admin-error-text">{nameError}</span>}</div>}
      {needsPosition && <div className="admin-form-field"><span>{action === "move" ? "Новое положение" : "Расположение *"}</span><Select label="Расположение этапа" value={after} options={positions} placeholder="Выберите расположение этапа" error={touched.position && !after} onChange={value => { setAfter(value); setTouched(current => ({ ...current, position: true })); }} />
        {touched.position && !after && <span className="admin-error-text">Выберите расположение этапа</span>}</div>}
      {action === "add" && (!mobile || after) && <div className="admin-stage-preview"><h3>Предпросмотр</h3>{after ? <>
        {position >= 0 && <p><span>{numberStage(position)}</span>{stages[position].name}</p>}<p className="admin-new-stage"><span>{numberStage(position + 1)}</span>{name.trim() || "Новый этап"}</p>
        {stages[position + 1] && <p><span>{numberStage(position + 2)}</span>{stages[position + 1].name}</p>}
      </> : <p className="admin-hint">Выберите расположение, чтобы увидеть новый этап в маршруте.</p>}<small className="admin-hint">Нумерация последующих этапов будет обновлена автоматически.</small></div>}
      {action === "add" && mobile && !after && <p className="admin-hint">Нумерация последующих этапов будет обновлена автоматически.</p>}
      {action === "edit" && !mobile && <><fieldset className="admin-conditions"><legend>Условия завершения</legend>{conditions.map((condition, i) => <label key={condition}><input type="checkbox" checked={required[i]} onChange={event => setRequired(current => current.map((item, j) => j === i ? event.target.checked : item))} /><span>Обязательно</span>{condition}</label>)}</fieldset><p className="admin-hint">Условия завершения из текущего проекта. Переходы и возвраты сохраняют действующую логику.</p></>}
      {action === "delete" && (stage.count > 0 ? <><p className="admin-description">В этом этапе находятся активные взаимодействия. Перед удалением выберите этап, в который они будут перенесены.</p>
        <p className="admin-notice">В этапе сейчас: <strong>{stage.count} взаимодействий</strong></p>
        <div className="admin-form-field"><span>Перенести взаимодействия в</span><Select label="Этап для переноса" value={target} placeholder="Выберите этап" options={neighbours.map(s => ({ value: s.id, label: `${stages.indexOf(s) < index ? "Предыдущий" : "Следующий"} · ${numberStage(stages.indexOf(s))} — ${s.name}` }))} onChange={setTarget} /></div>
        {!neighbours.length && <Alert title="Нет допустимого соседнего этапа">Удаление недоступно. Сначала измените маршрут.</Alert>}
      </> : <p className="admin-description">Этап не используется. Его можно удалить без переноса взаимодействий.</p>)}
      <p className="admin-notice">{scopeNotice}</p>
      <div className="admin-modal-actions"><Button className="admin-editor-cancel" onClick={close}>Отмена</Button><Button variant={action === "delete" ? "danger" : "primary"} disabled={!valid} onClick={prepare}>{({ add: "Добавить этап", edit: "Сохранить", move: mobile ? "Сохранить" : "Продолжить", delete: stage?.count > 0 ? "Удалить и перенести" : "Удалить этап" })[action]}</Button></div>
    </>}
  </>}</Modal>;
}

function Workflow({ stages, onApply }) {
  const [editor, setEditor] = useState(null);
  return <section className="admin-card"><div className="admin-card-heading"><div><h2>Конфигуратор Workflow</h2><p className="admin-description">Настройка этапов единого маршрута взаимодействия</p></div><Button variant="primary" onClick={() => setEditor({ action: "add", stage: null })}>+ Добавить этап</Button></div>
    <p className="admin-notice">{scopeNotice}</p>
    <ol className="admin-stages">{stages.map((stage, i) => <Fragment key={stage.id}><li className={stage.isNew ? "admin-stage-added" : ""}><span className="admin-stage-number">{numberStage(i)}</span><span className="admin-stage-name">{stage.name}</span><span className="admin-stage-status">{stage.count ? `Используется${stage.count === 18 ? " · 18 взаимодействий" : ""}` : `Не используется${stage.isNew ? " · Новый этап" : ""}`}</span><StageMenu stage={stage} index={i} onAction={(action, selected) => setEditor({ action, stage: selected })} /></li>{i === 5 && <li className="admin-stage-insert"><Button variant="plain" onClick={() => setEditor({ action: "add", stage })}>+ Добавить этап здесь</Button></li>}</Fragment>)}</ol>
    {!stages.length && <div className="admin-empty">Этапов пока нет. Добавьте первый этап маршрута.</div>}
    {editor && <WorkflowEditor {...editor} stages={stages} onApply={onApply} onClose={() => setEditor(null)} />}
  </section>;
}

function Audit({ entries, demo, refreshing, onRefresh }) {
  const [page, setPage] = useState(1);
  const total = Math.max(1, Math.ceil(entries.length / 10));
  const current = Math.min(page, total);
  const dateFormat = new Intl.DateTimeFormat("ru-RU", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Moscow" });
  return <section className="admin-card"><div className="admin-card-heading"><div><h2>Журнал аудита</h2><p className="admin-description">История действий пользователей и операций с защищаемыми данными</p></div>{!demo && <Button disabled={refreshing} onClick={onRefresh}>{refreshing ? "Обновление…" : "Обновить"}</Button>}</div>
    <div className="admin-table-frame"><div className="admin-table-scroll" role="region" aria-label="Журнал аудита" tabIndex={0}><table className="admin-table admin-audit-table"><thead><tr>{["Дата и время", "Пользователь", "Действие", "Объект", "IP-адрес"].map(text => <th scope="col" key={text}>{text}</th>)}</tr></thead><tbody>
      {entries.slice((current - 1) * 10, current * 10).map(entry => <tr key={entry.id}><td>{Number.isNaN(Date.parse(entry.date)) ? "—" : dateFormat.format(new Date(entry.date)).replace(",", "")}</td><td>{entry.user}</td><td>{entry.action}</td><td>{entry.object}</td><td>{entry.ip}</td></tr>)}
      {!entries.length && <tr><td colSpan={5} className="admin-empty"><strong>Записей не найдено</strong><p className="admin-hint">События появятся после действий пользователей.</p></td></tr>}
    </tbody></table></div><Pagination page={current} total={total} count={entries.length} onChange={setPage} /></div>
    
  </section>;
}

export default function AdminPage({ api = null, demo = false }) {
  const { theme } = useAppTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [data, setData] = useState(() => demo ? createDemoData() : null);
  const [loading, setLoading] = useState(!demo);
  const [error, setError] = useState("");
  const loadRequest = useRef(null);
  const mounted = useRef(false);
  const load = useCallback(async () => {
    if (demo) return;
    loadRequest.current?.abort();
    const controller = new AbortController(); loadRequest.current = controller;
    setLoading(true); setError("");
    try {
      if (!api?.load || !api?.inspectFile || !api?.importData || !api?.updateWorkflow || !api?.listAudit) throw new Error("API администрирования ещё не подключён.");
      const response = await api.load({ signal: controller.signal });
      if (controller.signal.aborted) return;
      if (!response || typeof response.canManage !== "boolean") throw new Error("Сервер не подтвердил права доступа.");
      if (response.canManage && ![response.stages, response.partnerships, response.audit].every(Array.isArray)) throw new Error("Некорректный ответ сервера.");
      setData(response);
    } catch (failure) { if (!controller.signal.aborted) setError(failure.message || "Не удалось загрузить данные."); }
    finally { if (!controller.signal.aborted) setLoading(false); }
  }, [api, demo]);
  useEffect(() => {
    mounted.current = true;
    const startup = new AbortController();
    if (!demo) Promise.resolve().then(() => { if (!startup.signal.aborted) load(); });
    return () => { startup.abort(); mounted.current = false; loadRequest.current?.abort(); };
  }, [demo, load]);

  function addDemoAudit(action, object) {
    setData(current => ({ ...current, audit: [{ id: crypto.randomUUID(), date: new Date().toISOString(), user: "Администратор", action, object, ip: "—" }, ...current.audit] }));
  }
  async function refreshAudit() {
    if (demo || loading) return;
    setLoading(true); setError("");
    const controller = new AbortController(); loadRequest.current = controller;
    try {
      const entries = await api.listAudit({ signal: controller.signal });
      if (controller.signal.aborted) return;
      if (!Array.isArray(entries)) throw new Error("Некорректный ответ журнала аудита.");
      setData(current => ({ ...current, audit: entries }));
    } catch (failure) { if (!controller.signal.aborted) setError(failure.message || "Журнал недоступен."); }
    finally { if (!controller.signal.aborted) setLoading(false); }
  }
  async function apply(change, signal) {
    const localStages = applyWorkflowChange(data.stages, change);
    let nextStages = localStages;
    if (!demo) {
      const response = await api.updateWorkflow({ change, version: data.version, signal });
      if (signal.aborted || !mounted.current) return "";
      if (!Array.isArray(response?.stages)) throw new Error("Сервер не подтвердил обновление Workflow.");
      nextStages = response.stages;
      setData(current => ({ ...current, stages: nextStages, version: response.version }));
    } else {
      setData(current => ({ ...current, stages: nextStages }));
      addDemoAudit("Изменение Workflow", change.name || data.stages.find(s => s.id === change.id)?.name);
    }
    const deleted = data.stages.find(s => s.id === change.id);
    const target = data.stages.find(s => s.id === change.target);
    const message = change.type === "delete" && deleted.count > 0 ? `${deleted.count} взаимодействий перенесено в этап «${target.name}». Этап «${deleted.name}» удалён.` : ({ add: "Этап добавлен. Нумерация маршрута обновлена.", edit: "Изменения этапа сохранены.", move: "Порядок этапов обновлён.", delete: "Этап удалён. Нумерация маршрута обновлена." })[change.type];
    return message;
  }

  return <div className="admin-page" data-theme={theme}>
    <Header mobileNavigation activePage="Администрирование" dark={theme === "dark"} setDark={value => { const dark = typeof value === "function" ? value(theme === "dark") : value; setAppTheme(dark ? "dark" : "light"); }} profileOpen={profileOpen} setProfileOpen={setProfileOpen} />
    <main className="admin-main"><h1>Администрирование</h1><p className="admin-page-description">Управление справочниками, данными обучения, Workflow и журналом аудита</p>
      {error && <Alert title="Не удалось выполнить действие">{error}{!data && <Button disabled={loading} onClick={load}>Повторить</Button>}</Alert>}
      {!data && loading && <p className="admin-notice" role="status"><span className="admin-spinner" />Загрузка администрирования…</p>}
      {data && !data.canManage && <section className="admin-card"><h2>Доступ ограничен</h2><p>Раздел доступен только администратору.</p><a className="admin-button" href="#/">На главную</a></section>}
      {data?.canManage && <>
        <div className="admin-tabs" role="tablist" aria-label="Разделы администрирования" onKeyDown={event => {
          if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
          event.preventDefault(); const next = event.key === "Home" ? 0 : event.key === "End" ? 3 : (tab + (event.key === "ArrowRight" ? 1 : -1) + 4) % 4;
          setTab(next); document.getElementById(`admin-tab-${next}`).focus();
        }}>{tabs.map((label, i) => <button type="button" role="tab" id={`admin-tab-${i}`} aria-selected={tab === i} aria-controls={`admin-panel-${i}`} tabIndex={tab === i ? 0 : -1} key={label} onClick={event => { setTab(i); event.currentTarget.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" }); }}>{label}</button>)}</div>
        {tabs.map((label, i) => <div key={label} role="tabpanel" id={`admin-panel-${i}`} aria-labelledby={`admin-tab-${i}`} hidden={tab !== i} tabIndex={0} className="admin-tab-panel">
          {i < 2 ? <ImportPanel students={i === 1} partnerships={data.partnerships} api={api} demo={demo} onImported={object => { if (demo) addDemoAudit("Импорт данных", object); }} /> : i === 2 ? <Workflow stages={data.stages} onApply={apply} /> : <Audit entries={data.audit} demo={demo} refreshing={loading} onRefresh={refreshAudit} />}
        </div>)}
      </>}
    </main>
  </div>;
}
