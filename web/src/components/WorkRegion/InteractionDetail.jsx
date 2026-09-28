import { useState } from "react";
import { Select, CheckIcon } from "./WorkspaceUI";
import {
  OWNERS,
  STEPS,
  dateLabel,
  stageData,
  maskContact,
  listText,
} from "./workspaceModel";

import pdfIcon from "../../assets/pdf.svg";
import pngIcon from "../../assets/png.svg";
import closeIcon from "../../assets/Close.svg";
import downloadIcon from "../../assets/download.svg";
import exclamatoryIcon from "../../assets/exclamatory.svg";

const icons = import.meta.glob("../../assets/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
});

function fileIcon(name) {
  const extension = name.split(".").pop().toLowerCase();

  if (extension === "pdf") return pdfIcon;
  if (extension === "png") return pngIcon;

  return icons["../../assets/" + extension + ".svg"];
}

export function Contract({ value, onEdit }) {
  const fields = [
    ["Вендор", listText(value.vendor)],
    [
      "ПО",
      Array.isArray(value.software)
        ? value.software.join(", ")
        : value.software,
    ],
    ["Номер договора", value.number],
    ["Подписание лицензии", value.signed],
    ["Срок действия лицензии", dateLabel(value.licenseEnd)],
    [
      "Статус передачи ПО",
      value.transfer === "Передано вузу"
        ? "Передано учреждению"
        : value.transfer,
    ],
  ];

  return (
    <section className="aw-box">
      <div className="aw-box-head">
        <h3>Договор и лицензии</h3>

        {onEdit && (
          <button
            type="button"
            className="aw-link"
            onClick={onEdit}
          >
            Редактировать
          </button>
        )}
      </div>

      <dl className="aw-contract">
        {fields.map(([name, text]) => (
          <div key={name}>
            <dt>{name}</dt>
            <dd>{text || "—"}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default function InteractionDetail({
  item,
  manager,
  onAction,
  onOwner,
  onCondition,
  onDownload,
  initialStage,
}) {
  const [selected, setSelected] = useState(
    initialStage || item.stage
  );

  const archived = selected < item.stage || item.done;
  const future = selected > item.stage;
  const current = !archived && !future;

  const data = item.stages[selected] || stageData();

  const contact = manager
    ? item.contact
    : maskContact(item.contact);

  const canComplete =
    data.conditions.every(Boolean) && data.files.length > 0;

  const snapshot = [...item.history]
    .reverse()
    .find(
      (entry) =>
        entry.stage === selected && entry.outcome === "completed"
    );

  const contract =
    archived && snapshot ? snapshot.contract : item.contract;

  const action = (kind, extra = {}) =>
    onAction(kind, {
      id: item.id,
      stage: selected,
      ...extra,
    });

  return (
    <div className="aw-detail">
      <aside className="aw-workflow">
        <h3>Этапы взаимодействия</h3>

        <small className="at-muted">
          Текущий этап: {String(item.stage).padStart(2, "0")}
        </small>

        <ol>
          {STEPS.map((name, index) => {
            const number = index + 1;
            const done = number < item.stage || item.done;

            return (
              <li
                key={name}
                className={number === selected ? "selected" : ""}
              >
                <button
                  type="button"
                  onClick={() => setSelected(number)}
                  aria-current={
                    number === selected ? "step" : undefined
                  }
                >
                  <span
                    className={
                      "aw-step-dot " +
                      (done
                        ? "done"
                        : number === item.stage
                          ? "current"
                          : "")
                    }
                  >
                    {done && <CheckIcon />}
                  </span>

                  <span>
                    {String(number).padStart(2, "0")}. {name}

                    {done && (
                      <small>
                        Завершено{" "}
                        {dateLabel(
                          item.stages[number]?.completedAt
                        )}
                      </small>
                    )}

                    {!item.done && number === item.stage && (
                      <small>
                        Текущий этап
                        <br />
                        До {dateLabel(item.due)}
                      </small>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </aside>

      <div className="aw-detail-main">
        <div className="aw-stage-top">
          <small className="at-muted">
            Этап {String(selected).padStart(2, "0")}
          </small>

          <span
            className={
              archived
                ? "aw-purple"
                : future
                  ? "at-muted"
                  : "aw-accent"
            }
          >
            {archived ? (
              <>
                <CheckIcon /> Завершено
              </>
            ) : future ? (
              "○ Не начат"
            ) : (
              "● В работе"
            )}
          </span>
        </div>

        <h2>{STEPS[selected - 1]}</h2>

        {current && (
          <p className="at-muted">
            до {dateLabel(item.due)}
          </p>
        )}

        {current &&
          (manager ? (
            <div className="aw-owner-field">
              <small className="at-muted">
                Ответственный КАМ
              </small>

              <Select
                label="Ответственный КАМ"
                value={item.owner}
                options={[
                  ...OWNERS,
                  { value: "", label: "Не назначен" },
                ]}
                onChange={(value) => onOwner(item.id, value)}
              />
            </div>
          ) : (
            <p>
              Ответственный — {item.owner || "Не назначен"}
            </p>
          ))}

        {current && (
          <dl className="aw-meta">
            <div>
              <dt>Начало</dt>
              <dd>{dateLabel(item.start)}</dd>
            </div>

            <div>
              <dt>Срок</dt>
              <dd>{dateLabel(item.due)}</dd>
            </div>

            <div>
              <dt>Последнее изменение</dt>
              <dd>{dateLabel(item.changed)}</dd>
            </div>
          </dl>
        )}

        <Contract
          value={contract}
          onEdit={current ? () => action("edit") : undefined}
        />

        {future ? (
          <div className="aw-comment">
            Этап станет доступен после завершения:{" "}
            {String(selected - 1).padStart(2, "0")}.{" "}
            {STEPS[selected - 2]}
          </div>
        ) : (
          <>
            {current && (
              <>
                <section className="aw-box">
                  <h3>Контакты вуза</h3>
                  <p>{contact.name || "—"}</p>

                  <dl className="aw-contact">
                    {contact.position?.trim() && (
                      <div>
                        <dt>Должность</dt>
                        <dd>{contact.position}</dd>
                      </div>
                    )}

                    <div>
                      <dt>Телефон</dt>
                      <dd>{contact.phone || "—"}</dd>
                    </div>

                    <div>
                      <dt>Почта</dt>
                      <dd>{contact.email || "—"}</dd>
                    </div>
                  </dl>
                </section>

                <section className="aw-box">
                  <h3>Условия завершения</h3>

                  {[
                    "Получены необходимые материалы",
                    "Прикреплён обязательный документ",
                    "Подтверждено целевое действие",
                  ].map((label, index) => (
                    <button
                      type="button"
                      key={label}
                      className="aw-condition"
                      disabled={index === 1}
                      aria-pressed={data.conditions[index]}
                      onClick={() =>
                        onCondition(
                          item.id,
                          index,
                          !data.conditions[index]
                        )
                      }
                    >
                      {data.conditions[index] ? (
                        <CheckIcon />
                      ) : (
                        "○"
                      )}{" "}
                      {label}
                    </button>
                  ))}
                </section>
              </>
            )}

            <section>
              <h3>Комментарии</h3>

              {data.comments.length ? (
                data.comments.map((comment) => (
                  <div
                    className="aw-comment"
                    key={comment.id}
                  >
                    <span className="aw-mini-avatar">
                      {comment.author
                        .split(" ")
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join("")}
                    </span>

                    <div>
                      <p>
                        <strong>{comment.author}</strong>

                        <small className="at-muted">
                          {dateLabel(comment.at)}
                        </small>
                      </p>

                      <p>{comment.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="at-muted">
                  Комментариев пока нет
                </p>
              )}
            </section>

            <section>
              <h3>Файлы</h3>

              {data.files.map((file) => (
                <div className="aw-file aw-box" key={file.id}>
                  {fileIcon(file.name) ? (
                    <img
                      src={fileIcon(file.name)}
                      width="24"
                      height="28"
                      alt=""
                    />
                  ) : (
                    <span className="aw-purple">FILE</span>
                  )}

                  <div>
                    <strong>{file.name}</strong>

                    <small className="at-muted">
                      {file.name.split(".").pop().toUpperCase()}
                      {" · "}
                      {(file.size / 1048576).toLocaleString(
                        "ru-RU",
                        { maximumFractionDigits: 1 }
                      )}
                      {" МБ · "}
                      {dateLabel(file.at)}
                    </small>
                  </div>

                  <button
                    type="button"
                    className="at-icon"
                    aria-label={"Скачать " + file.name}
                    onClick={() => onDownload(file)}
                  >
                    <img src={downloadIcon} alt="" />
                  </button>

                  {current && (
                    <button
                      type="button"
                      className="at-icon"
                      aria-label={"Удалить " + file.name}
                      onClick={() => action("delete", { file })}
                    >
                      <img
                        className="at-close-asset"
                        src={closeIcon}
                        alt=""
                      />
                    </button>
                  )}
                </div>
              ))}

              {!data.files.length && (
                <p className="at-muted">Файлов пока нет</p>
              )}
            </section>

            {current && (
              <>
                <p className="aw-completion at-muted">
                  {!canComplete && (
                    <>
                      <span className="aw-warning">
                        <img src={exclamatoryIcon} alt="" />
                      </span>{" "}
                      Выполните все обязательные условия этапа
                    </>
                  )}
                </p>

                <div className="aw-detail-actions">
                  <button
                    type="button"
                    className="at-button"
                    onClick={() => action("comment")}
                  >
                    + Комментарий
                  </button>

                  <button
                    type="button"
                    className="at-button"
                    onClick={() => action("file")}
                  >
                    + Файл
                  </button>

                  <button
                    type="button"
                    className="at-button aw-return"
                    disabled={item.stage <= 1}
                    onClick={() => action("rollback")}
                  >
                    ← Вернуть на доработку
                  </button>

                  <button
                    type="button"
                    className="at-button primary"
                    disabled={!canComplete}
                    onClick={() => action("complete")}
                  >
                    Завершить этап
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}