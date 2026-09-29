import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { setAppTheme, useAppTheme } from "../../theme";
import arrowRight from "../../assets/ArrowRight.svg";
import closeIcon from "../../assets/Close.svg";
import playIcon from "../../assets/Play.svg";
import pauseIcon from "../../assets/Pause.svg";
import "./FaqPage.css";

const mediaIcons = { play: playIcon, pause: pauseIcon };

const sections = [
  {
    id: "getting-started", title: "Начало работы", description: "Навигация, фильтры и внешний вид CRM",
    questions: [
      { id: "navigation", title: "Как устроена навигация в системе?", paragraphs: [
        "Используйте верхнее меню: «Главная», «Отчёты», «Календарь» и FAQ. Раздел «Администрирование» доступен администратору.",
        "Профиль и настройки открываются из меню аватара — текущая рабочая страница сохраняется.",
      ] },
      { id: "filters", title: "Как пользоваться фильтрами на Главной?", paragraphs: [
        "Выберите учреждение, ИТ-программу, ИТ-продукт или ответственного КАМа в верхней панели Главной. Дополнительные параметры находятся в «Ещё фильтры».",
        "Данные на странице обновляются с учётом выбранных значений.",
      ], video: { title: "Работа с фильтрами на Главной", duration: "01:18" } },
      { id: "theme", title: "Как переключить тему интерфейса?" },
    ],
  },
  {
    id: "interactions", title: "Взаимодействия", description: "Карточка партнёрства и работа в текущем окне",
    questions: [
      { id: "interaction-definition", title: "Что такое взаимодействие?" },
      { id: "interaction-open", title: "Как открыть взаимодействие?" },
      { id: "interaction-manager", title: "Где посмотреть ответственного КАМа?" },
      { id: "interaction-files", title: "Где находятся комментарии и файлы?" },
    ],
  },
  {
    id: "workflow", title: "Workflow", description: "Этапы взаимодействия и условия их завершения",
    questions: [
      { id: "workflow-definition", title: "Как устроен Workflow?" },
      { id: "workflow-select", title: "Как выбрать этап?" },
      { id: "workflow-complete", title: "Как завершить этап?", steps: [
        "Откройте взаимодействие и выберите текущий этап.",
        "Выполните все обязательные условия и приложите необходимые файлы.",
        "Нажмите «Завершить этап» и подтвердите действие.",
      ], video: { title: "Как завершить этап Workflow", duration: "01:42" } },
      { id: "workflow-blocked", title: "Что делать, если этап нельзя завершить?" },
      { id: "workflow-requirements", title: "Как работают обязательные условия этапа?" },
    ],
  },
  {
    id: "requests", title: "Входящие запросы", description: "Обработка заявок с сайта и от КАМов",
    questions: [
      { id: "request-types", title: "Чем отличаются заявки CMS и КАМ?" },
      { id: "request-accept", title: "Как принять заявку в работу?" },
      { id: "request-reject", title: "Как отклонить заявку?" },
      { id: "request-partnership", title: "Как создать партнёрство?" },
    ],
  },
  {
    id: "reports", title: "Отчёты", description: "Параметры, колонки и экспорт данных",
    questions: [
      { id: "report-create", title: "Как сформировать отчёт?" },
      { id: "report-fields", title: "Как выбрать поля отчёта?" },
      { id: "report-export", title: "Как выгрузить XLSX или PDF?" },
    ],
  },
  {
    id: "calendar", title: "Календарь", description: "События и сроки взаимодействий",
    questions: [
      { id: "calendar-view", title: "Как переключаться между месяцем, неделей и днём?" },
      { id: "calendar-events", title: "Какие события отображаются в календаре?" },
      { id: "calendar-interaction", title: "Как перейти из события к взаимодействию?" },
    ],
  },
  {
    id: "profile-settings", title: "Профиль и настройки", description: "Личные сведения, безопасность и уведомления",
    questions: [
      { id: "profile-open", title: "Где открыть профиль?" },
      { id: "profile-metrics", title: "Как посмотреть показатели КАМа?" },
      { id: "settings-password", title: "Как изменить пароль?" },
      { id: "settings-notifications", title: "Как настроить уведомления?" },
    ],
  },
  {
    id: "administration", title: "Администрирование", description: "Инструкции для администратора",
    questions: [
      { id: "admin-directory", title: "Как импортировать справочник?" },
      { id: "admin-students", title: "Как импортировать список студентов?" },
      { id: "admin-workflow", title: "Как изменить Workflow?" },
      { id: "admin-stage", title: "Как добавить этап Workflow?" },
      { id: "admin-audit", title: "Как работает журнал аудита?" },
    ],
  },
];

function VideoPlaceholder({ title, duration }) {
  return (
    <figure className="faq-video">
      <div className="faq-video-preview">
        <button type="button" className="faq-video-play" disabled aria-label="Видео пока недоступно">
          <span className="faq-icon" style={{ "--faq-icon": `url("${mediaIcons.play}")` }} aria-hidden="true" />
        </button>
        <span className="faq-video-notice">Видео скоро появится</span>
      </div>
      <figcaption><span>{title}</span><span className="faq-video-duration">{duration}</span></figcaption>
    </figure>
  );
}

function Question({ question, open, onToggle }) {
  const id = useId();
  return (
    <div className="faq-question" data-open={open}>
      <h3>
        <button className="faq-question-trigger" type="button" id={`${id}-trigger`} aria-expanded={open} aria-controls={`${id}-answer`} onClick={onToggle}>
          <span>{question.title}</span>
          <span className="faq-icon faq-question-arrow" style={{ "--faq-icon": `url("${arrowRight}")` }} aria-hidden="true" />
        </button>
      </h3>
      <div className="faq-answer" id={`${id}-answer`} aria-labelledby={`${id}-trigger`} aria-hidden={!open}
        ref={(element) => { if (element) element.inert = !open; }}>
        <div className="faq-answer-clip">
          <div className="faq-answer-content">
            {question.steps ? <ol>{question.steps.map((step) => <li key={step}>{step}</li>)}</ol>
              : (question.paragraphs ?? ["текст"]).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            {question.video && <VideoPlaceholder {...question.video} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentsSheet({ activeSection, onClose, onNavigate }) {
  const dialogRef = useRef(null);
  const timerRef = useRef(null);
  const closingRef = useRef(false);
  const [closing, setClosing] = useState(false);
  const [visible, setVisible] = useState(false);
  const titleId = useId();

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    const trigger = document.activeElement;
    const root = document.documentElement;
    const body = document.body;
    const previous = { overflow: root.style.overflow, gutter: root.style.scrollbarGutter, bodyOverflow: body.style.overflow, padding: body.style.paddingRight };
    const width = Math.max(0, window.innerWidth - root.clientWidth);
    if (width) body.style.paddingRight = `${(parseFloat(getComputedStyle(body).paddingRight) || 0) + width}px`;
    root.style.scrollbarGutter = "auto";
    root.style.overflow = "hidden";
    body.style.overflow = "hidden";
    dialog.showModal();
    let frame = window.requestAnimationFrame(() => {
      frame = window.requestAnimationFrame(() => setVisible(true));
    });
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timerRef.current);
      dialog.close();
      root.style.overflow = previous.overflow;
      root.style.scrollbarGutter = previous.gutter;
      body.style.overflow = previous.bodyOverflow;
      body.style.paddingRight = previous.padding;
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, []);

  function close(sectionId) {
    if (closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    timerRef.current = window.setTimeout(() => {
      onClose();
      if (sectionId) window.requestAnimationFrame(() => onNavigate(sectionId));
    }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 300);
  }

  return <dialog className="faq-contents-dialog" data-visible={visible && !closing} ref={dialogRef} aria-labelledby={titleId}
    onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) close(); }}>
    <div className="faq-contents-panel">
      <div className="faq-contents-handle" aria-hidden="true" />
      <div className="faq-contents-heading"><h2 id={titleId}>Содержание</h2>
        <button type="button" onClick={() => close()} aria-label="Закрыть содержание"><span className="faq-icon" style={{ "--faq-icon": `url("${closeIcon}")` }} aria-hidden="true" /></button>
      </div>
      <nav aria-label="Содержание FAQ"><ul>{sections.map(section => <li key={section.id}>
        <a href={`#/faq?section=${section.id}`} aria-current={activeSection === section.id ? "location" : undefined}
          onClick={event => { event.preventDefault(); close(section.id); }}>{section.title}</a>
      </li>)}</ul></nav>
    </div>
  </dialog>;
}

export default function FaqPage() {
  const { theme } = useAppTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const [expanded, setExpanded] = useState(() => new Set(["navigation"]));
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [contentsOpen, setContentsOpen] = useState(false);
  const sectionRefs = useRef({});
  const headerRef = useRef(null);
  const articleRef = useRef(null);

  function setDark(value) {
    const next = typeof value === "function" ? value(theme === "dark") : value;
    setAppTheme(next ? "dark" : "light");
  }

  function toggleQuestion(id) {
    setExpanded((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  const scrollToSection = useCallback((id) => {
    const section = sectionRefs.current[id];
    if (!section) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    section.querySelector("h2")?.focus({ preventScroll: true });
    section.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "start" });
  }, []);

  useEffect(() => {
    function followHash() {
      const [route, query = ""] = window.location.hash.slice(1).split("?");
      if (route === "/faq") scrollToSection(new URLSearchParams(query).get("section"));
    }
    followHash();
    window.addEventListener("hashchange", followHash);
    return () => window.removeEventListener("hashchange", followHash);
  }, [scrollToSection]);

  useEffect(() => {
    let frame = null;
    function updateActiveSection() {
      frame = null;
      const threshold = (headerRef.current?.getBoundingClientRect().bottom ?? 72) + 40;
      let current = sections[0].id;
      for (const section of sections) {
        if (sectionRefs.current[section.id]?.getBoundingClientRect().top <= threshold) current = section.id;
      }
      if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
        current = sections.at(-1).id;
      }
      setActiveSection(current);
    }
    function scheduleUpdate() {
      if (frame === null) frame = window.requestAnimationFrame(updateActiveSection);
    }
    const observer = new ResizeObserver(scheduleUpdate);
    if (articleRef.current) observer.observe(articleRef.current);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    scheduleUpdate();
    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  return (
    <div className="faq-page" data-theme={theme}>
      <div className="faq-header" ref={headerRef}>
        <Header profileOpen={profileOpen} setProfileOpen={setProfileOpen} dark={theme === "dark"} setDark={setDark} activePage="FAQ" mobileNavigation />
      </div>
      <main className="faq-main">
        <div className="faq-heading"><h1>FAQ</h1><p>Инструкции по работе с ИТ Школой РТК</p></div>
        <button type="button" className="faq-contents-trigger" aria-haspopup="dialog" aria-expanded={contentsOpen} onClick={() => setContentsOpen(true)}>
          <span>Содержание</span><span className="faq-icon" style={{ "--faq-icon": `url("${arrowRight}")` }} aria-hidden="true" />
        </button>
        <div className="faq-layout">
          <article className="faq-article" aria-label="Инструкции по работе с системой" ref={articleRef}>
            {sections.map((section) => (
              <section className="faq-section" key={section.id} id={`faq-${section.id}`} aria-labelledby={`faq-heading-${section.id}`}
                ref={(element) => { sectionRefs.current[section.id] = element; }}>
                <h2 id={`faq-heading-${section.id}`} tabIndex={-1}>{section.title}</h2>
                <p className="faq-section-description">{section.description}</p>
                {section.questions.map((question) => <Question key={question.id} question={question} open={expanded.has(question.id)} onToggle={() => toggleQuestion(question.id)} />)}
              </section>
            ))}
          </article>
          <aside className="faq-toc">
            <nav aria-label="Содержание FAQ"><h2>Содержание</h2>
              <ul>{sections.map((section) => (
                <li key={section.id}>
                  <a href={`#/faq?section=${section.id}`} aria-current={activeSection === section.id ? "location" : undefined}
                    onClick={() => { if (window.location.hash === `#/faq?section=${section.id}`) scrollToSection(section.id); }}>{section.title}</a>
                </li>
              ))}</ul>
            </nav>
          </aside>
        </div>
      </main>
      <Footer />
      {contentsOpen && <ContentsSheet activeSection={activeSection} onClose={() => setContentsOpen(false)} onNavigate={id => {
        window.history.replaceState(null, "", `#/faq?section=${id}`);
        scrollToSection(id);
      }} />}
    </div>
  );
}
