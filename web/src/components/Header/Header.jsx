import { useCallback, useEffect, useRef, useState } from "react";
import logo from "../../assets/Logo.svg";
import "./Header.css";
import ProfileModal from "../Profile/ProfileModal";
import SettingsDrawer from "../Settings/SettingsDrawer";

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
      <path d="M5 2l14 8-14 8V2z" fill="var(--header-purple)" />
      <path d="M5 10h14l-14 8V10z" fill="var(--header-orange)" />
    </svg>
  );
}

const navigation = [
  { label: "Главная", href: "#/" },
  { label: "Отчёты", href: "#/reports" },
  { label: "Календарь", href: "#/calendar" },
  { label: "FAQ", href: "#/faq" },
  { label: "Администрирование", href: "#/admin" },
];

function ProfileMenu({ dark, setDark, onOpenProfile, onOpenSettings, onLogout }) {
  return (
    <div className="wr-profile-menu" role="menu">
      <div className="wr-profile-menu-head">
        <span className="wr-avatar">АИ</span>
        <div className="wr-profile-id">
          <p className="wr-profile-name">Алексей Иванов</p>
          <p className="wr-profile-email">alex.ivanov@mail.ru</p>
        </div>
      </div>

      <button type="button" className="wr-profile-item" role="menuitem" onClick={onOpenProfile}>
        <Icon name="user" /> Профиль
      </button>

      <button type="button" className="wr-profile-item" role="menuitem" onClick={onOpenSettings}>
        <Icon name="settings" /> Настройки
      </button>

      <button type="button" className="wr-profile-item" role="menuitem" onClick={() => setDark((prev) => !prev)}>
        <Icon name={dark ? "sun" : "moon"} /> {dark ? "Светлая тема" : "Тёмная тема"}
      </button>

      <button type="button" className="wr-profile-item wr-profile-item--danger" role="menuitem" onClick={onLogout}>
        <Icon name="logout" /> Выйти
      </button>
    </div>
  );
}

export default function Header({
  activePage = "Главная",
  profileOpen,
  setProfileOpen,
  dark,
  setDark,
  initials = "АИ",
  profiles,
  onChangePassword,
  onSaveNotifications,
  initialNotifications,
  notificationStorageKey,
  onLogout
}) {
  const profileRef = useRef(null);
  const avatarRef = useRef(null);
  const [accountView, setAccountView] = useState(null);
  const closeAccountView = useCallback(() => setAccountView(null), []);

  function openAccountView(view) {
    setProfileOpen(false);
    setAccountView(view);
  }

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
        avatarRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handleOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [profileOpen, setProfileOpen]);

  return (
    <>
      <header className="wr-header" data-theme={dark ? "dark" : "light"} data-page={activePage}>
        <div className="wr-header-inner">
          <a className="wr-logo" href="#/" aria-label="ИТ Школа — главная">
            <img src={logo} alt="Логотип" style={{ width: '33px', height: '33px', objectFit: 'contain' }} />
            <span>ИТ Школа</span>
          </a>

          <nav className="wr-nav" aria-label="Основная навигация">
            {navigation.map(({ label, href }) => (
              <a
                key={label}
                href={href ?? undefined}
                className={activePage === label ? "is-active" : undefined}
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="wr-header-actions">
            <div className="wr-profile" ref={profileRef}>
              <button
                type="button"
                className="wr-avatar-btn"
                ref={avatarRef}
                aria-label="Меню пользователя"
                aria-expanded={profileOpen}
                onClick={() => setProfileOpen((open) => !open)}
              >
                <span className="wr-avatar">{initials}</span>
              </button>

              {profileOpen && (
                <ProfileMenu
                  dark={dark}
                  setDark={setDark}
                  onOpenProfile={() => openAccountView("profile")}
                  onOpenSettings={() => openAccountView("settings")}
                  onLogout={onLogout}
                />
              )}
            </div>
          </div>
        </div>
      </header>

      {accountView === "profile" && (
        <ProfileModal dark={dark} onClose={closeAccountView} returnFocusRef={avatarRef} profiles={profiles} />
      )}
      {accountView === "settings" && (
        <SettingsDrawer
          dark={dark}
          onClose={closeAccountView}
          returnFocusRef={avatarRef}
          onChangePassword={onChangePassword}
          onSaveNotifications={onSaveNotifications}
          initialNotifications={initialNotifications}
          notificationStorageKey={notificationStorageKey}
        />
      )}
    </>
  );
}