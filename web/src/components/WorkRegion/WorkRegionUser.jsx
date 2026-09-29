import { useCallback, useEffect, useRef, useState } from "react";
import Header from "../Header/Header";
import { useAppTheme } from "../../theme";
import { Dialog, Empty, Select, Tabs, Toast, usePreference } from "./WorkspaceUI";
import WorkspaceFilters from "./WorkspaceFilters";
import { IncomingRequests, WorkspaceChart } from "./WorkRegionUpdates";
import InteractionDetail from "./InteractionDetail";
import WorkspaceModal from "./WorkspaceModal";

import {
  INITIAL_FILTERS,
  matches,
  hasFilters,
  dateLabel,
  now,
  uid,
  readMemory,
  writeMemory,
  recordLabel,
  fetchInteractions,
  moveStageAPI,
  fetchStages,
  STEPS,
  OWNERS
} from "./workspaceModel";

import "./WorkRegionUser.css";

const DEADLINES = [
  ["mephi", "18 сентября · 16:00", "НИЯУ МИФИ", "Подписание документов", "Просрочено"],
  ["bmstu", "Сегодня · 17:00", "МГТУ им. Н. Э. Баумана", "Передача материалов", "Горящий срок"],
  ["itmo", "25 сентября", "ИТМО", "Обучение преподавателей", "Планово"]
];

function stageData() {
  return { comments: [], files: [], conditions: [false, false, false] };
}

function newInteraction(name, direction, owner = "", stage = 1) {
  return {
    id: uid(), name, badge: name.split(" ")[0].substring(0,4), direction, product: "", city: "РФ", owner, stage,
    done: false, status: "В работе", changed: now(), start: now().slice(0, 10), due: "",
    contract: { vendor: "", software: "", number: "", licenseEnd: "", signed: "Нет", transfer: "Не передавалось" },
    contact: { name: "", position: "", phone: "", email: "" },
    stages: { [stage]: stageData() }, history: []
  };
}

function moveStage(item, target, text, author) {
  const timestamp = now();
  const previous = item.stages[item.stage] || stageData();
  const entry = {
    ...previous,
    comments: [...previous.comments, { id: uid(), author, text, at: timestamp }]
  };
  const completed = target > item.stage;
  const stages = {
    ...item.stages,
    [item.stage]: { ...entry, completedAt: completed ? timestamp : "" },
    [target]: { ...(item.stages[target] || stageData()), completedAt: "" }
  };
  return {
    ...item, stage: target, done: false, changed: timestamp, stages,
    history: [...item.history, { ...entry, stage: item.stage, contract: { ...item.contract }, owner: item.owner, at: timestamp, outcome: completed ? "completed" : "returned" }]
  };
}

export default function WorkRegionUser({
  manager = false,
  empty = false,
  onLogout,
  canCompleteStage = false,
}) {
  const { theme } = useAppTheme();

  const [steps, setSteps] = useState(STEPS);
  const [data, setData] = useState({ interactions: [], incoming: [], total: 0 });

  useEffect(() => {
    let isMounted = true;
    fetchStages().then((backendStages) => {
      if (isMounted && backendStages.length > 0) {
        setSteps(backendStages);
      }
    });
    fetchInteractions().then((interactions) => {
      if (isMounted) {
        setData((prev) => ({ ...prev, interactions, total: interactions.length }));
      }
    });
    return () => { isMounted = false; };
  }, []);

  const [storedFilters, setFilters] = usePreference("workspace:filters:v2", INITIAL_FILTERS);
  const filters = { ...INITIAL_FILTERS, ...storedFilters };
  const [tab, setTab] = usePreference("workspace:tab", "process");

  const [openId, setOpenId] = useState(null);
  const [deadlineTab, setDeadlineTab] = useState("Все");
  const [modal, setModal] = useState(null);
  const [notice, setNotice] = useState(null);
  const [topBusy, setTopBusy] = useState("");

  const topLock = useRef(false);
  const timer = useRef(null);

  const closeNotice = useCallback(() => setNotice(null), []);
  const notify = useCallback((text, error = false) => setNotice({ id: uid(), text, error }), []);

  useEffect(() => {
    if (!empty) writeMemory(data);
  }, [data, empty]);

  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => {
    function outside(event) {
      document.querySelectorAll(".aw details[open]").forEach((node) => {
        if (!node.contains(event.target)) {
          node.removeAttribute("open");
        }
      });
    }

    function escape(event) {
      if (event.key !== "Escape") return;
      document.querySelectorAll(".aw details[open]").forEach((node) => {
        node.removeAttribute("open");
        node.querySelector("summary")?.focus();
      });
    }

    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, []);

  const visible = data.interactions.filter((item) => matches(item, filters));
  const filtered = hasFilters(filters);
  const currentItem = modal?.id ? data.interactions.find((item) => item.id === modal.id) : null;

  // Динамические каталоги без макетных констант
  const dynamicInstitutions = [...new Set(data.interactions.map((item) => item.name).filter(Boolean))];
  const dynamicDirections = [...new Set(data.interactions.map((item) => item.direction).filter(Boolean))];

  function patch(id, update) {
    setData((current) => ({
      ...current,
      interactions: current.interactions.map((item) => item.id === id ? update(item) : item),
    }));
  }

  function owner(id, value) {
    patch(id, (item) => ({ ...item, owner: value, changed: now() }));
    notify("Ответственный КАМ изменён.");
  }

  function condition(id, index, value) {
    patch(id, (item) => {
      const current = item.stages[item.stage] || stageData();
      return {
        ...item,
        stages: {
          ...item.stages,
          [item.stage]: {
            ...current,
            conditions: current.conditions.map((conditionValue, conditionIndex) => conditionIndex === index ? value : conditionValue),
          },
        },
      };
    });
  }

  function open(kind, payload = {}) {
    setModal({ kind, ...payload, key: uid() });
  }

  function download(file) {
    if (!file.blob) {
      notify("В макете нет содержимого этого файла. Для скачивания прикрепите файл с компьютера.", true);
      return;
    }
    const url = URL.createObjectURL(file.blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function topAction(kind) {
    if (topLock.current) return;
    topLock.current = true;
    setTopBusy(kind);
    timer.current = setTimeout(() => {
      topLock.current = false;
      setTopBusy("");
      notify(kind === "site" ? "В демонстрационном наборе новых заявок нет." : "В демонстрационном режиме подключение к LMS не выполняется.");
    }, 450);
  }

  function submit(form) {
    const currentModal = modal;
    const time = now();
    const author = OWNERS[0] || "Оператор";

    if (currentModal.kind === "accept" || currentModal.kind === "reject") {
      const accepted = currentModal.kind === "accept";
      setData((current) => ({
        ...current,
        incoming: current.incoming.filter((request) => request.id !== currentModal.request.id),
        total: current.total + (accepted ? 1 : 0),
        interactions: accepted ? [...current.interactions, newInteraction(currentModal.request.name, currentModal.request.program, form.owner, currentModal.request.source === "CMS" ? 2 : 1)] : current.interactions,
      }));
    } else if (currentModal.kind === "create") {
      if (manager) {
        setData((current) => ({
          ...current,
          total: current.total + 1,
          interactions: [...current.interactions, newInteraction(form.institution, form.direction, author)],
        }));
      } else {
        setData((current) => ({
          ...current,
          incoming: [...current.incoming, { id: uid(), source: "КАМ", name: form.institution, program: form.direction, initiator: author, createdAt: time, time: "Только что", details: [] }],
        }));
      }
    } else {
      patch(currentModal.id, (item) => {
        const current = item.stages[item.stage] || stageData();

        if (currentModal.kind === "edit") {
          return {
            ...item,
            owner: manager ? form.owner : item.owner,
            changed: time,
            contract: { vendor: form.vendor || "", software: form.software || "", number: form.number || "", licenseEnd: form.licenseEnd || "", signed: form.signed, transfer: form.transfer },
            contact: manager ? form.contact : item.contact,
          };
        }

        if (currentModal.kind === "rollback") {
          moveStageAPI(item.id, item.stage - 1).catch(err => console.error(err));
          return moveStage(item, item.stage - 1, "Возврат на доработку: " + form.comment.trim(), author);
        }

        if (currentModal.kind === "complete") {
          if ((!canCompleteStage && !current.conditions.every(Boolean)) || !current.files.length) {
            return item;
          }
          if (item.stage < steps.length) {
            moveStageAPI(item.id, item.stage + 1).catch(err => console.error(err));
            return moveStage(item, item.stage + 1, form.comment.trim(), author);
          }
          const finished = { ...current, completedAt: time, comments: [...current.comments, { id: uid(), author, text: form.comment.trim(), at: time }] };
          return {
            ...item, done: true, changed: time,
            stages: { ...item.stages, [steps.length]: finished },
            history: [...item.history, { ...finished, stage: steps.length, contract: { ...item.contract }, owner: item.owner, at: time, outcome: "completed" }],
          };
        }

        let next = current;
        let contract = item.contract;

        if (currentModal.kind === "comment") {
          next = { ...current, comments: [...current.comments, { id: uid(), author, text: form.comment.trim(), at: time }] };
        }

        if (currentModal.kind === "file") {
          next = {
            ...current,
            files: [...current.files, { id: uid(), name: form.file.name, size: form.file.size, blob: form.file, at: time, type: form.documentType }],
            conditions: current.conditions.map((value, index) => (index === 1 ? true : value)),
          };
          if (form.documentType === "license") {
            contract = { ...contract, number: form.number || "", licenseEnd: form.licenseEnd || "", signed: form.signed, transfer: form.transfer };
          }
          if (form.comment.trim()) {
            next.comments = [...next.comments, { id: uid(), author, text: form.comment.trim(), at: time }];
          }
        }

        if (currentModal.kind === "delete") {
          const files = current.files.filter((file) => file.id !== currentModal.file.id);
          next = { ...current, files, conditions: current.conditions.map((value, index) => index === 1 ? files.length > 0 : value) };
        }

        return { ...item, changed: time, contract, stages: { ...item.stages, [item.stage]: next } };
      });
    }

    setModal(null);
    notify({
      edit: "Параметры обновлены.", rollback: "Взаимодействие возвращено на предыдущий этап.", complete: "Этап завершён.",
      comment: "Комментарий добавлен.", file: "Документ прикреплён.", delete: "Файл удалён из этапа.",
      accept: "Заявка принята в работу.", reject: "Заявка отклонена.", create: manager ? "Партнёрство создано." : "Заявка отправлена руководителю."
    }[currentModal.kind]);
  }

  const baseline = empty ? [0, 0, 0, 0] : manager ? [24, 6, 2, 8] : [8, 2, 1, 3];
  const completedCount = data.interactions.filter((item) => item.done).length;

  const processValues = !data.interactions.length ? [0, 0, 0, 0] : filtered ? [
    visible.filter((item) => !item.done).length,
    visible.filter((item) => item.status === "Требует внимания").length,
    visible.filter((item) => item.status === "Просрочено").length,
    visible.filter((item) => item.done).length,
  ] : [
    baseline[0] + data.interactions.length - (empty ? 0 : 3) - completedCount,
    baseline[1], baseline[2], baseline[3] + completedCount,
  ];

  const learningValues = !data.interactions.length ? [0, 0, 0, "0 / 0"] : filtered ? ["—", "—", "—", "—"] : manager ? [1284, 376, 18, "42 / 50"] : [320, 96, 4, "8 / 12"];

  const cards = tab === "process"
    ? [["В работе", "взаимодействия"], ["Требуют внимания", "взаимодействий"], ["Просрочено", "взаимодействия"], ["Завершено за месяц", "взаимодействий"]]
    : [["Студентов на обучении", "студента"], ["Заявок с сайта", "заявок"], ["Параллельных потоков", "потоков"], ["Активные лицензии ПО", ""]];

  const values = tab === "process" ? processValues : learningValues;

  function detail(item, stage) {
    const displayItem = canCompleteStage ? {
      ...item, stages: { ...item.stages, [item.stage]: { ...(item.stages[item.stage] || stageData()), conditions: [true, true, true] } }
    } : item;

    return (
      <InteractionDetail
        key={item.id + ":" + item.stage}
        item={displayItem}
        initialStage={stage}
        manager={manager}
        steps={steps}
        onAction={open}
        onOwner={owner}
        onCondition={condition}
        onDownload={download}
      />
    );
  }

  const deadlines = DEADLINES.filter(([id, , , , status]) =>
    visible.some((item) => item.id === id && !item.done) && (deadlineTab === "Все" || status === { Просрочено: "Просрочено", Горящие: "Горящий срок", Плановые: "Планово" }[deadlineTab])
  );

  return (
    <div className="aw" data-theme={theme}>
      <Header activePage="Главная" onLogout={onLogout} />
      <main className="aw-page">
        <div className="aw-heading">
          <div>
            <h1>Рабочая область</h1>
            <p className="at-muted">Контроль взаимодействий и текущих этапов работы</p>
          </div>
          <div className="aw-top-actions">
            <button type="button" className="at-button" disabled={Boolean(topBusy)} onClick={() => topAction("site")}>
              {topBusy === "site" ? "Получение заявки…" : "Получить заявку с сайта"}
            </button>
            <button type="button" className="at-button" disabled={Boolean(topBusy)} onClick={() => topAction("lms")}>
              {topBusy === "lms" ? "Синхронизация…" : "Синхронизировать с LMS"}
            </button>
          </div>
        </div>

        <WorkspaceFilters value={filters} onChange={setFilters} interactions={data.interactions} />
        <Tabs value={tab} options={[["process", "Процессы"], ["learning", "Обучение и продукты"]]} onChange={setTab} />

        <div className="aw-stats">
          {cards.map(([label, unit], index) => (
            <section className="aw-panel aw-stat" key={label}>
              <p className="at-muted">{label}</p>
              <div>
                <strong className={tab === "process" && index === 1 ? "aw-accent" : tab === "process" && index === 2 ? "aw-danger" : ""}>
                  {typeof values[index] === "number" ? values[index].toLocaleString("ru-RU") : values[index]}
                </strong> <small className="at-muted">{unit}</small>
              </div>
              {tab === "learning" && index === 3 && !filtered && (
                <div className="aw-track"><i style={{ width: data.interactions.length ? manager ? "84%" : "66.67%" : "0%" }} /></div>
              )}
            </section>
          ))}
        </div>

        <div className="aw-dashboard">
          <WorkspaceChart
            interactions={data.interactions}
            filters={filters}
            manager={manager}
            empty={!data.interactions.length}
            notify={notify}
          />
          <section className="aw-panel aw-deadlines">
            <div className="aw-box-head">
              <h3>Ближайшие сроки</h3><a className="aw-link aw-accent" href="#/calendar">Все →</a>
            </div>
            <Tabs value={deadlineTab} options={["Все", "Просрочено", "Горящие", "Плановые"].map((label) => [label, label])} onChange={setDeadlineTab} />
            {deadlines.length ? (
              deadlines.map(([id, date, name, stage, status]) => (
                <div className="aw-deadline" key={id}>
                  <small className="at-muted">{date}</small><strong>{name}</strong><small className="at-muted">{stage}</small><span data-status={status}>{status}</span>
                </div>
              ))
            ) : (
              <Empty title="Ближайших сроков пока нет">События появятся после создания взаимодействий.</Empty>
            )}
          </section>
        </div>

        <WorkspaceChart
          kind="kam"
          interactions={data.interactions}
          filters={filters}
          manager={manager}
          empty={!data.interactions.length}
          notify={notify}
        />

        {manager && <IncomingRequests requests={data.incoming} onAccept={(request) => open("accept", { request })} onReject={(request) => open("reject", { request })} />}

        <div className="aw-section-title aw-registry-title">
          <h2>Взаимодействия</h2>
          <span className="at-muted">{recordLabel(filtered ? visible.length : data.total)}</span>
          <button type="button" className="at-button" onClick={() => open("create")}>+ Создать партнёрство</button>
        </div>

        <div className="aw-interactions">
          {visible.map((item) => (
            <article className="aw-panel aw-interaction" key={item.id}>
              <div className="aw-summary">
                <button type="button" className="aw-org" onClick={() => setOpenId(openId === item.id ? null : item.id)} aria-expanded={openId === item.id}>
                  <span className="aw-badge">{item.badge}</span>
                  <span><strong>{item.name}</strong><span>{item.direction}</span><small className="at-muted">{item.city}</small></span>
                </button>
                <div className="aw-progress">
                  <div className="aw-segments">
                    {steps.map((step, index) => (
                      <i key={step} className={item.done || index < item.stage - 1 ? "done" : index === item.stage - 1 ? "current" : ""} />
                    ))}
                  </div>
                  <small className="at-muted">Текущий этап: {String(item.stage).padStart(2, "0")}</small>
                  <span>{steps[item.stage - 1] || steps[0]}</span>
                </div>
                <div className="aw-summary-owner">
                  <small className="at-muted">Ответственный{manager ? " КАМ" : ""}</small>
                  {manager ? (
                    <Select label="Ответственный КАМ" value={item.owner} options={[...OWNERS.map(o => ({value: o, label: o})), { value: "", label: "Не назначен" }]} onChange={(value) => owner(item.id, value)} />
                  ) : (
                    <strong>{item.owner || "Не назначен"}</strong>
                  )}
                  <small className="at-muted">{dateLabel(item.changed)}</small>
                </div>
                <button type="button" className="at-icon" aria-label={openId === item.id ? "Свернуть" : "Раскрыть"} onClick={() => setOpenId(openId === item.id ? null : item.id)}>
                  {openId === item.id ? "⌃" : "⌄"}
                </button>
              </div>
              {openId === item.id && detail(item)}
            </article>
          ))}
        </div>

        {!visible.length && (
          <Empty title={data.interactions.length ? "Взаимодействия не найдены" : "Взаимодействий пока нет"}>
            {data.interactions.length ? "Измените параметры фильтрации." : "Создайте партнёрство или получите данные из внешней системы, чтобы начать работу."}
          </Empty>
        )}
      </main>

      {modal?.kind === "detail" && currentItem && (
        <Dialog title={currentItem.name + " · " + currentItem.direction} wide onClose={() => setModal(null)}>
          {detail(currentItem, modal.stage)}
        </Dialog>
      )}

      {modal && modal.kind !== "detail" && (
        <WorkspaceModal
          key={modal.key}
          modal={modal}
          item={currentItem}
          manager={manager}
          institutions={dynamicInstitutions}
          directions={dynamicDirections}
          onClose={() => setModal(null)}
          onSubmit={submit}
        />
      )}
      <Toast notice={notice} onClose={closeNotice} />
    </div>
  );
}