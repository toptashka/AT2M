import { useCallback, useEffect, useRef, useState } from "react";
import { useAppTheme, setAppTheme } from "../../theme";
import logo from "../../assets/Logo.svg";
import ProfileModal from "../Profile/ProfileModal";
import SettingsDrawer from "../Settings/SettingsDrawer";

import "../WorkRegion/WorkspaceUI.css";
import "./Header.css";

function Icon({ name }) {
  const paths = {
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
      <path d="M9 4H5v16h4M10 12h10m-4-4 4 4-4 4" />
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
  ["Главная", "#/"],
  ["Отчёты", "#/reports"],
  ["Календарь", "#/calendar"],
  ["FAQ", "#/faq"],
  ["Администрирование", "#/admin"],
];

function getUserFromToken() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(escape(atob(base64)));
    const payload = JSON.parse(jsonPayload);

    const name = payload.name || payload.preferred_username || "Пользователь";
    
    const nameParts = name.trim().split(" ");
    const initials = nameParts.length > 1 
      ? (nameParts[0][0] + nameParts[1][0]).toUpperCase() 
      : name.slice(0, 2).toUpperCase();
      
    const email = payload.email || "";
    return { name, initials, email };
  } catch (error) {
    console.error("Ошибка расшифровки токена:", error);
    return null;
  }
}

export default function Header({
  activePage = "Главная",
  profileOpen,
  setProfileOpen,
  dark,
  setDark,
  profiles,
  onChangePassword,
  onSaveNotifications,
  initialNotifications,
  notificationStorageKey,
  onLogout,
}) {
  const { theme } = useAppTheme();
  const isDark = dark ?? theme === "dark";

  const [localOpen, setLocalOpen] = useState(false);
  const [view, setView] = useState(null);

  const open = profileOpen ?? localOpen;
  const changeOpen = setProfileOpen ?? setLocalOpen;

  const ref = useRef(null);
  const button = useRef(null);

  const tokenUser = getUserFromToken();
  const currentName = tokenUser?.name || "Пользователь";
  const currentEmail = tokenUser?.email || "";
  const currentInitials = tokenUser?.initials || "РТ";

  const closeView = useCallback(() => setView(null), []);

  useEffect(() => {
    if (!open) return;

    function outside(event) {
      if (!ref.current?.contains(event.target)) {
        changeOpen(false);
      }
    }

    function escape(event) {
      if (event.key === "Escape") {
        changeOpen(false);
        button.current?.focus();
      }
    }

    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);

    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open, changeOpen]);

  function show(next) {
    changeOpen(false);
    setView(next);
  }

  const handleLogoutClick = () => {
    changeOpen(false);
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("token");
      window.location.hash = "";
      window.location.reload();
    }
  };

  return (
    <>
      <header
        className="at-header"
        data-theme={isDark ? "dark" : "light"}
      >
        <div className="at-header-inner">
          <a
            className="at-logo"
            href="#/"
            aria-label="ИТ Школа — главная"
          >
            <img src={logo} width="33" height="33" alt="" />
            <span>ИТ Школа</span>
          </a>

          <nav className="at-nav" aria-label="Основная навигация">
            {navigation.map(([label, href]) => (
              <a
                key={href}
                href={href}
                aria-current={
                  activePage === label ? "page" : undefined
                }
              >
                {label}
              </a>
            ))}
          </nav>

          <div
            className="at-profile"
            ref={ref}
            onBlur={(event) => {
              if (
                event.relatedTarget &&
                !event.currentTarget.contains(event.relatedTarget)
              ) {
                changeOpen(false);
              }
            }}
          >
            <button
              ref={button}
              type="button"
              className="at-avatar-button"
              aria-label="Меню пользователя"
              aria-expanded={open}
              onClick={() => changeOpen(!open)}
            >
              <span className="at-avatar">{currentInitials}</span>
            </button>

            {open && (
              <div className="at-profile-menu">
                <div className="at-identity">
                  <span className="at-avatar">{currentInitials}</span>
                  <div>
                    <strong>{currentName}</strong>
                    {currentEmail && <small>{currentEmail}</small>}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => show("profile")}
                >
                  <Icon name="user" />
                  Профиль
                </button>

                <button
                  type="button"
                  onClick={() => show("settings")}
                >
                  <Icon name="settings" />
                  Настройки
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (setDark) {
                      setDark(!isDark);
                    } else {
                      setAppTheme(isDark ? "light" : "dark");
                    }
                  }}
                >
                  <Icon name={isDark ? "sun" : "moon"} />
                  {isDark ? "Светлая тема" : "Тёмная тема"}
                </button>

                <button
                  type="button"
                  className="at-logout"
                  onClick={handleLogoutClick}
                >
                  <Icon name="logout" />
                  Выйти
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {view === "profile" && (
        <ProfileModal
          profiles={profiles}
          dark={isDark}
          onClose={closeView}
          returnFocusRef={button}
        />
      )}

      {view === "settings" && (
        <SettingsDrawer
          dark={isDark}
          onClose={closeView}
          returnFocusRef={button}
          onChangePassword={onChangePassword}
          onSaveNotifications={onSaveNotifications}
          initialNotifications={initialNotifications}
          notificationStorageKey={notificationStorageKey}
        />
      )}
    </>
  );
}