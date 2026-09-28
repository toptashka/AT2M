import { useCallback, useEffect, useId, useRef, useState } from "react";
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
  mobileNavigation = false,
  mobileMenuIcon,
  mobileCloseIcon,
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
  const navigationId = useId();

  const navigationRef = useRef(null);
  const menuButtonRef = useRef(null);

  const profileRef = useRef(null);
  const profileButtonRef = useRef(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localOpen, setLocalOpen] = useState(false);
  const [view, setView] = useState(null);

  const { theme } = useAppTheme();
  const isDark = dark ?? theme === "dark";

  const open = profileOpen ?? localOpen;
  const changeOpen = setProfileOpen ?? setLocalOpen;

  const closeView = useCallback(() => {
    setView(null);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    function handleOutside(event) {
      const clickedNavigation =
        navigationRef.current?.contains(event.target);

      const clickedMenuButton =
        menuButtonRef.current?.contains(event.target);

      if (!clickedNavigation && !clickedMenuButton) {
        setMobileMenuOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handleOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!open) return;

    function handleOutside(event) {
      if (!profileRef.current?.contains(event.target)) {
        changeOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        changeOpen(false);
        profileButtonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handleOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, changeOpen]);

  function show(nextView) {
    changeOpen(false);
    setView(nextView);
  }

  function toggleProfile() {
    setMobileMenuOpen(false);
    changeOpen(!open);
  }

  function toggleMobileMenu() {
    changeOpen(false);
    setMobileMenuOpen((previous) => !previous);
  }

  function toggleTheme() {
    if (setDark) {
      setDark(!isDark);
      return;
    }

    setAppTheme(isDark ? "light" : "dark");
  }

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
            onClick={() => setMobileMenuOpen(false)}
          >
            <img
              src={logo}
              width="33"
              height="33"
              alt=""
            />

            <span>ИТ Школа</span>
          </a>

          <nav
            className="wr-nav at-nav"
            id={navigationId}
            ref={navigationRef}
            data-mobile-open={
              mobileNavigation && mobileMenuOpen
            }
            aria-label="Основная навигация"
          >
            {navigation.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className={
                  activePage === label
                    ? "is-active"
                    : undefined
                }
                aria-current={
                  activePage === label
                    ? "page"
                    : undefined
                }
                onClick={() => {
                  setMobileMenuOpen(false);
                }}
              >
                {label}
              </a>
            ))}
          </nav>

          <div
            className="at-profile"
            ref={profileRef}
            onBlur={(event) => {
              if (
                event.relatedTarget &&
                !event.currentTarget.contains(
                  event.relatedTarget
                )
              ) {
                changeOpen(false);
              }
            }}
          >
            <button
              ref={profileButtonRef}
              type="button"
              className="at-avatar-button"
              aria-label="Меню пользователя"
              aria-expanded={open}
              onClick={toggleProfile}
            >
              <span className="at-avatar">
                {initials}
              </span>
            </button>

            {open && (
              <div className="at-profile-menu">
                <div className="at-identity">
                  <span className="at-avatar">
                    {initials}
                  </span>

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
                  onClick={toggleTheme}
                >
                  <Icon
                    name={isDark ? "sun" : "moon"}
                  />

                  {isDark
                    ? "Светлая тема"
                    : "Тёмная тема"}
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

          {mobileNavigation && (
            <button
              type="button"
              className="wr-reports-menu-toggle"
              ref={menuButtonRef}
              aria-label={
                mobileMenuOpen
                  ? "Закрыть навигацию"
                  : "Открыть навигацию"
              }
              aria-expanded={mobileMenuOpen}
              aria-controls={navigationId}
              onClick={toggleMobileMenu}
            >
              {mobileMenuIcon && mobileCloseIcon ? (
                <span
                  aria-hidden="true"
                  style={{
                    width: 24,
                    height: 24,
                    display: "block",
                    backgroundColor: "currentColor",
                    mask: `url("${
                      mobileMenuOpen
                        ? mobileCloseIcon
                        : mobileMenuIcon
                    }") center / contain no-repeat`,
                    WebkitMask: `url("${
                      mobileMenuOpen
                        ? mobileCloseIcon
                        : mobileMenuIcon
                    }") center / contain no-repeat`,
                  }}
                />
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path
                    d={
                      mobileMenuOpen
                        ? "M6 6l12 12M18 6 6 18"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              )}
            </button>
          )}
        </div>
      </header>

      {view === "profile" && (
        <ProfileModal
          profiles={profiles}
          dark={isDark}
          onClose={closeView}
          returnFocusRef={profileButtonRef}
        />
      )}

      {view === "settings" && (
        <SettingsDrawer
          dark={isDark}
          onClose={closeView}
          returnFocusRef={profileButtonRef}
          onChangePassword={onChangePassword}
          onSaveNotifications={onSaveNotifications}
          initialNotifications={initialNotifications}
          notificationStorageKey={notificationStorageKey}
        />
      )}
    </>
  );
}