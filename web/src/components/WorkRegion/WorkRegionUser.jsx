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
  fetchManagers,
  fetchCatalogs,
  STEPS
} from "./workspaceModel";

import "./WorkRegionUser.css";

function stageData() {
  return { comments: [], files: [], conditions: [false, false, false] };
}

function newInteraction(name, direction, owner = "", stage = 1) {
  return {
    id: uid(), name, badge: name ? name.split(" ")[0].substring(0, 4).toUpperCase() : "ВУЗ",
    direction, product: "", city: "РФ", owner, stage,
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
  const [managersList, setManagersList] = useState([]);
  const [catalogs, setCatalogs] = useState({ programs: [], universities: [] });
  const [data, setData] = useState({ interactions: [], incoming: [], total: 0 });

  useEffect(() => {
    let isMounted = true;
    fetchStages().then((backendStages) => {
      if (isMounted && backendStages.length > 0) setSteps(backendStages);
    });
    fetchManagers().then((list) => {
      if (isMounted && Array.isArray(list)) setManagersList(list);
    });
    fetchCatalogs().then((res) => {
      if (isMounted) setCatalogs(res);
    });
    fetchInteractions().then((interactions) => {
      if (isMounted) setData((prev) => ({ ...prev, interactions, total: interactions.length }));
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

  const visible = data.interactions.filter((item) => matches(item, filters));
  const filtered = hasFilters(filters);
  const currentItem = modal?.id ? data.interactions.find((item) => item.id === modal.id) : null;

  const dynamicInstitutions = [
    ...new Set([...catalogs.universities, ...data.interactions.map((i) => i.name)].filter(Boolean))
  ];
  const dynamicPrograms = [
    ...new Set([...catalogs.programs.map((p) => p.name || p.direction), ...data.interactions.map((i) => i.direction)].filter(Boolean))
  ];

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
            conditions: current.conditions.map((cv, ci) => ci === index ? value : cv),
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
      notify("В макете нет содержимого этого файла.", true);
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
      notify(kind === "site" ? "Новых заявок с сайта нет." : "Синхронизация с LMS завершена.");
    }, 450);
  }

  function submit(form) {
    const currentModal = modal;
    const time = now();
    const author = managersList[0] || "КАМ";

    if (currentModal.kind === "accept" || currentModal.kind === "reject") {
      const accepted = currentModal.kind === "accept";
      setData((current) => ({
        ...current,
        incoming: current.incoming.filter((r) => r.id !== currentModal.request.id),
        total: current.total + (accepted ? 1 : 0),
        interactions: accepted ? [...current.interactions, newInteraction(currentModal.request.name, currentModal.request.program, form.owner, currentModal.request.source === "CMS" ? 2 : 1)] : current.interactions,
      }));
    } else if (currentModal.kind === "create") {
      setData((current) => ({
        ...current,
        total: current.total + 1,
        interactions: [...current.interactions, newInteraction(form.institution, form.direction, form.owner || author)],
      }));
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
          moveStageAPI(item.id, item.stage - 1).catch(console.error);
          return moveStage(item, item.stage - 1, "Возврат на доработку: " + form.comment.trim(), author);
        }

        if (currentModal.kind === "complete") {
          if ((!canCompleteStage && !current.conditions.every(Boolean)) || !current.files.length) return item;
          if (item.stage < steps.length) {
            moveStageAPI(item.id, item.stage + 1).catch(console.error);
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
        if (currentModal.kind === "comment") {
          next = { ...current, comments: [...current.comments, { id: uid(), author, text: form.comment.trim(), at: time }] };
        }
        if (currentModal.kind === "file") {
          next = {
            ...current,
            files: [...current.files, { id: uid(), name: form.file.name, size: form.file.size, blob: form.file, at: time, type: form.documentType }],
            conditions: current.conditions.map((v, i) => (i === 1 ? true : v)),
          };
        }
        return { ...item, changed: time, stages: { ...item.stages, [item.stage]: next } };
      });
    }

    setModal(null);
    notify("Действие успешно выполнено.");
  }

  const completedCount = data.interactions.filter((i) => i.done).length;
  const cards = tab === "process"
    ? [
        ["В работе", visible.filter((i) => !i.done).length, "взаимодействия"],
        ["Требуют внимания", visible.filter((i) => i.status === "Требует внимания").length, "взаимодействий"],
        ["Просрочено", visible.filter((i) => i.status === "Просрочено").length, "взаимодействия"],
        ["Завершено", completedCount, "взаимодействий"]
      ]
    : [
        ["Студентов на обучении", 0, "студентов"],
        ["Заявок с сайта", data.incoming.length, "заявок"],
        ["Параллельных потоков", 0, "потоков"],
        ["Активные лицензии ПО", "0 / 0", ""]
      ];

  function detail(item, stage) {
    return (
      <InteractionDetail
        key={item.id + ":" + item.stage}
        item={item}
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

        <WorkspaceFilters
          value={filters}
          onChange={setFilters}
          interactions={data.interactions}
          managers={managersList}
        />
        <Tabs value={tab} options={[["process", "Процессы"], ["learning", "Обучение и продукты"]]} onChange={setTab} />

        <div className="aw-stats">
          {cards.map(([label, count, unit]) => (
            <section className="aw-panel aw-stat" key={label}>
              <p className="at-muted">{label}</p>
              <div>
                <strong>{count}</strong> <small className="at-muted">{unit}</small>
              </div>
            </section>
          ))}
        </div>

        <div className="aw-dashboard">
          <WorkspaceChart
            kind="demand"
            filters={filters}
            manager={manager}
            empty={!data.interactions.length}
            interactions={data.interactions}
            notify={notify}
          />
          <section className="aw-panel aw-deadlines">
            <div className="aw-box-head">
              <h3>Ближайшие сроки</h3><a className="aw-link aw-accent" href="#/calendar">Все →</a>
            </div>
            <Tabs value={deadlineTab} options={["Все", "Просрочено", "Горящие", "Плановые"].map((l) => [l, l])} onChange={setDeadlineTab} />
            <Empty title="Ближайших сроков пока нет">События появятся после создания взаимодействий.</Empty>
          </section>
        </div>

        <WorkspaceChart
          kind="kam"
          filters={filters}
          manager={manager}
          empty={!managersList.length && !data.interactions.length}
          managers={managersList}
          interactions={data.interactions}
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
                <button type="button" className="aw-org" onClick={() => setOpenId(openId === item.id ? null : item.id)}>
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
                  <span>{steps[item.stage - 1] || steps[0] || "—"}</span>
                </div>
                <div className="aw-summary-owner">
                  <small className="at-muted">Ответственный{manager ? " КАМ" : ""}</small>
                  {manager ? (
                    <Select
                      label="Ответственный КАМ"
                      value={item.owner}
                      options={[...managersList.map((o) => ({ value: o, label: o })), { value: "", label: "Не назначен" }]}
                      onChange={(value) => owner(item.id, value)}
                    />
                  ) : (
                    <strong>{item.owner || "Не назначен"}</strong>
                  )}
                  <small className="at-muted">{dateLabel(item.changed)}</small>
                </div>
                <button type="button" className="at-icon" onClick={() => setOpenId(openId === item.id ? null : item.id)}>
                  {openId === item.id ? "⌃" : "⌄"}
                </button>
              </div>
              {openId === item.id && detail(item)}
            </article>
          ))}
        </div>

        {!visible.length && (
          <Empty title={data.interactions.length ? "Взаимодействия не найдены" : "Взаимодействий пока нет"}>
            {data.interactions.length ? "Измените параметры фильтрации." : "Создайте партнёрство или загрузите справочники, чтобы начать работу."}
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
          programs={dynamicPrograms}
          managers={managersList}
          onClose={() => setModal(null)}
          onSubmit={submit}
        />
      )}
      <Toast notice={notice} onClose={closeNotice} />
    </div>
  );
}