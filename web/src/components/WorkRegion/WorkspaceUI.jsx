import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import chevronRight from "../../assets/chevron-right.svg";
import chevronDown from "../../assets/chevron-down.svg";
import "./WorkspaceUI.css";

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
  const root = useRef(null);
  const trigger = useRef(null);
  const popup = useRef(null);
  const id = useId();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState([]);
  const [position, setPosition] = useState({});

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

  const visible = items.filter((item) =>
    item.label
      .toLocaleLowerCase("ru")
      .includes(search.toLocaleLowerCase("ru"))
  );

  const allSelected =
    items.length > 0 &&
    items.every((item) => draft.includes(item.value));

  const someSelected = items.some((item) =>
    draft.includes(item.value)
  );

  function close(restoreFocus = false) {
    setOpen(false);

    if (restoreFocus) {
      trigger.current?.focus({ preventScroll: true });
    }
  }

  function show() {
    setSearch("");

    setDraft(
      multiple && allMeansEmpty && !values.length
        ? items.map((item) => item.value)
        : values
    );

    setOpen(true);
  }

  useLayoutEffect(() => {
    if (!open || disabled) return;

    const node = popup.current;

    function place() {
      const rect = trigger.current.getBoundingClientRect();
      const viewport = window.visualViewport;

      const leftEdge = viewport?.offsetLeft || 0;
      const topEdge = viewport?.offsetTop || 0;
      const width = viewport?.width || window.innerWidth;
      const height = viewport?.height || window.innerHeight;

      const gap = 6;
      const margin = 12;

      const below = Math.max(
        0,
        topEdge + height - rect.bottom - gap - margin
      );

      const above = Math.max(
        0,
        rect.top - topEdge - gap - margin
      );

      const upwards = below < 300 && above > below;

      const popupWidth = Math.min(
        Math.max(rect.width, multiple ? 320 : 200),
        width - margin * 2
      );

      setPosition({
        position: "fixed",
        inset: "auto",
        left: Math.max(
          leftEdge + margin,
          Math.min(
            rect.left,
            leftEdge + width - popupWidth - margin
          )
        ),
        top: upwards ? undefined : rect.bottom + gap,
        bottom: upwards
          ? window.innerHeight - rect.top + gap
          : undefined,
        width: popupWidth,
        minWidth: 0,
        maxWidth: popupWidth,
        maxHeight: Math.min(
          multiple ? 420 : 280,
          upwards ? above : below
        ),
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
  }, [open, disabled, multiple]);

  useEffect(() => {
    if (!open) return;

    function outside(event) {
      if (!root.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", outside);
    document.addEventListener("focusin", outside);

    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("focusin", outside);
    };
  }, [open]);

  useEffect(() => {
    if (disabled) {
      setOpen(false);
    }
  }, [disabled]);

  function toggle(option) {
    setDraft((previous) =>
      previous.includes(option)
        ? previous.filter((item) => item !== option)
        : [...previous, option]
    );
  }

  return (
    <div
      className="at-select"
      ref={root}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          event.stopPropagation();
          close(true);
        }
      }}
    >
      <button
        ref={trigger}
        type="button"
        className="at-select-trigger"
        aria-label={label}
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        disabled={disabled}
        onClick={() => (open ? close() : show())}
        onKeyDown={(event) => {
          if (event.key !== "ArrowDown") return;

          event.preventDefault();

          if (!open) {
            show();
          } else {
            popup.current
              ?.querySelector("input, button")
              ?.focus();
          }
        }}
      >
        <span>
          {selected.map((item) => item.label).join(", ") ||
            label ||
            "Не назначен"}
        </span>

        <img
          className="at-chevron-image"
          src={open ? chevronRight : chevronDown}
          alt=""
        />
      </button>

      {open && !disabled && (
        <div
          id={id}
          ref={popup}
          popover="manual"
          className={`at-options at-select-popup${
            multiple ? " at-multi-popup" : ""
          }`}
          style={position}
          role="group"
          aria-label={label}
        >
          {multiple && (
            <p className="at-multi-title">
              {menuTitle || label}
            </p>
          )}

          {(searchable || multiple) && (
            <input
              className="at-input"
              aria-label={searchPlaceholder}
              placeholder={searchPlaceholder}
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          )}

          {multiple ? (
            <>
              <div className="at-multi-list">
                <label className="at-multi-option">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(node) => {
                      if (node) {
                        node.indeterminate =
                          someSelected && !allSelected;
                      }
                    }}
                    onChange={() =>
                      setDraft(
                        allSelected
                          ? []
                          : items.map((item) => item.value)
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
                      onChange={() => toggle(item.value)}
                    />

                    <span>{item.label}</span>
                  </label>
                ))}

                {!visible.length && (
                  <p className="at-muted">
                    Ничего не найдено
                  </p>
                )}
              </div>

              <button
                type="button"
                className="at-button primary at-multi-apply"
                disabled={allMeansEmpty && !draft.length}
                onClick={() => {
                  onChange(
                    allMeansEmpty && allSelected ? [] : draft
                  );

                  close(true);
                }}
              >
                Применить
              </button>
            </>
          ) : (
            visible.map((item) => (
              <button
                type="button"
                key={item.value}
                aria-pressed={item.value === value}
                onClick={() => {
                  onChange(item.value);
                  close(true);
                }}
              >
                <span>{item.label}</span>

                {item.value === value && (
                  <span aria-hidden="true">✓</span>
                )}
              </button>
            ))
          )}

          {!multiple && !visible.length && (
            <p className="at-muted">Ничего не найдено</p>
          )}
        </div>
      )}
    </div>
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
  const id = useId();

  useEffect(() => {
    const node = ref.current;
    const previous =
      returnFocusRef?.current || document.activeElement;

    const overflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    node.showModal();

    return () => {
      node.close();
      document.body.style.overflow = overflow;

      if (previous?.isConnected) {
        previous.focus({ preventScroll: true });
      }
    };
  }, [returnFocusRef]);

  return (
    <dialog
      ref={ref}
      className={`at-dialog${wide ? " at-dialog-wide" : ""}`}
      aria-labelledby={id}
      aria-busy={busy}
      onCancel={(event) => {
        event.preventDefault();

        if (!busy) {
          onClose();
        }
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget || busy) return;

        const rect = event.currentTarget.getBoundingClientRect();

        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        ) {
          onClose();
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
            disabled={busy}
            onClick={onClose}
          >
            ×
          </button>
        )}
      </div>

      {children}
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