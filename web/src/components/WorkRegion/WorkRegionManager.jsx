import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import WorkRegionUser from "./WorkRegionUser";

import {
  IncomingRequests,
  INCOMING_DEMO,
  WorkspaceChart,
} from "./WorkRegionUpdates";

import "./WorkRegionManager.css";

const INSTITUTIONS = [
  "МГТУ им. Н. Э. Баумана",
  "Университет ИТМО",
  "НИЯУ МИФИ",
];

const PROGRAMS = [
  "Информационная безопасность",
  "DevOps",
  "Облачные технологии",
  "Data Science",
  "QA",
];

const OWNERS = [
  "Александр Иванов",
  "Мария Смирнова",
  "Дмитрий Соколов",
];

const RESULTS = {
  accept: {
    title: "Заявка принята в работу",
    description: "Изменения сохранены.",
  },
  reject: {
    title: "Заявка отклонена",
    description: "Изменения сохранены.",
  },
  create: {
    title: "Партнёрство создано",
    description: "Изменения сохранены.",
  },
  send: {
    title: "Заявка отправлена руководителю",
    description:
      "Заявка появится у руководителя во входящих запросах.",
  },
  complete: {
    title: "Этап завершён",
    description: "Комментарий сохранён в истории этапа.",
  },
};

function SelectField({
  label,
  placeholder,
  value,
  options,
  onChange,
  disabled = false,
  className = "",
}) {
  return (
    <label className={`wmm-field ${className}`}>
      {label && <span>{label}</span>}

      <span className="wmm-select-wrap">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          aria-label={label || placeholder}
        >
          <option value="">{placeholder}</option>

          {options.map((option) => {
            const item =
              typeof option === "string"
                ? { value: option, label: option }
                : option;

            return (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            );
          })}
        </select>

        <span className="wmm-chevron" aria-hidden="true" />
      </span>
    </label>
  );
}

function Modal({
  modal,
  form,
  setForm,
  manager,
  owners,
  institutions,
  programs,
  busy,
  error,
  onClose,
  onSubmit,
}) {
  const dialogRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;

    if (!dialog.open) dialog.showModal();

    document.body.style.overflow = "hidden";

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;

      if (
        previouslyFocused instanceof HTMLElement &&
        previouslyFocused.isConnected
      ) {
        previouslyFocused.focus();
      }
    };
  }, []);

  useEffect(() => {
    titleRef.current?.focus();
  }, [modal.kind]);

  const result =
    modal.kind === "result" ? RESULTS[modal.result] : null;

  const title =
    result?.title ||
    {
      accept: "Принять заявку в работу",
      reject: "Отклонить заявку?",
      create: "Создать партнёрство",
      complete: "Завершить этап",
    }[modal.kind];

  const submitLabel = {
    accept: "Принять в работу",
    reject: "Отклонить",
    create: manager
      ? "Создать партнёрство"
      : "Отправить заявку",
    complete: "Завершить этап",
  }[modal.kind];

  const valid =
    modal.kind === "reject" ||
    (modal.kind === "accept" && Boolean(form.owner)) ||
    (modal.kind === "create" &&
      Boolean(form.institution && form.program)) ||
    (modal.kind === "complete" &&
      Boolean(form.comment.trim()));

  function updateField(name, value) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  return (
    <dialog
      ref={dialogRef}
      className={`wmm-dialog wmm-dialog--${modal.kind}`}
      aria-labelledby="wmm-modal-title"
      aria-busy={busy}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
      onClick={(event) => {
        if (
          busy ||
          event.target !== event.currentTarget
        ) {
          return;
        }

        const rect =
          event.currentTarget.getBoundingClientRect();

        const outside =
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom;

        if (outside) onClose();
      }}
    >
      <h2
        id="wmm-modal-title"
        ref={titleRef}
        tabIndex={-1}
      >
        {title}
      </h2>

      {result ? (
        <>
          <p className="wmm-description wmm-muted">
            {result.description}
          </p>

          <div className="wmm-modal-actions">
            <button
              type="button"
              className="wmm-button wmm-close-button"
              onClick={onClose}
            >
              Закрыть
            </button>
          </div>
        </>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();

            if (valid && !busy) {
              onSubmit();
            }
          }}
        >
          {modal.kind === "accept" && (
            <>
              <p className="wmm-description">
                {modal.request.name} · {modal.request.program}
              </p>

              <SelectField
                className="wmm-owner-field"
                label="Ответственный КАМ"
                placeholder="Выберите ответственного"
                options={owners}
                value={form.owner}
                onChange={(value) =>
                  updateField("owner", value)
                }
                disabled={busy}
              />

              <p className="wmm-note wmm-muted">
                {modal.request.source === "CMS"
                  ? "После принятия взаимодействие появится в реестре на этапе 02 — коммуникация и уточнение актуальности программы."
                  : "После подтверждения партнёрство появится в реестре на этапе 01 — Поиск контактов."}
              </p>
            </>
          )}

          {modal.kind === "reject" && (
            <p className="wmm-description">
              Заявка будет удалена из входящих запросов.
              Подтвердите отклонение.
            </p>
          )}

          {modal.kind === "create" && (
            <>
              <div className="wmm-create-fields">
                <SelectField
                  label="Учреждение"
                  placeholder="Выберите учреждение"
                  options={institutions}
                  value={form.institution}
                  onChange={(value) =>
                    updateField("institution", value)
                  }
                  disabled={busy}
                />

                <SelectField
                  label="ИТ-направление"
                  placeholder="Выберите ИТ-направление"
                  options={programs}
                  value={form.program}
                  onChange={(value) =>
                    updateField("program", value)
                  }
                  disabled={busy}
                />
              </div>

              <p className="wmm-note wmm-muted">
                {manager
                  ? "Партнёрство сразу появится в реестре на этапе 01 — Поиск контактов."
                  : "Заявка будет направлена руководителю. Партнёрство появится после подтверждения."}
              </p>
            </>
          )}

          {modal.kind === "complete" && (
            <>
              <p className="wmm-description wmm-muted">
                Добавьте комментарий, подтверждающий и
                обосновывающий смену статуса
              </p>

              <label className="wmm-field wmm-comment-field">
                <span>Комментарий *</span>

                <textarea
                  value={form.comment}
                  onChange={(event) =>
                    updateField("comment", event.target.value)
                  }
                  placeholder="Введите комментарий"
                  required
                  disabled={busy}
                />
              </label>
            </>
          )}

          {error && (
            <p className="wmm-error" role="alert">
              {error}
            </p>
          )}

          <div className="wmm-modal-actions">
            <button
              type="button"
              className="wmm-button wmm-cancel-button"
              onClick={onClose}
              disabled={busy}
            >
              Отмена
            </button>

            <button
              type="submit"
              className="wmm-button wmm-button--primary"
              disabled={!valid || busy}
            >
              {busy ? "Сохранение…" : submitLabel}
            </button>
          </div>
        </form>
      )}
    </dialog>
  );
}

function FiltersPanel({
  anchor,
  values,
  options,
  onChange,
  onClose,
}) {
  const panelRef = useRef(null);

  useLayoutEffect(() => {
    const panel = panelRef.current;

    function positionPanel() {
      if (!anchor.isConnected) {
        onClose();
        return;
      }

      const anchorRect = anchor.getBoundingClientRect();
      const width = Math.min(304, window.innerWidth - 32);

      panel.style.width = `${width}px`;

      const height = panel.getBoundingClientRect().height;

      const left = Math.max(
        16,
        Math.min(
          anchorRect.right - width,
          window.innerWidth - width - 16,
        ),
      );

      const below = anchorRect.bottom + 8;

      const top =
        below + height <= window.innerHeight - 16
          ? below
          : Math.max(16, anchorRect.top - height - 8);

      panel.style.left = `${left}px`;
      panel.style.top = `${top}px`;
    }

    panel.showPopover();
    positionPanel();
    panel.querySelector("select:not(:disabled)")?.focus();

    window.addEventListener("resize", positionPanel);
    window.addEventListener("scroll", positionPanel, true);

    return () => {
      window.removeEventListener("resize", positionPanel);
      window.removeEventListener(
        "scroll",
        positionPanel,
        true,
      );

      if (panel.matches(":popover-open")) {
        panel.hidePopover();
      }
    };
  }, [anchor, onClose]);

  const fields = [
    ["owner", "Ответственный КАМ", "wmm-mobile-owner"],
    ["institution", "Учреждение", ""],
    ["city", "Город", ""],
    ["period", "Период", ""],
    ["changedDate", "Дата изменения", ""],
  ];

  return (
    <div
      ref={panelRef}
      popover="auto"
      className="wmm-filter-panel"
      aria-label="Дополнительные фильтры"
      onToggle={(event) => {
        if (event.newState === "closed") {
          onClose();
        }
      }}
    >
      {fields.map(([name, placeholder, className]) => (
        <SelectField
          key={name}
          className={className}
          placeholder={placeholder}
          options={options[name] || []}
          value={values[name]}
          disabled={!options[name]?.length}
          onChange={(value) => onChange(name, value)}
        />
      ))}
    </div>
  );
}

export default function WorkRegionManager({
  onAction,
  manager = true,
  canCompleteStage = false,
  institutions = INSTITUTIONS,
  programs = PROGRAMS,
  owners = OWNERS,
  incomingRequests = INCOMING_DEMO,
  filterOptions = {},
}) {
  const [processedIds, setProcessedIds] = useState([]);
  const [modal, setModal] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [pageError, setPageError] = useState("");
  const [filterAnchor, setFilterAnchor] = useState(null);

  const [form, setForm] = useState({
    owner: "",
    institution: "",
    program: "",
    comment: "",
  });

  const [filters, setFilters] = useState({
    owner: "",
    institution: "",
    city: "",
    period: "",
    changedDate: "",
  });

  const savingRef = useRef(false);

  const closeFiltersRef = useRef(() => {
    setFilterAnchor(null);
  });

  const requests = incomingRequests.filter(
    (request) => !processedIds.includes(request.id),
  );

  function openModal(nextModal) {
    if (savingRef.current) return;

    setFilterAnchor(null);
    setError("");

    setForm({
      owner: owners.includes("Александр Иванов")
        ? "Александр Иванов"
        : typeof owners[0] === "string"
          ? owners[0]
          : owners[0]?.value || "",
      institution: "",
      program: "",
      comment: "",
    });

    setModal(nextModal);
  }

  function closeModal() {
    if (savingRef.current) return;

    setModal(null);
    setError("");
  }

  async function forwardAction(action, payload, anchor) {
    if (typeof onAction !== "function") return;

    try {
      setPageError("");

      return await onAction(action, payload, anchor);
    } catch (cause) {
      const message =
        cause?.message || "Не удалось выполнить действие.";

      setPageError(message);

      return {
        ok: false,
        error: message,
      };
    }
  }

  function handleAction(action, payload, anchor) {
    if (action === "create-partnership") {
      openModal({ kind: "create" });
      return;
    }

    if (action === "complete-stage") {
      if (canCompleteStage) {
        openModal({
          kind: "complete",
          interactionId: payload,
        });
      }

      return;
    }

    if (
      action === "filter" &&
      payload === "Ещё фильтры"
    ) {
      if (anchor instanceof HTMLElement) {
        setFilterAnchor((current) =>
          current === anchor ? null : anchor,
        );
      }

      return;
    }

    return forwardAction(action, payload, anchor);
  }

  async function submitModal() {
    if (savingRef.current || !modal) return;

    let action;
    let payload;
    let result;

    if (modal.kind === "accept") {
      if (!form.owner) return;

      action = "accept-request";

      payload = {
        id: modal.request.id,
        owner: form.owner,
        stage: modal.request.source === "CMS" ? 2 : 1,
      };

      result = "accept";
    } else if (modal.kind === "reject") {
      action = "reject-request";

      payload = {
        id: modal.request.id,
      };

      result = "reject";
    } else if (modal.kind === "create") {
      if (!form.institution || !form.program) return;

      action = manager
        ? "create-partnership"
        : "send-partnership-request";

      payload = {
        institution: form.institution,
        program: form.program,
        ...(manager ? { stage: 1 } : {}),
      };

      result = manager ? "create" : "send";
    } else if (modal.kind === "complete") {
      if (
        !canCompleteStage ||
        !form.comment.trim()
      ) {
        return;
      }

      action = "complete-stage";

      payload = {
        id: modal.interactionId,
        comment: form.comment.trim(),
      };

      result = "complete";
    } else {
      return;
    }

    savingRef.current = true;
    setBusy(true);
    setError("");

    try {
      if (typeof onAction !== "function") {
        throw new Error(
          "Обработчик сохранения onAction не подключён.",
        );
      }

      const response = await onAction(action, payload);

      if (response?.ok !== true) {
        throw new Error(
          response?.error ||
            "Сохранение не подтверждено. Повторите попытку.",
        );
      }

      if (
        modal.kind === "accept" ||
        modal.kind === "reject"
      ) {
        setProcessedIds((current) => [
          ...new Set([...current, modal.request.id]),
        ]);
      }

      setModal({
        kind: "result",
        result,
      });
    } catch (cause) {
      setError(
        cause?.message || "Не удалось сохранить изменения.",
      );
    } finally {
      savingRef.current = false;
      setBusy(false);
    }
  }

  function updateFilter(name, value) {
    const next = {
      ...filters,
      [name]: value,
    };

    setFilters(next);
    forwardAction("filters", next);
  }

  return (
    <WorkRegionUser
      manager={manager}
      onAction={handleAction}
      canCompleteStage={canCompleteStage}
    >
      {manager && (
        <>
          <WorkspaceChart kind="kam" />

          <IncomingRequests
            requests={requests}
            onAccept={(request) =>
              openModal({
                kind: "accept",
                request,
              })
            }
            onReject={(request) =>
              openModal({
                kind: "reject",
                request,
              })
            }
          />
        </>
      )}

      {pageError && (
        <p className="wmm-error" role="alert">
          {pageError}
        </p>
      )}

      {filterAnchor && (
        <FiltersPanel
          anchor={filterAnchor}
          values={filters}
          options={{
            owner: owners,
            institution: institutions,
            city: ["Москва", "Санкт-Петербург"],
            period: [],
            changedDate: [],
            ...filterOptions,
          }}
          onChange={updateFilter}
          onClose={closeFiltersRef.current}
        />
      )}

      {modal && (
        <Modal
          modal={modal}
          form={form}
          setForm={setForm}
          manager={manager}
          owners={owners}
          institutions={institutions}
          programs={programs}
          busy={busy}
          error={error}
          onClose={closeModal}
          onSubmit={submitModal}
        />
      )}
    </WorkRegionUser>
  );
}