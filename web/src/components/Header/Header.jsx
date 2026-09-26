import { useEffect, useRef } from "react";
import logo from "../../assets/Logo.svg";
import "./Header.css";

function Icon({ name }) {
  const paths = {
    bell: (
      <>
        <path d="M6 9a6 6 0 0 1 12 0c0 4 1.5 6 1.5 6h-15S6 13 6 9Z" />
        <path d="M10 19h4" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M4.5 21c.8-4.4 3.4-7 7.5-7s6.7 2.6 7.5 7" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
      </>
    ),
    moon: (
      <path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z" />
    ),
    logout: (
      <>
        <path d="M9 4H5v16h4M10 12h10m-4-4 4 4-4 4" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

const navigation = [
  { label: "Главная", href: "#/" },
  { label: "Отчёты", href: "#/reports" },
  { label: "Календарь", href: null },
  { label: "FAQ", href: null },
];

export default function Header({
  activePage = "Главная",
  profileOpen,
  setProfileOpen,
  dark,
  setDark,
  userName = "Алексей Иванов",
  userEmail = "alex.ivanov@mail.ru",
  initials = "АИ",
  onProfile,
  onSettings,
  onLogout,
  onNotifications,
}) {
  const profileRef = useRef(null);
  const profileButtonRef = useRef(null);

  useEffect(() => {
    if (!profileOpen) return;

    function handleOutside(event) {
      if (!profileRef.current?.contains(event.target)) {
        setProfileOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setProfileOpen(false);
        profileButtonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handleOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [profileOpen, setProfileOpen]);

  function handleAction(callback) {
    setProfileOpen(false);
    callback?.();
  }

  return (
    <header
      className="at2m-header"
      data-theme={dark ? "dark" : "light"}
    >
      <div className="at2m-header__inner">
        <a
          className="at2m-header__logo"
          href="#/"
          aria-label="ИТ Школа — главная"
        >
          <img src={logo} alt="" width="33" height="33" />
          <span>ИТ Школа</span>
        </a>

        <nav
          className="at2m-header__nav"
          aria-label="Основная навигация"
        >
          {navigation.map(({ label, href }) => (
            <a
              key={label}
              href={href ?? undefined}
              role={href ? undefined : "link"}
              aria-disabled={href ? undefined : true}
              aria-current={activePage === label ? "page" : undefined}
              className={
                activePage === label
                  ? "at2m-header__link is-active"
                  : "at2m-header__link"
              }
            >
              <span>{label}</span>
            </a>
          ))}
        </nav>

        <div className="at2m-header__actions">
          <button
            type="button"
            className="at2m-header__notification"
            aria-label="Уведомления"
            onClick={onNotifications}
          >
            <Icon name="bell" />
          </button>

          <div
            className="at2m-header__profile"
            ref={profileRef}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setProfileOpen(false);
              }
            }}
          >
            <button
              ref={profileButtonRef}
              type="button"
              className="at2m-header__profile-button"
              aria-label="Меню пользователя"
              aria-expanded={profileOpen}
              onClick={() => setProfileOpen((open) => !open)}
            >
              <span className="at2m-header__avatar">
                {initials}
              </span>
            </button>

            {profileOpen && (
              <div
                className="at2m-header__menu"
                aria-label="Меню профиля"
              >
                <div className="at2m-header__identity">
                  <span className="at2m-header__avatar">
                    {initials}
                  </span>

                  <div>
                    <p className="at2m-header__name">
                      {userName}
                    </p>
                    <p className="at2m-header__email">
                      {userEmail}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="at2m-header__menu-item"
                  onClick={() => handleAction(onProfile)}
                >
                  <Icon name="user" />
                  Профиль
                </button>

                <button
                  type="button"
                  className="at2m-header__menu-item"
                  onClick={() => handleAction(onSettings)}
                >
                  <Icon name="settings" />
                  Настройки
                </button>

                <button
                  type="button"
                  className="at2m-header__menu-item"
                  onClick={() => setDark((previous) => !previous)}
                >
                  <Icon name={dark ? "sun" : "moon"} />
                  {dark ? "Светлая тема" : "Тёмная тема"}
                </button>

                <button
                  type="button"
                  className="at2m-header__menu-item at2m-header__menu-item--logout"
                  onClick={() => handleAction(onLogout)}
                >
                  <Icon name="logout" />
                  Выйти
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}