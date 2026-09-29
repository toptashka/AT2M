import { useRef, useState } from "react";
import { Dialog, Field, Select } from "./WorkspaceUI";
import {
  OWNERS,
  STEPS,
  softwareValues,
  softwareVendors,
  listText,
} from "./workspaceModel";

const TITLES = {
  edit: "Редактирование параметров взаимодействия",
  rollback: "Возврат взаимодействия на предыдущий этап",
  file: "Прикрепление документа к этапу",
  delete: "Удалить файл?",
  comment: "Добавить комментарий",
  complete: "Завершить этап",
  accept: "Принять заявку в работу",
  reject: "Отклонить заявку?",
  create: "Новая заявка / партнёрство",
};

export default function WorkspaceModal({
  modal,
  item,
  manager,
  institutions = [],
  programs = [],
  softwareCatalog = [],
  managers = [],
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(() => ({
    owner: item ? item.owner : (managers[0]?.value || OWNERS[0]?.value || ""),
    institution: institutions[0] || "",
    direction: programs[0] || "",
    comment: "",
    ...(item?.contract || {}),
    software: softwareValues(item?.contract?.software).join(", "),
    vendor: listText(item?.contract?.vendor),
    transfer:
      item?.contract?.transfer === "Передано вузу"
        ? "Передано учреждению"
        : item?.contract?.transfer || "Не передавалось",
    contact: { ...(item?.contact || {}) },
    documentType: "license",
    file: null,
  }));

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const submitLock = useRef(false);
  const input = useRef(null);
  const kind = modal.kind;

  const change = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));

  const contact = (key, value) =>
    change("contact", { ...form.contact, [key]: value });

  const valid = ["rollback", "comment", "complete"].includes(kind)
    ? Boolean(form.comment.trim())
    : kind === "file"
      ? Boolean(form.file)
      : kind === "create"
        ? Boolean(form.institution && form.direction)
        : kind === "accept"
          ? Boolean(form.owner)
          : true;

  const selectedSoftware = softwareValues(form.software);

  const softwareOptions = [
    ...new Set([
      ...softwareCatalog
        .map((entry) => entry.value),
      ...selectedSoftware,
    ]),
  ];

  function receive(file) {
    if (!file) return;
    change("file", file);
    setError("");
  }

  const select = (label, key, options, disabled = false) => (
    <Field label={label}>
      <Select
        value={form[key] || ""}
        label={label}
        options={options}
        disabled={disabled}
        onChange={(value) => change(key, value)}
      />
    </Field>
  );

  const text = (label, key, type = "text") => (
    <Field label={label}>
      <input
        className="at-input"
        type={type}
        value={form[key] || ""}
        onChange={(event) => change(key, event.target.value)}
      />
    </Field>
  );

  const metadata = (
    <>
      {text("Номер договора", "number")}
      {text("Срок действия лицензии", "licenseEnd", "date")}

      {select("Подписание лицензии", "signed", [
        "Нет",
        "В процессе",
        "Да / Подписан",
      ])}

      {select("Статус передачи ПО", "transfer", [
        "Не передавалось",
        "В процессе передачи",
        "Передано учреждению",
      ])}
    </>
  );

  return (
    <Dialog
      title={TITLES[kind]}
      busy={submitting}
      onClose={onClose}
      showClose={kind !== "edit"}
    >
      {(close, closing) => (
        <form
          inert={closing || undefined}
          onSubmit={async (event) => {
            event.preventDefault();
            if (!valid || submitLock.current) return;
            submitLock.current = true;
            setSubmitting(true);
            setError("");
            try {
              await onSubmit(form);
            } catch (cause) {
              setError(cause.message || "Не удалось сохранить изменения.");
              setSubmitting(false);
              submitLock.current = false;
            }
          }}
        >
          {kind === "edit" && (
            <>
              <h3>Справочные параметры</h3>

              <div className="at-dialog-grid">
                <Field label="Учреждение">
                  <input
                    className="at-input"
                    value={item.name}
                    disabled
                  />
                </Field>

                <Field label="Направление">
                  <input
                    className="at-input"
                    value={item.direction}
                    disabled
                  />
                </Field>

                <Field label="ПО / Продукт">
                  <Select
                    multiple
                    label="ПО / Продукт"
                    allLabel="Все продукты"
                    searchPlaceholder="Поиск продуктов"
                    value={selectedSoftware}
                    options={softwareOptions}
                    onChange={(values) =>
                      setForm((current) => ({
                        ...current,
                        software: values.join(", "),
                        vendor: softwareVendors(values, softwareCatalog).join(", "),
                      }))
                    }
                  />
                </Field>

                <Field label="Вендор">
                  <input
                    className="at-input"
                    value={form.vendor || "—"}
                    title={form.vendor || ""}
                    disabled
                  />
                </Field>
              </div>

              <h3>Куратор взаимодействия</h3>

              {select(
                "Ответственный КАМ",
                "owner",
                [...managers.map(m => typeof m === "string" ? { value: m, label: m } : m), { value: "", label: "Не назначен" }],
                !manager
              )}

              <h3>Реквизиты соглашения</h3>

              <div className="at-dialog-grid">
                {metadata}
              </div>

              <h3>Контакт ответственного лица учреждения</h3>

              <div className="at-dialog-grid">
                {[
                  ["ФИО", "name"],
                  ["Должность", "position"],
                  ["Телефон", "phone"],
                  ["Рабочая почта", "email"],
                ].map(([label, key]) => (
                  <Field key={key} label={label}>
                    <input
                      className="at-input"
                      type={key === "email" ? "email" : "text"}
                      value={form.contact[key] || ""}
                      onChange={(event) =>
                        contact(key, event.target.value)
                      }
                    />
                  </Field>
                ))}
              </div>
            </>
          )}

          {kind === "rollback" && (
            <>
              <p>
                {item.name} · {item.direction}
              </p>

              <p>
                Текущий этап:{" "}
                {String(item.stage).padStart(2, "0")} —{" "}
                {STEPS[item.stage - 1]}
              </p>

              <p>
                Возврат на этап:{" "}
                {String(item.stage - 1).padStart(2, "0")} —{" "}
                {STEPS[item.stage - 2]}
              </p>
            </>
          )}

          {["rollback", "comment", "complete"].includes(kind) && (
            <Field
              label={
                kind === "rollback"
                  ? "Обоснуйте причину возврата на доработку *"
                  : "Комментарий *"
              }
            >
              <textarea
                className="at-input"
                value={form.comment}
                required
                placeholder={
                  kind === "rollback"
                    ? "Введите причину возврата"
                    : "Введите комментарий"
                }
                onChange={(event) =>
                  change("comment", event.target.value)
                }
              />
            </Field>
          )}

          {kind === "rollback" && (
            <p className="at-muted">
              Комментарий будет сохранён в истории взаимодействия.
            </p>
          )}

          {kind === "delete" && (
            <>
              <p className="at-muted">{modal.file.name}</p>
              <p>
                Файл будет удалён из этого этапа взаимодействия.
                Вы уверены?
              </p>
            </>
          )}

          {kind === "file" && (
            <>
              {select("Тип документа", "documentType", [
                {
                  value: "license",
                  label: "Лицензионное соглашение",
                },
                { value: "contract", label: "Договор" },
                { value: "other", label: "Другой документ" },
              ])}

              <div
                className="aw-dropzone"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  receive(event.dataTransfer.files[0]);
                }}
              >
                <div>
                  <strong>
                    Перетащите документ сюда или выберите файл
                  </strong>

                  <small className="at-muted">
                    Документ относится к выбранному этапу
                  </small>
                </div>

                <button
                  className="at-button"
                  type="button"
                  onClick={() => input.current.click()}
                >
                  Выбрать файл
                </button>

                <input
                  ref={input}
                  type="file"
                  hidden
                  onChange={(event) =>
                    receive(event.target.files[0])
                  }
                />
              </div>

              {form.file && <p>{form.file.name}</p>}

              {form.documentType === "license" && (
                <>
                  <h3>Метаданные соглашения</h3>
                  <div className="at-dialog-grid">
                    {metadata}
                  </div>
                  {text("Комментарий к файлу", "comment")}
                </>
              )}

              {form.documentType !== "other" && (
                <p className="at-muted">
                  Сохранение документа актуализирует связанные
                  реквизиты взаимодействия.
                </p>
              )}
            </>
          )}

          {kind === "accept" && (
            <>
              <p>
                {modal.request.name} · {modal.request.program}
              </p>

              {select("Ответственный КАМ", "owner", managers.length > 0 ? managers : OWNERS)}

              <p className="at-muted">После одобрения взаимодействие появится на первом этапе Workflow.</p>
            </>
          )}

          {kind === "reject" && (
            <p>
              Заявка будет удалена из входящих запросов.
              Подтвердите отклонение.
            </p>
          )}

          {kind === "create" && (
            <>
              {select("Учреждение", "institution", institutions)}
              {select("ИТ-направление", "direction", programs)}
              {manager && select("Ответственный КАМ", "owner", managers)}

              <p className="at-muted">
                {manager ? "Партнёрство появится на первом этапе Workflow." : "Заявка будет ждать одобрения руководителя. До одобрения взаимодействие не создаётся."}
              </p>
            </>
          )}

          {error && (
            <p className="at-error" role="alert">
              {error}
            </p>
          )}

          <div className="at-form-actions">
            <button
              className="at-button"
              type="button"
              onClick={() => close()}
            >
              Отмена
            </button>

            <button
              className={
                "at-button " +
                (["delete", "reject"].includes(kind)
                  ? "danger"
                  : "primary")
              }
              disabled={!valid || submitting}
              type="submit"
            >
              {
                {
                  edit: "Сохранить изменения",
                  rollback: "Подтвердить возврат",
                  file: "Сохранить и прикрепить",
                  delete: "Удалить файл",
                  comment: "Добавить комментарий",
                  complete: "Завершить этап",
                  accept: "Принять в работу",
                  reject: "Отклонить",
                  create: manager
                    ? "Создать партнёрство"
                    : "Отправить заявку",
                }[kind]
              }
            </button>
          </div>
        </form>
      )}
    </Dialog>
  );
}