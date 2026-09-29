import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import chevronRight from "../../assets/chevron-right.svg";
import chevronDown from "../../assets/chevron-down.svg";
import unionIcon from "../../assets/Union.svg";
import "./WorkspaceUI.css";

export function CheckIcon() {
  return (
    <span
      className="at-check-svg"
      style={{ "--check-image": `url("${unionIcon}")` }}
      aria-hidden="true"
    />
  );
}

export function useAnimatedState() {
  const [present, setPresent] = useState(false);
  const [closing, setClosing] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const update = useCallback((next) => {
    clearTimeout(timer.current);

    if (next) {
      setClosing(false);
      setPresent(true);
      return;
    }

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setPresent(false);
      setClosing(false);
      return;
    }

    setClosing(true);

    timer.current = setTimeout(() => {
      setPresent(false);
      setClosing(false);
    }, 180);
  }, []);

  return [present, update, closing];
}

export function Popover({
  label,
  summary,
  children,
  disabled = false,
  width = 320,
  className = "",
  panelClassName = "",
}) {
  const root = useRef(null);
  const trigger = useRef(null);
  const panel = useRef(null);
  const id = useId();

  const [present, setPresent, closing] = useAnimatedState();
  const [session, setSession] = useState(0);
  const [position, setPosition] = useState({});

  const open = present && !closing;

  function close(restore = true) {
    setPresent(false);

    if (restore) {
      trigger.current?.focus({ preventScroll: true });
    }
  }

  useLayoutEffect(() => {
    if (!present || disabled) return;

    const node = panel.current;

    function place() {
      const rect = trigger.current.getBoundingClientRect();
      const viewport = window.visualViewport;

      const left = viewport?.offsetLeft || 0;
      const top = viewport?.offsetTop || 0;
      const vw = viewport?.width || window.innerWidth;
      const vh = viewport?.height || window.innerHeight;

      const below = Math.max(
        0,
        top + vh - rect.bottom - 18
      );

      const above = Math.max(
        0,
        rect.top - top - 18
      );

      const up = below < 320 && above > below;

      const panelWidth = Math.min(
        Math.max(rect.width, width),
        vw - 24
      );

      setPosition({
        position: "fixed",
        left: Math.max(
          left + 12,
          Math.min(rect.left, left + vw - panelWidth - 12)
        ),
        top: up ? "auto" : rect.bottom + 6,
        bottom: up
          ? window.innerHeight - rect.top + 6
          : "auto",
        width: panelWidth,
        minWidth: 0,
        maxWidth: panelWidth,
        maxHeight: Math.min(560, up ? above : below),
      });
    }

    place();
    node.showPopover();

    const observer = new ResizeObserver(place);
    observer.observe(trigger.current);

    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);

    window.visualViewport?.addEventListener("resize", place);
    window.visualViewport?.addEventListener("scroll", place);

    return () => {
      if (node.matches(":popover-open")) {
        node.hidePopover();
      }

      observer.disconnect();

      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);

      window.visualViewport?.removeEventListener("resize", place);
      window.visualViewport?.removeEventListener("scroll", place);
    };
  }, [present, disabled, width]);

  useEffect(() => {
    if (!open) return;

    function outside(event) {
      if (!root.current?.contains(event.target)) {
        setPresent(false);
      }
    }

    document.addEventListener("pointerdown", outside);
    document.addEventListener("focusin", outside);

    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("focusin", outside);
    };
  }, [open, setPresent]);

  return (
    <div
      className={`at-select ${className}`}
      ref={root}
      onKeyDown={(event) => {
        if (event.key === "Escape" && present) {
          event.preventDefault();
          event.stopPropagation();
          close();
        }
      }}
    >
      <button
        type="button"
        ref={trigger}
        className="at-select-trigger"
        aria-label={label}
        aria-expanded={open}
        aria-controls={present ? id : undefined}
        disabled={disabled}
        onClick={() => {
          if (open) {
            close();
          } else {
            setSession((value) => value + 1);
            setPresent(true);
          }
        }}
        onKeyDown={(event) => {
          if (event.key !== "ArrowDown") return;

          event.preventDefault();

          if (!open) {
            setSession((value) => value + 1);
            setPresent(true);
          } else {
            panel.current
              ?.querySelector("input, button")
              ?.focus();
          }
        }}
      >
        <span>{summary || label}</span>

        <img
          className="at-chevron-image"
          src={open ? chevronRight : chevronDown}
          alt=""
        />
      </button>

      {present && !disabled && (
        <div
          ref={panel}
          id={id}
          popover="manual"
          className={`at-options at-select-popup ${panelClassName}`}
          style={position}
          data-closing={closing}
          inert={closing || undefined}
          role="group"
          aria-label={label}
        >
          <div className="at-popup-content" key={session}>
            {children(close)}
          </div>
        </div>
      )}
    </div>
  );
}

function SelectMenu({
  items,
  value,
  multiple,
  allMeansEmpty,
  allLabel,
  searchable,
  searchPlaceholder,
  menuTitle,
  onChange,
  close,
}) {
  const values = Array.isArray(value)
    ? value
    : value
      ? [value]
      : [];

  const [draft, setDraft] = useState(() =>
    allMeansEmpty && !values.length
      ? items.map((item) => item.value)
      : values
  );

  const [search, setSearch] = useState("");

  const all =
    items.length > 0 &&
    items.every((item) => draft.includes(item.value));

  const some = items.some((item) =>
    draft.includes(item.value)
  );

  const visible = items.filter((item) =>
    item.label
      .toLocaleLowerCase("ru")
      .includes(search.trim().toLocaleLowerCase("ru"))
  );

  return (
    <div className={multiple ? "at-multi-menu" : "at-single-menu"}>
      {multiple && (
        <p className="at-multi-title">{menuTitle}</p>
      )}

      {(searchable || multiple) && (
        <input
          className="at-input"
          aria-label={searchPlaceholder}
          placeholder={searchPlaceholder}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      )}

      {multiple ? (
        <>
          <div className="at-multi-list">
            <label className="at-multi-option">
              <input
                type="checkbox"
                checked={all}
                ref={(node) => {
                  if (node) {
                    node.indeterminate = some && !all;
                  }
                }}
                onChange={() =>
                  setDraft(
                    all ? [] : items.map((item) => item.value)
                  )
                }
              />

              <span>{allLabel}</span>
            </label>

            {visible.map((item) => (
              <label
                className="at-multi-option"
                key={item.value}
              >
                <input
                  type="checkbox"
                  checked={draft.includes(item.value)}
                  onChange={() =>
                    setDraft((previous) =>
                      previous.includes(item.value)
                        ? previous.filter(
                            (current) => current !== item.value
                          )
                        : [...previous, item.value]
                    )
                  }
                />

                <span>{item.label}</span>
              </label>
            ))}

            {!visible.length && (
              <p className="at-muted">Ничего не найдено</p>
            )}
          </div>

          <button
            type="button"
            className="at-button primary at-multi-apply"
            disabled={allMeansEmpty && !draft.length}
            onClick={() => {
              onChange(allMeansEmpty && all ? [] : draft);
              close();
            }}
          >
            Применить
          </button>
        </>
      ) : (
        <>
          {visible.map((item) => (
            <button
              type="button"
              key={item.value}
              aria-pressed={item.value === value}
              onClick={() => {
                onChange(item.value);
                close();
              }}
            >
              {item.label}
            </button>
          ))}

          {!visible.length && (
            <p className="at-muted">Ничего не найдено</p>
          )}
        </>
      )}
    </div>
  );
}

export function Select({
  value,
  options,
  onChange,
  label,
  disabled = false,
  searchable = false,
  multiple = false,
  allMeansEmpty = false,
  allLabel = "Все варианты",
  searchPlaceholder = "Поиск",
  menuTitle,
}) {
  const items = options.map((item) =>
    typeof item === "string"
      ? { value: item, label: item }
      : item
  );

  const values = Array.isArray(value)
    ? value
    : value
      ? [value]
      : [];

  const selected = items.filter((item) =>
    multiple
      ? values.includes(item.value)
      : item.value === value
  );

  return (
    <Popover
      label={label}
      summary={
        selected.map((item) => item.label).join(", ") ||
        label ||
        "Не назначен"
      }
      disabled={disabled}
      width={multiple ? 320 : 200}
      panelClassName={multiple ? "at-multi-popup" : ""}
    >
      {(close) => (
        <SelectMenu
          items={items}
          value={value}
          multiple={multiple}
          allMeansEmpty={allMeansEmpty}
          allLabel={allLabel}
          searchable={searchable}
          searchPlaceholder={searchPlaceholder}
          menuTitle={menuTitle || label}
          onChange={onChange}
          close={close}
        />
      )}
    </Popover>
  );
}

export function Dialog({
  title,
  children,
  onClose,
  busy = false,
  wide = false,
  returnFocusRef,
  showClose = true,
}) {
  const ref = useRef(null);
  const timer = useRef(null);
  const locked = useRef(false);

  const [closing, setClosing] = useState(false);
  const id = useId();

  useEffect(() => {
    const node = ref.current;

    const previous =
      returnFocusRef?.current || document.activeElement;

    const overflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    node.showModal();

    return () => {
      clearTimeout(timer.current);
      node.close();
      document.body.style.overflow = overflow;

      if (previous?.isConnected) {
        previous.focus({ preventScroll: true });
      }
    };
  }, [returnFocusRef]);

  function close(action = onClose) {
    if (busy || locked.current) return;

    locked.current = true;

    const finish = () => {
      try {
        action();
      } finally {
        locked.current = false;
        setClosing(false);
      }
    };

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      finish();
      return;
    }

    setClosing(true);
    timer.current = setTimeout(finish, 180);
  }

  return (
    <dialog
      ref={ref}
      className={`at-dialog${wide ? " at-dialog-wide" : ""}`}
      data-closing={closing}
      aria-labelledby={id}
      aria-busy={busy || closing}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;

        const rect = event.currentTarget.getBoundingClientRect();

        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        ) {
          close();
        }
      }}
    >
      <div className="at-dialog-head">
        <h2 id={id}>{title}</h2>

        {showClose && (
          <button
            type="button"
            className="at-icon"
            aria-label="Закрыть"
            disabled={busy || closing}
            onClick={() => close()}
          >
            ×
          </button>
        )}
      </div>

      {typeof children === "function"
        ? children(close, closing)
        : children}
    </dialog>
  );
}

export function Field({ label, children }) {
  const id = useId();

  return (
    <div className="at-field">
      <span id={id}>{label}</span>

      {isValidElement(children) &&
      typeof children.type === "string"
        ? cloneElement(children, { "aria-labelledby": id })
        : children}
    </div>
  );
}

export function Toast({ notice, onClose }) {
  useEffect(() => {
    if (!notice) return;

    const timer = setTimeout(
      onClose,
      notice.error ? 6500 : 4000
    );

    return () => clearTimeout(timer);
  }, [notice, onClose]);

  if (!notice) return null;

  return (
    <div
      className={`at-toast${notice.error ? " is-error" : ""}`}
      role={notice.error ? "alert" : "status"}
    >
      <span>{notice.text}</span>

      <button
        type="button"
        aria-label="Закрыть уведомление"
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
}

export function Empty({ title, children }) {
  return (
    <div className="at-empty">
      <strong>{title}</strong>
      {children && <p>{children}</p>}
    </div>
  );
}

export function Tabs({ value, options, onChange }) {
  return (
    <div className="at-tabs">
      {options.map(([key, label]) => (
        <button
          type="button"
          key={key}
          aria-pressed={key === value}
          className={key === value ? "is-active" : ""}
          onClick={() => onChange(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function usePreference(key, fallback) {
  const [value, setValue] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  });

  function update(next) {
    const result =
      typeof next === "function" ? next(value) : next;

    setValue(result);

    try {
      sessionStorage.setItem(key, JSON.stringify(result));
    } catch {
      // Хранилище браузера недоступно.
    }
  }

  return [value, update];
}