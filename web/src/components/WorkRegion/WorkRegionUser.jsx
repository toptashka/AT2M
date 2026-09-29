import { useCallback, useEffect, useState } from "react";
import Header from "../Header/Header";
import { useAppTheme } from "../../theme";
import { Dialog, Empty, Select, Tabs, Toast, usePreference } from "./WorkspaceUI";
import WorkspaceFilters from "./WorkspaceFilters";
import { IncomingRequests, WorkspaceChart } from "./WorkRegionUpdates";
import InteractionDetail from "./InteractionDetail";
import WorkspaceModal from "./WorkspaceModal";
import DeadlineSettings from "./DeadlineSettings.jsx";
import { useAuth } from "../../auth.jsx";

import {
  INITIAL_FILTERS,
  matches,
  hasFilters,
  dateLabel,
  uid,
  recordLabel,
  fetchInteractions,
  fetchRequests,
  decideRequest,
  createPartnershipAPI,
  updatePartnershipAPI,
  moveStageAPI,
  fetchStages,
  fetchManagers,
  fetchCatalogs,
  fetchInteraction,
  expected,
  saveCondition,
  saveComment,
  uploadFile,
  deleteFile,
  downloadFile,
  STEPS
} from "./workspaceModel";

import "./WorkRegionUser.css";

export default function WorkRegionUser({
  manager = false,
  onLogout,
}) {
  const { theme } = useAppTheme();
  const user = useAuth();

  const [steps, setSteps] = useState(STEPS);
  const [managersList, setManagersList] = useState([]);
  const [catalogs, setCatalogs] = useState({ programs: [], universities: [] });
  const [data, setData] = useState({ interactions: [], incoming: [], total: 0 });
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    let active = true;
    async function refresh() {
      try {
        const [names, owners, references, interactions, requests] = await Promise.all([
          fetchStages(), fetchManagers().catch(error => { if (active) setNotice({ id: uid(), text: error.message, error: true }); return []; }), fetchCatalogs(), fetchInteractions(), fetchRequests()
        ]);
        if (!active) return;
        setSteps(names);
        setManagersList(owners);
        setCatalogs(references);
        setData(prev => ({ ...prev, interactions, incoming: requests, total: interactions.length }));
      } catch (error) {
        if (active) setNotice({ id: uid(), text: error.message, error: true });
      }
    }
    refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("catalogs:updated", refresh);
    window.addEventListener("workflow:updated", refresh);
    return () => {
      active = false;
      window.removeEventListener("focus", refresh);
      window.removeEventListener("catalogs:updated", refresh);
      window.removeEventListener("workflow:updated", refresh);
    };
  }, []);

  const [storedFilters, setFilters] = usePreference("workspace:filters:v2", INITIAL_FILTERS);
  const filters = { ...INITIAL_FILTERS, ...storedFilters };
  const [tab, setTab] = usePreference("workspace:tab", "process");

  const [openId, setOpenId] = useState(null);
  const [deadlineTab, setDeadlineTab] = useState("Все");
  const [modal, setModal] = useState(null);


  const closeNotice = useCallback(() => setNotice(null), []);
  const notify = useCallback((text, error = false) => setNotice({ id: uid(), text, error }), []);

  const visible = data.interactions.filter((item) => matches(item, filters));
  const filtered = hasFilters(filters);
  const currentItem = modal?.id ? data.interactions.find((item) => item.id === modal.id) : null;

  const dynamicInstitutions = [
    ...new Set([...catalogs.universities, ...data.interactions.map((i) => i.name)].filter(Boolean))
  ];
  const dynamicPrograms = [
    ...new Set([...catalogs.programs.map((p) => p.direction).filter((name) => name && name !== "ИТ-направление"), ...data.interactions.map((i) => i.direction)].filter(Boolean))
  ];

  function replace(item) {
    setData(current => ({ ...current, interactions: current.interactions.map(row => row.id === item.id ? item : row) }));
    if (item.stepNames.length) setSteps(item.stepNames);
  }

  async function toggle(id) {
    if (openId === id) { setOpenId(null); return; }
    try {
      const item = await fetchInteraction(id);
      replace(item);
      setOpenId(id);
    } catch (error) { notify(error.message, true); }
  }

  async function owner(id, value) {
    if (!manager) return;
    const item = data.interactions.find(row => row.id === id);
    try {
      replace(await updatePartnershipAPI(id, { ...expected(item), manager_name: value }));
      notify("Ответственный сохранён.");
    } catch (error) { notify(error.message, true); }
  }

  async function condition(id, index, value) {
    const item = data.interactions.find(row => row.id === id);
    try { replace(await saveCondition(item, index, value)); }
    catch (error) { notify(error.message, true); }
  }

  function open(kind, payload = {}) {
    if (kind === "create" && (!dynamicInstitutions.length || !dynamicPrograms.length)) {
      notify("Загрузите справочники учреждений и ИТ-направлений.", true);
      return;
    }
    setModal({ kind, ...payload, key: uid() });
  }

  async function download(file) {
    try { await downloadFile(file); }
    catch (error) { notify(error.message, true); }
  }

  function topAction() {
    notify("Интеграция с внешней системой ещё не настроена.", true);
  }

  async function submit(form) {
    const currentModal = modal;
    const item = data.interactions.find(row => row.id === currentModal.id);
    let updated;
    if (currentModal.kind === "create") {
      updated = await createPartnershipAPI({ university_name: form.institution, program_name: form.direction, manager_name: manager ? form.owner : undefined });
      if (updated.kind === "request") {
        setData(current => ({ ...current, incoming: [updated.request, ...current.incoming] }));
        setModal(null);
        notify("Заявка отправлена руководителю. Взаимодействие появится после одобрения.");
        return;
      }
      setData(current => ({ ...current, interactions: [...current.interactions, updated], total: current.total + 1 }));
      setOpenId(updated.id);
    } else if (currentModal.kind === "edit") {
      const payload = {
        ...expected(item),
        contract: { vendor: form.vendor || "", software: form.software || "", number: form.number || "", licenseEnd: form.licenseEnd || "", signed: form.signed || "Нет", transfer: form.transfer || "Не передавалось" },
        contact: form.contact
      };
      if (manager && form.owner !== item.owner) payload.manager_name = form.owner;
      updated = await updatePartnershipAPI(item.id, payload);
    } else if (currentModal.kind === "comment") {
      updated = await saveComment(item, form.comment);
    } else if (currentModal.kind === "file") {
      updated = await uploadFile(item, form);
    } else if (currentModal.kind === "delete") {
      updated = await deleteFile(item, currentModal.file);
    } else if (currentModal.kind === "rollback") {
      updated = await moveStageAPI(item, item.stage - 1, form.comment);
    } else if (currentModal.kind === "complete") {
      const last = item.stage === item.stepNames.length;
      updated = await moveStageAPI(item, last ? item.stage : item.stage + 1, form.comment, last);
    } else if (["accept", "reject"].includes(currentModal.kind)) {
      await decideRequest(currentModal.request.id, currentModal.kind === "accept" ? "approve" : "reject", form.owner, form.comment);
      const [interactions, incoming] = await Promise.all([fetchInteractions(), fetchRequests()]);
      setData(current => ({ ...current, interactions, incoming, total: interactions.length }));
      setModal(null);
      notify(currentModal.kind === "accept" ? "Заявка одобрена, взаимодействие создано." : "Заявка отклонена.");
      return;
    } else {
      throw new Error("Этот сценарий ещё не подключён к серверу.");
    }
    if (currentModal.kind !== "create") replace(updated);
    setModal(null);
    notify("Изменения сохранены на сервере.");
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
        steps={item.stepNames.length ? item.stepNames : steps}
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
            <button type="button" className="at-button" disabled title="Интеграция ещё не настроена" onClick={() => topAction("site")}>
              Получить заявку с сайта
            </button>
            <button type="button" className="at-button" disabled title="Интеграция ещё не настроена" onClick={() => topAction("lms")}>
              Синхронизировать с LMS
            </button>
          </div>
        </div>

        <WorkspaceFilters
          value={filters}
          onChange={setFilters}
          interactions={data.interactions}
          catalogs={catalogs}
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
            {visible.filter(item => !item.done && item.due).filter(item => {
              const days = Math.ceil((new Date(item.due + "T23:59:59") - new Date()) / 86400000);
              return deadlineTab === "Все" || (deadlineTab === "Просрочено" ? days < 0 : deadlineTab === "Горящие" ? days >= 0 && days <= 3 : days > 3);
            }).sort((a, b) => a.due.localeCompare(b.due)).map(item => <div key={item.id} className="aw-comment">
              <button className="aw-link" onClick={() => open("detail", { id: item.id })}>{item.name}</button>
              <p>{item.stepNames[item.stage - 1]} · до {dateLabel(item.due)}</p>
            </div>)}
            {!visible.some(item => !item.done && item.due) && <Empty title="Сроки пока не заданы">Руководитель может настроить длительность этапов Workflow.</Empty>}
          </section>
        </div>

        {manager && <WorkspaceChart
          kind="kam"
          filters={filters}
          manager={manager}
          empty={!managersList.length && !data.interactions.length}
          managers={managersList}
          interactions={data.interactions}
          notify={notify}
        />}

        {manager && <IncomingRequests requests={data.incoming.filter(request => request.status === "pending")} onAccept={(request) => open("accept", { request })} onReject={(request) => open("reject", { request })} />}

        {!manager && <section className="aw-panel">
          <h2>Мои заявки</h2>
          {!data.incoming.length && <p className="at-muted">Отправленных заявок пока нет.</p>}
          {data.incoming.map(request => <div key={request.id} className="aw-comment">
            <strong>{request.name} · {request.program}</strong>
            <p>{{ pending: "Ожидает одобрения руководителя", approved: "Одобрена", rejected: "Отклонена" }[request.status]}</p>
            {request.reason && <p>{request.reason}</p>}
          </div>)}
        </section>}
        <div className="aw-section-title aw-registry-title">
          <h2>Взаимодействия</h2>
          <button className="at-button" onClick={() => open("profiles")}>Профили КАМов</button>
          {manager && <button className="at-button" onClick={() => open("deadlines")}>Сроки этапов Workflow</button>}
          <span className="at-muted">{recordLabel(filtered ? visible.length : data.total)}</span>
          <button type="button" className="at-button" onClick={() => open("create")}>{manager ? "+ Создать партнёрство" : "+ Отправить заявку"}</button>
        </div>

        <div className="aw-interactions">
          {visible.map((item) => (
            <article className="aw-panel aw-interaction" key={item.id}>
              <div className="aw-summary">
                <button type="button" className="aw-org" onClick={() => toggle(item.id)}>
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
                      options={[...managersList, { value: "", label: "Не назначен" }]}
                      onChange={(value) => owner(item.id, value)}
                    />
                  ) : (
                    <strong>{item.ownerName || "Не назначен"}</strong>
                  )}
                  <small className="at-muted">{dateLabel(item.changed)}</small>
                </div>
                <button type="button" className="at-icon" onClick={() => toggle(item.id)}>
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

      {modal?.kind === "profiles" && <Dialog title="Профили КАМов" onClose={() => setModal(null)}>
        {!managersList.some(person => person.value !== user?.username) && <p>Нет доступных профилей коллег.</p>}
        {managersList.filter(person => person.value !== user?.username).map(person => <section className="aw-comment" key={person.value}>
          <h3>{person.label}</h3><p>КАМ</p><small className="at-muted">Логин: {person.value}</small>
        </section>)}
      </Dialog>}
      {manager && modal?.kind === "deadlines" && <Dialog title="Сроки этапов Workflow" onClose={() => setModal(null)}>
        <DeadlineSettings onSaved={() => { setModal(null); notify("Сроки этапов сохранены."); }} />
      </Dialog>}
      {modal && !["detail", "profiles", "deadlines"].includes(modal.kind) && (
        <WorkspaceModal
          key={modal.key}
          modal={modal}
          item={currentItem}
          manager={manager}
          institutions={dynamicInstitutions}
          programs={dynamicPrograms}
          softwareCatalog={catalogs.programs.filter((p) => p.software).map((p) => ({ value: p.software, vendor: p.vendor }))}
          managers={managersList}
          onClose={() => setModal(null)}
          onSubmit={submit}
        />
      )}
      <Toast notice={notice} onClose={closeNotice} />
    </div>
  );
}