import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import closeIcon from "../../assets/Close.svg";
import arrowDown from "../../assets/ArrowDown.svg";
import arrowLeft from "../../assets/ArrowLeft.svg";
import { profileDemo } from "./profileDemo";
import "./ProfileModal.css";

const metricNames = ["Запуски", "Нагрузка", "Соблюдение SLA", "Скорость прохождения", "Доля завершённых процессов"];

function point(index, value, mobile = false) {
  const angle = (-90 + index * 72) * Math.PI / 180;
  const radius = value * (mobile ? .94 : 1.16);
  return `${(mobile ? 179 : 380) + Math.cos(angle) * radius},${(mobile ? 124 : 178) + Math.sin(angle) * radius}`;
}

function MetricsChart({ profile }) {
  const id = useId();
  const values = metricNames.map((_, index) => {
    const value = profile.metrics?.[index];
    return typeof value === "number" && Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : null;
  });
  if (values.some((value) => value === null)) {
    return <div className="profile-empty" role="status">Показатели пока недоступны</div>;
  }
  return (
    <><svg className="profile-chart profile-chart-desktop" viewBox="0 0 760 360" role="img" aria-labelledby={`${id}-title ${id}-description`}>
      <title id={`${id}-title`}>Показатели: {profile.name}</title>
      <desc id={`${id}-description`}>{metricNames.map((name, index) => `${name}: ${values[index]} из 100`).join(". ")}</desc>
      {[20, 40, 60, 80, 100].map((level) => (
        <polygon key={level} className="profile-chart-grid" points={metricNames.map((_, index) => point(index, level)).join(" ")} />
      ))}
      {metricNames.map((name, index) => {
        const [x, y] = point(index, 100).split(",");
        return <line key={name} className="profile-chart-grid" x1="380" y1="178" x2={x} y2={y} />;
      })}
      <polygon className="profile-chart-value" points={values.map((value, index) => point(index, value)).join(" ")} />
      <g className="profile-chart-labels" textAnchor="middle">
        <text x="380" y="30">Запуски · {values[0]}</text>
        <text x="610" y="136">Нагрузка · {values[1]}</text>
        <text x="568" y="329">Соблюдение SLA · {values[2]}</text>
        <text x="192" y="329">Скорость прохождения · {values[3]}</text>
        <text x="150" y="136"><tspan x="150">Доля завершённых</tspan><tspan x="150" dy="19">процессов · {values[4]}</tspan></text>
      </g>
    </svg>
    <svg className="profile-chart profile-chart-mobile" viewBox="0 0 358 240" role="img" aria-labelledby={`${id}-mobile-title ${id}-mobile-description`}>
      <title id={`${id}-mobile-title`}>Показатели: {profile.name}</title>
      <desc id={`${id}-mobile-description`}>{metricNames.map((name, index) => `${name}: ${values[index]} из 100`).join(". ")}</desc>
      {[20, 40, 60, 80, 100].map(level => <polygon key={level} className="profile-chart-grid" points={metricNames.map((_, index) => point(index, level, true)).join(" ")} />)}
      <polygon className="profile-chart-value" points={values.map((value, index) => point(index, value, true)).join(" ")} />
      <g className="profile-chart-labels">
        <text x="179" y="16" textAnchor="middle" fontWeight="700">Запуски · {values[0]}</text>
        <text x="350" y="80" textAnchor="end">Нагрузка · {values[1]}</text>
        <text x="350" y="178" textAnchor="end"><tspan x="350">Соблюдение SLA ·</tspan><tspan x="350" dy="19">{values[2]}</tspan></text>
        <text x="179" y="232" textAnchor="middle">Скорость прохождения · {values[3]}</text>
        <text x="0" y="74"><tspan x="0">Доля</tspan><tspan x="0" dy="19">завершённых</tspan><tspan x="0" dy="19">процессов ·</tspan><tspan x="0" dy="19">{values[4]}</tspan></text>
      </g>
    </svg></>
  );
}

function ProfileSelect({ id, profiles, profile, onChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const optionsRef = useRef([]);
  const selectedIndex = Math.max(0, profiles.findIndex(item => item.id === profile.id));
  useEffect(() => {
    if (!open) return;
    optionsRef.current[selectedIndex]?.focus({ preventScroll: true });
    function outside(event) { if (!rootRef.current?.contains(event.target)) setOpen(false); }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open, selectedIndex]);
  function close() { setOpen(false); triggerRef.current?.focus({ preventScroll: true }); }
  function handleKey(event) {
    if (event.key === "Escape" && open) { event.preventDefault(); event.stopPropagation(); close(); return; }
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    if (!open) { setOpen(true); return; }
    const index = optionsRef.current.indexOf(document.activeElement);
    const next = event.key === "Home" ? 0 : event.key === "End" ? profiles.length - 1 : (index + (event.key === "ArrowDown" ? 1 : -1) + profiles.length) % profiles.length;
    optionsRef.current[next]?.focus();
  }
  return <div className="profile-select-wrap" ref={rootRef} onKeyDown={handleKey}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
    <button id={id} ref={triggerRef} className="profile-select-trigger" type="button" aria-haspopup="listbox" aria-expanded={open} aria-controls={`${id}-options`} aria-labelledby={`${id}-label ${id}-value`} onClick={() => setOpen(value => !value)}>
      <span id={`${id}-value`}>{profile.name}</span>
      <span className="profile-window-icon" style={{ "--profile-window-icon": `url("${arrowDown}")` }} aria-hidden="true" />
    </button>
    {open && <div id={`${id}-options`} className="profile-select-options" role="listbox" aria-labelledby={`${id}-label`}>
      {profiles.map((item, index) => <button key={item.id} ref={element => { optionsRef.current[index] = element; }} type="button" role="option" aria-selected={item.id === profile.id} tabIndex={item.id === profile.id ? 0 : -1}
        onClick={() => { onChange(item.id); close(); }}>{item.name}</button>)}
    </div>}
  </div>;
}

function ProfileDialog({ children, dark, variant, titleId, onClose, returnFocusRef }) {
  const dialogRef = useRef(null);
  const timerRef = useRef(null);
  const closingRef = useRef(false);
  const backdropRef = useRef(false);
  const [closing, setClosing] = useState(false);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    const trigger = returnFocusRef?.current ?? document.activeElement;
    const root = document.documentElement;
    const previousOverflow = document.body.style.overflow;
    const previousGutter = root.style.scrollbarGutter;
    const previousRootOverflow = root.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const scrollbarWidth = Math.max(0, window.innerWidth - root.clientWidth);
    if (scrollbarWidth) document.body.style.paddingRight = `${(parseFloat(window.getComputedStyle(document.body).paddingRight) || 0) + scrollbarWidth}px`;
    root.style.scrollbarGutter = "auto";
    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    dialog.showModal();
    dialog.querySelector(".profile-window-close")?.focus({ preventScroll: true });
    return () => {
      window.clearTimeout(timerRef.current);
      dialog.close();
      document.body.style.overflow = previousOverflow;
      root.style.scrollbarGutter = previousGutter;
      root.style.overflow = previousRootOverflow;
      document.body.style.paddingRight = previousPadding;
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [returnFocusRef]);

  function requestClose() {
    if (closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timerRef.current = window.setTimeout(onClose, reduced ? 0 : 180);
  }

  return createPortal(
    <dialog
      ref={dialogRef}
      className={`profile-window-dialog profile-window-dialog-${variant}${closing ? " is-closing" : ""}`}
      data-theme={dark ? "dark" : "light"}
      aria-labelledby={titleId}
      aria-modal="true"
      onCancel={(event) => { event.preventDefault(); requestClose(); }}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const elements = [...event.currentTarget.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), a[href], [tabindex="0"]')]
          .filter((element) => element.tabIndex >= 0 && element.getClientRects().length > 0);
        const first = elements[0];
        const last = elements.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
      onPointerDown={(event) => { backdropRef.current = event.target === event.currentTarget; }}
      onClick={(event) => {
        if (backdropRef.current && event.target === event.currentTarget) requestClose();
      }}
    >
      <div className="profile-window-panel">
        <div className="profile-mobile-heading"><button type="button" onClick={requestClose}><span className="profile-window-icon" style={{ "--profile-window-icon": `url("${arrowLeft}")` }} aria-hidden="true" />Назад</button><h2>Профиль КАМа</h2></div>
        <button className="profile-window-close" type="button" aria-label="Закрыть" onClick={requestClose}>
          <span className="profile-window-icon" style={{ "--profile-window-icon": `url("${closeIcon}")` }} aria-hidden="true" />
        </button>
        {children}
      </div>
    </dialog>,
    document.body,
  );
}

export default function ProfileModal({ dark, onClose, returnFocusRef, profiles = profileDemo }) {
  const id = useId();
  const [selectedId, setSelectedId] = useState(() => profiles[0]?.id ?? "");
  const profile = profiles.find((item) => item.id === selectedId) ?? profiles[0];
  return (
    <ProfileDialog dark={dark} variant="modal" titleId={`${id}-title`} onClose={onClose} returnFocusRef={returnFocusRef}>
      {profile ? <>
        <div className="profile-heading">
          <div className="profile-avatar" aria-hidden="true">{profile.initials ?? profile.name.split(" ").slice(0, 2).map((part) => part[0]).join("")}</div>
          <div>
            <div className="profile-identity"><h2 id={`${id}-title`}>{profile.name}</h2><span>{profile.active === false ? "Неактивен" : "Активен"}</span></div>
            <p>Персональная характеристика · только просмотр</p>
          </div>
        </div>
        <label id={`${id}-select-label`} className="profile-label" htmlFor={`${id}-select`}>Профиль КАМа</label>
        <ProfileSelect id={`${id}-select`} profiles={profiles} profile={profile} onChange={setSelectedId} />
        <div className="profile-chart-wrap"><MetricsChart profile={profile} /></div>
        <div className="profile-explanation">
          <h3>О показателях</h3>
          <p>Все показатели нормализованы по шкале от 0 до 100. Чем выше значение, тем выше результат по соответствующей метрике. Нагрузка — оценка сбалансированности взаимодействий.</p>
        </div>
      </> : <><h2 id={`${id}-title`}>Профиль</h2><div className="profile-empty">Нет доступных профилей</div></>}
    </ProfileDialog>
  );
}
