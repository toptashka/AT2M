import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import closeIcon from "../../assets/Close.svg";
import arrowLeft from "../../assets/ArrowLeft.svg";
import eyeOpen from "../../assets/PasswordShow.svg";
import eyeClosed from "../../assets/PasswordHide.svg";
import "./SettingsDrawer.css";

const emptyPasswords = { current: "", next: "", confirm: "" };
const notificationOptions = [
  { key: "deadlines", title: "Горящие сроки и SLA", description: "Уведомлять о приближении и нарушении сроков этапов" },
  { key: "files", title: "Новые файлы", description: "Уведомлять о новых прикреплённых документах" },
  { key: "comments", title: "Новые комментарии", description: "Уведомлять о новых комментариях во взаимодействиях" },
];
const defaultNotifications = { deadlines: true, comments: true, files: true };

function readNotifications(key, initial) {
  try {
    const saved = JSON.parse(window.localStorage.getItem(key));
    return Object.fromEntries(notificationOptions.map(({ key: name }) => [name, typeof saved?.[name] === "boolean" ? saved[name] : initial[name] ?? true]));
  } catch { return { ...defaultNotifications, ...initial }; }
}

function PasswordField({ label, name, value, error, disabled, onChange }) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  return (
    <div className="settings-field">
      <label htmlFor={id}>{label}</label>
      <div className={`settings-input-wrap${error ? " is-invalid" : ""}`}>
        <input id={id} name={name} type={visible ? "text" : "password"} value={value} required
          autoComplete={name === "current" ? "current-password" : "new-password"}
          disabled={disabled} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined}
          onChange={(event) => onChange(event.target.value)} />
        <button className="settings-eye" type="button" aria-label={`${visible ? "Скрыть" : "Показать"}: ${label.toLowerCase()}`}
          aria-pressed={visible} onClick={() => setVisible((previous) => !previous)} disabled={disabled}>
          <span className="settings-window-icon" style={{ "--settings-window-icon": `url("${visible ? eyeOpen : eyeClosed}")` }} aria-hidden="true" />
        </button>
      </div>
      {error && <p className="settings-field-error" id={`${id}-error`}>{error}</p>}
    </div>
  );
}


function SettingsDialog({ children, dark, variant, titleId, onClose, returnFocusRef }) {
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
    dialog.querySelector(".settings-window-close")?.focus({ preventScroll: true });
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
      className={`settings-window-dialog settings-window-dialog-${variant}${closing ? " is-closing" : ""}`}
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
      <div className="settings-window-panel">
        <div className="settings-mobile-heading"><button type="button" onClick={requestClose}><span className="settings-window-icon" style={{ "--settings-window-icon": `url("${arrowLeft}")` }} aria-hidden="true" />Назад</button><span>Настройки</span></div>
        <button className="settings-window-close" type="button" aria-label="Закрыть" onClick={requestClose}>
          <span className="settings-window-icon" style={{ "--settings-window-icon": `url("${closeIcon}")` }} aria-hidden="true" />
        </button>
        {children}
      </div>
    </dialog>,
    document.body,
  );
}

export default function SettingsDrawer({ dark, onClose, returnFocusRef, onChangePassword,
  onSaveNotifications, initialNotifications = defaultNotifications, notificationStorageKey = "school-notifications" }) {
  const id = useId();
  const [tab, setTab] = useState("security");
  const [passwords, setPasswords] = useState(emptyPasswords);
  const [errors, setErrors] = useState({});
  const [passwordMessage, setPasswordMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [notifications, setNotifications] = useState(() => onSaveNotifications
    ? { ...defaultNotifications, ...initialNotifications }
    : readNotifications(notificationStorageKey, initialNotifications));
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [notificationError, setNotificationError] = useState("");
  const passwordRequest = useRef(null);
  const notificationRequest = useRef(null);
  const tabsRef = useRef([]);

  useEffect(() => () => {
    passwordRequest.current?.abort();
    notificationRequest.current?.abort();
  }, []);

  function changePasswordField(name, value) {
    setPasswords((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: "", ...(name === "next" ? { confirm: "" } : {}), form: "" }));
    setPasswordMessage("");
  }

  async function submitPassword(event) {
    event.preventDefault();
    if (passwordRequest.current || !Object.values(passwords).every(Boolean)) return;
    setPasswordMessage("");
    if (passwords.next !== passwords.confirm) {
      setErrors({ confirm: "Пароли не совпадают" });
      event.currentTarget.elements.namedItem("confirm")?.focus();
      return;
    }
    if (!onChangePassword) return;
    const controller = new AbortController();
    passwordRequest.current = controller;
    setErrors({});
    setPending(true);
    try {
      const result = await onChangePassword({ currentPassword: passwords.current, newPassword: passwords.next, signal: controller.signal });
      if (controller.signal.aborted) return;
      if (result?.ok !== true) {
        setErrors(result?.code === "INVALID_CURRENT_PASSWORD"
          ? { current: "Неверный текущий пароль" }
          : { form: "Не удалось обновить пароль. Попробуйте ещё раз." });
        return;
      }
      setPasswords(emptyPasswords);
      setPasswordMessage("Пароль успешно обновлён");
    } catch (error) {
      if (!controller.signal.aborted) setErrors(error?.code === "INVALID_CURRENT_PASSWORD"
        ? { current: "Неверный текущий пароль" }
        : { form: "Сервис недоступен. Попробуйте ещё раз позднее." });
    } finally {
      if (!controller.signal.aborted) { passwordRequest.current = null; setPending(false); }
    }
  }

  async function toggleNotification(name) {
    if (notificationRequest.current) return;
    const previous = notifications;
    const next = { ...notifications, [name]: !notifications[name] };
    const controller = new AbortController();
    notificationRequest.current = controller;
    setNotifications(next);
    setNotificationError("");
    setSavingNotifications(true);
    try {
      if (onSaveNotifications) {
        const result = await onSaveNotifications(next, { signal: controller.signal });
        if (result?.ok !== true) throw new Error("Save failed");
      } else window.localStorage.setItem(notificationStorageKey, JSON.stringify(next));
    } catch {
      if (!controller.signal.aborted) {
        setNotifications(previous);
        setNotificationError("Не удалось сохранить настройку. Попробуйте ещё раз.");
      }
    } finally {
      if (!controller.signal.aborted) { notificationRequest.current = null; setSavingNotifications(false); }
    }
  }

  function handleTabKey(event, index) {
    let next;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") next = 1 - index;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = 1;
    else return;
    event.preventDefault();
    setTab(next === 0 ? "security" : "notifications");
    tabsRef.current[next]?.focus();
  }

  return (
    <SettingsDialog dark={dark} variant="drawer" titleId={`${id}-title`} onClose={onClose} returnFocusRef={returnFocusRef}>
      <h2 className="settings-title" id={`${id}-title`}>Настройки</h2>
      <div className="settings-tabs" role="tablist" aria-label="Раздел настроек">
        {[{ key: "security", label: "Безопасность" }, { key: "notifications", label: "Уведомления" }].map((item, index) => (
          <button key={item.key} type="button" role="tab" ref={(element) => { tabsRef.current[index] = element; }}
            id={`${id}-tab-${item.key}`} aria-controls={`${id}-panel-${item.key}`} aria-selected={tab === item.key}
            tabIndex={tab === item.key ? 0 : -1} onClick={() => setTab(item.key)} onKeyDown={(event) => handleTabKey(event, index)}>{item.label}</button>
        ))}
      </div>
      <section className="settings-section" role="tabpanel" id={`${id}-panel-security`} aria-labelledby={`${id}-tab-security`} hidden={tab !== "security"}>
        <h3>Смена пароля</h3>
        <p className="settings-description">Обновите пароль своей учётной записи.</p>
        <form onSubmit={submitPassword} aria-busy={pending}>
          <PasswordField label="Текущий пароль" name="current" value={passwords.current} error={errors.current} disabled={pending} onChange={(value) => changePasswordField("current", value)} />
          <PasswordField label="Новый пароль" name="next" value={passwords.next} error={errors.next} disabled={pending} onChange={(value) => changePasswordField("next", value)} />
          <PasswordField label="Подтвердите новый пароль" name="confirm" value={passwords.confirm} error={errors.confirm} disabled={pending} onChange={(value) => changePasswordField("confirm", value)} />
          <p className="settings-password-hint">Не менее 8 символов, буквы и цифры</p>
          <button className="settings-submit" type="submit" disabled={pending || !Object.values(passwords).every(Boolean) || !onChangePassword}>
            {pending ? "Обновление…" : "Обновить пароль"}
          </button>
          {errors.form && <p className="settings-form-error" role="alert">{errors.form}</p>}
          <div aria-live="polite">{passwordMessage && <p className="settings-success">{passwordMessage}</p>}</div>
          {!onChangePassword && <p className="settings-note">Смена пароля станет доступна после подключения сервиса учётных записей.</p>}
        </form>
      </section>
      <section className="settings-section" role="tabpanel" id={`${id}-panel-notifications`} aria-labelledby={`${id}-tab-notifications`} hidden={tab !== "notifications"}>
        <h3>Уведомления о работе</h3>
        <p className="settings-description">Выберите, о каких изменениях сообщать.</p>
        <div aria-busy={savingNotifications}>
          {notificationOptions.map((item) => (
            <div className="settings-notification" key={item.key}>
              <div><p id={`${id}-${item.key}-label`}>{item.title}</p><p id={`${id}-${item.key}-description`}>{item.description}</p></div>
              <button className="settings-switch" type="button" role="switch" aria-checked={notifications[item.key]}
                aria-labelledby={`${id}-${item.key}-label`} aria-describedby={`${id}-${item.key}-description`}
                disabled={savingNotifications} onClick={() => toggleNotification(item.key)}><span /></button>
            </div>
          ))}
        </div>
        <p className="settings-note">{onSaveNotifications ? "Изменения сохраняются автоматически" : "Настройки сохраняются автоматически в этом браузере"}</p>
        {notificationError && <p className="settings-form-error" role="alert">{notificationError}</p>}
      </section>
    </SettingsDialog>
  );
}
