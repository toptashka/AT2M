import { useEffect, useState } from "react";
import { apiJson } from "../../api.js";

export default function DeadlineSettings({ onSaved }) {
  const [workflow, setWorkflow] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    apiJson("/api/v1/workflow")
      .then(value => { if (active) setWorkflow(value); })
      .catch(cause => { if (active) setError(cause.message); });
    return () => { active = false; };
  }, []);
  async function submit(event) {
    event.preventDefault();
    if (busy || !workflow) return;
    setBusy(true);
    setError("");
    try {
      await apiJson("/api/v1/workflow/deadlines", {
        method: "PATCH",
        body: JSON.stringify({ version: workflow.version, stages: workflow.stages.map(stage => ({ id: stage.id, days: stage.deadlineDays === "" || stage.deadlineDays == null ? null : Number(stage.deadlineDays) })) })
      });
      window.dispatchEvent(new Event("workflow:updated"));
      onSaved();
    } catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  }
  return <form onSubmit={submit}>
    <p>Срок считается в календарных днях с момента входа на этап. Пустое поле — без дедлайна. Изменение пересчитает сроки текущих незавершённых этапов; для старых карточек без даты входа отсчёт начнётся сейчас.</p>
    {workflow?.stages.map(stage => <label key={stage.id} className="at-field">
      <span>{stage.step_number}. {stage.name} — срок, дней</span>
      <input className="at-input" type="number" min="1" max="3650" step="1" disabled={busy} value={stage.deadlineDays ?? ""}
        onChange={event => setWorkflow(current => ({ ...current, stages: current.stages.map(row => row.id === stage.id ? { ...row, deadlineDays: event.target.value } : row) }))} />
    </label>)}
    {error && <p role="alert" className="at-error">{error}</p>}
    <button className="at-button primary" disabled={busy || !workflow}>{busy ? "Сохранение…" : "Сохранить сроки"}</button>
  </form>;
}
