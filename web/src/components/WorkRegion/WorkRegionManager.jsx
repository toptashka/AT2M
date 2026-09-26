import { useState } from "react";
import WorkRegionUser from "./WorkRegionUser";
import "./WorkRegionManager.css";

const requests = [
  {
    id: "bmstu-request",
    source: "CMS",
    name: "МГТУ им. Н. Э. Баумана",
    program: "DevOps",
    time: "Сегодня, 14:32",
    initiator: "Мария Сергеева",
    details: [
      ["Телефон", "+7 999 123-45-67"],
      ["Почта", "m.sergeeva@bmstu.ru"],
      ["Студентов", "120"],
    ],
  },
  {
    id: "itmo-request",
    source: "КАМ",
    name: "Университет ИТМО",
    program: "Облачные технологии",
    time: "Сегодня, 13:10",
    initiator: "Александр Иванов",
    details: [
      ["Контакт вуза", "Елена Петрова"],
      ["Телефон", "+7 921 555-20-14"],
      ["Почта", "e.petrova@itmo.ru"],
      ["Студентов", "80"],
    ],
  },
  {
    id: "mephi-request",
    source: "CMS",
    name: "НИЯУ МИФИ",
    program: "Информационная безопасность",
    time: "Сегодня, 12:45",
    initiator: "Анна Кузнецова",
    details: [
      ["Телефон", "+7 916 234-18-52"],
      ["Почта", "a.kuznetsova@mephi.ru"],
    ],
  },
];

export default function WorkRegionManager({ onAction }) {
  const [requestsOpen, setRequestsOpen] = useState(true);

  return (
    <WorkRegionUser manager onAction={onAction}>
      <section className="wu-panel wm-performance">
        <div className="wu-panel-head">
          <h3>Эффективность и нагрузка КАМов</h3>
          <button
            className="wu-button wu-filter"
            onClick={() => onAction?.("kam-filter")}
          >
            КАМ: Все <span className="wu-chevron" />
          </button>
        </div>

        <div className="wu-tabs wm-tabs">
          {[
            "Запуски",
            "В активной работе",
            "SLA / просрочки",
            "Скорость прохождения",
          ].map((label, index) => (
            <button
              key={label}
              className={index === 0 ? "is-active" : ""}
              aria-pressed={index === 0}
              onClick={() => index > 0 && onAction?.("kam-metric", label)}
            >
              {label}
            </button>
          ))}
        </div>

        <p className="wu-muted wu-small wm-chart-label">
          Запуски программ · количество
        </p>

        <div className="wu-bars">
          {[
            ["Иванов А.А.", 14],
            ["Смирнова М.С.", 11],
            ["Соколов Д.В.", 9],
          ].map(([name, count]) => (
            <div className="wu-bar-row" key={name}>
              <span>{name}</span>
              <div className="wu-track">
                <span style={{ width: `${count / 14 * 100}%` }} />
              </div>
              <span>{count}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="wm-incoming">
        <div className="wm-incoming-heading">
          <button
            className="wm-incoming-toggle"
            aria-expanded={requestsOpen}
            aria-controls="wm-request-list"
            onClick={() => setRequestsOpen((value) => !value)}
          >
            <span className={`wu-chevron${requestsOpen ? "" : " is-closed"}`} />
            Входящие запросы
          </button>
          <span className="wu-muted wu-small">· 8 новых</span>
          <button
            className="wu-button wu-filter"
            onClick={() => onAction?.("request-sort")}
          >
            Сначала новые <span className="wu-chevron" />
          </button>
        </div>

        {requestsOpen && (
          <>
            <div className="wm-request-list" id="wm-request-list">
              {requests.map((request) => (
                <article className="wu-panel wm-request" key={request.id}>
                  <div className="wm-request-title">
                    <span className="wm-source">{request.source}</span>
                    <h4>{request.name}</h4>
                    <p>{request.program}</p>
                    <small className="wu-muted">{request.time}</small>
                  </div>

                  <div className="wm-initiator">
                    <p className="wu-muted wu-small">Инициатор</p>
                    <p>{request.initiator}</p>
                  </div>

                  <dl className="wm-request-details">
                    {request.details.map(([label, value]) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="wm-request-actions">
                    <button
                      className="wu-button"
                      onClick={() => onAction?.("reject-request", request.id)}
                    >
                      Отклонить
                    </button>
                    <button
                      className="wu-button wu-primary"
                      onClick={() => onAction?.("accept-request", request.id)}
                    >
                      Принять в работу
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <button
              className="wm-show-more"
              onClick={() => onAction?.("more-requests")}
            >
              Показать ещё 5
            </button>
          </>
        )}
      </section>
    </WorkRegionUser>
  );
}