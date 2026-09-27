import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

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

export default function Header({
  activePage = "Главная",
  profileOpen,
  setProfileOpen,
  dark,
  setDark,
  userName = "Алексей Иванов",
  userEmail = "alex.ivanov@mail.ru",
  initials = "АИ",
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const navId = useId();
  const headerRef = useRef(null);
  const menuButtonRef = useRef(null);

  const open = profileOpen ?? localOpen;
  const changeOpen = setProfileOpen ?? setLocalOpen;

  const ref = useRef(null);
  const button = useRef(null);

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

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const reset = () => setMobileOpen(false);

    media.addEventListener("change", reset);
    window.addEventListener("hashchange", reset);

    return () => {
      media.removeEventListener("change", reset);
      window.removeEventListener("hashchange", reset);
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    function outside(event) {
      if (!headerRef.current?.contains(event.target)) {
        setMobileOpen(false);
      }
    }

    function escape(event) {
      if (event.key === "Escape") {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);

    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [mobileOpen]);

  function show(next) {
    setMobileOpen(false);
    changeOpen(false);
    setView(next);
  }

  return (
    <>
      <header
        ref={headerRef}
        className="at-header"
        data-theme={isDark ? "dark" : "light"}
        data-menu-open={mobileOpen}
        onBlur={(event) => {
          if (
            event.relatedTarget &&
            !event.currentTarget.contains(event.relatedTarget)
          ) {
            setMobileOpen(false);
          }
        }}
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

          <nav
            id={navId}
            className="at-nav"
            aria-label="Основная навигация"
          >
            {navigation.map(([label, href]) => (
              <a
                key={href}
                href={href}
                aria-current={
                  activePage === label ? "page" : undefined
                }
                onClick={() => {
                  setMobileOpen(false);
                  changeOpen(false);
                }}
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
              onClick={() => {
                setMobileOpen(false);
                changeOpen(!open);
              }}
            >
              <span className="at-avatar">{initials}</span>
            </button>

            {open && (
              <div className="at-profile-menu">
                <div className="at-identity">
                  <span className="at-avatar">{initials}</span>

                  <div>
                    <strong>{userName}</strong>
                    <small>{userEmail}</small>
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
                  disabled={!onLogout}
                  onClick={() => {
                    changeOpen(false);
                    onLogout?.();
                  }}
                >
                  <Icon name="logout" />
                  Выйти
                </button>
              </div>
            )}
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            className="at-mobile-toggle"
            aria-label={
              mobileOpen
                ? "Закрыть навигацию"
                : "Открыть навигацию"
            }
            aria-expanded={mobileOpen}
            aria-controls={navId}
            onClick={() => {
              changeOpen(false);
              setMobileOpen((previous) => !previous);
            }}
          >
            <span />
            <span />
            <span />
          </button>
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