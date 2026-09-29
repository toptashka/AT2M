export function partnershipsToCalendarEvents(partnerships = []) {
  if (!Array.isArray(partnerships)) return [];
  const events = [];
  partnerships.forEach((item) => {
    const institution = item.institution || item.name || item.university_name || "";
    const shortInstitution = institution.split(" ")[0]?.substring(0, 10) || institution;
    const program = item.direction || item.program || item.program_name || "";
    const product = item.product || item.contract?.software || "";
    const manager = item.manager_display_name || item.manager || item.owner || item.manager_name || "";
    const city = item.city || item.region || "";
    const stageNum = typeof item.stage === "number" ? item.stage : (item.stage_id || 1);

    const dueDate = item.due || item.deadline;
    if (dueDate && /^\d{4}-\d{2}-\d{2}/.test(dueDate)) {
      events.push({
        id: `${item.id}-due`,
        interactionId: item.id,
        date: dueDate.slice(0, 10),
        type: "deadline",
        title: `Дедлайн этапа ${String(stageNum).padStart(2, "0")}`,
        institution,
        shortInstitution,
        program,
        product,
        manager,
        city,
        startTime: "18:00",
      });
    }

    const licenseDate = item.licenseEnd || item.contract?.licenseEnd;
    if (licenseDate && /^\d{4}-\d{2}-\d{2}/.test(licenseDate)) {
      events.push({
        id: `${item.id}-license`,
        interactionId: item.id,
        date: licenseDate.slice(0, 10),
        type: "license",
        title: "Передача / срок лицензии",
        institution,
        shortInstitution,
        program,
        product,
        manager,
        city,
        startTime: "14:00",
        endTime: "15:00",
      });
    }

    const startDate = item.start || item.startDate || (item.created_at ? String(item.created_at).slice(0, 10) : "");
    if (startDate && /^\d{4}-\d{2}-\d{2}/.test(startDate)) {
      const isTraining = stageNum >= 9;
      events.push({
        id: `${item.id}-start`,
        interactionId: item.id,
        date: startDate.slice(0, 10),
        type: isTraining ? "training" : "deadline",
        title: isTraining ? "Старт обучения" : `Старт этапа ${String(stageNum).padStart(2, "0")}`,
        institution,
        shortInstitution,
        program,
        product,
        manager,
        city,
        startTime: "10:00",
        endTime: "11:00",
      });
    }
  });
  return events;
}

export const calendarDemoEvents = [];