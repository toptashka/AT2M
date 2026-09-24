import { useEffect, useRef } from "react";
import "./Header.css";

/* Site header: logo, main nav and the profile menu (notifications bell,
   avatar, dropdown with Профиль / Настройки / тема / Выйти).
   Controlled from the parent: `dark` / `setDark` also drive the app-wide
   dark theme (see WorkRegion.jsx and the .work-region.is-dark rules in
   WorkRegion.css), so this component doesn't own that state itself. */

function LogoMark() {
  return (
    <svg className="wr-logo-mark" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 2l14 8-14 8V2z" fill="var(--wr-purple)" />
      <path d="M5 10h14l-14 8V10z" fill="var(--wr-orange)" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 9a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M9.5 17a2.5 2.5 0 0 0 5 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4.5 20c1.3-4 4.2-6 7.5-6s6.2 2 7.5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 3v2.2M12 18.8V21M21 12h-2.2M5.2 12H3M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6M18.4 18.4l-1.6-1.6M7.2 7.2 5.6 5.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" fill="currentColor" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 2v2.2M12 19.8V22M22 12h-2.2M4.2 12H2M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6M18.4 18.4l-1.6-1.6M7.2 7.2 5.6 5.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M13 8l4 4-4 4M17 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const NAV_LINKS = ["Главная", "Отчёты", "Календарь", "FAQ", "Администрирование"];

function ProfileMenu({ dark, setDark }) {
  return (
    <div className="wr-profile-menu" role="menu">
      <div className="wr-profile-menu-head">
        <span className="wr-avatar">АИ</span>
        <div className="wr-profile-id">
          <p className="wr-profile-name">Алексей Иванов</p>
          <p className="wr-profile-email">alex.ivanov@mail.ru</p>
        </div>
      </div>

      <button type="button" className="wr-profile-item" role="menuitem">
        <UserIcon /> Профиль
      </button>
      <button type="button" className="wr-profile-item" role="menuitem">
        <GearIcon /> Настройки
      </button>
      <button type="button" className="wr-profile-item" role="menuitem" onClick={() => setDark((d) => !d)}>
        {dark ? <SunIcon /> : <MoonIcon />} {dark ? "Светлая тема" : "Тёмная тема"}
      </button>
      <button type="button" className="wr-profile-item wr-profile-item--danger" role="menuitem">
        <LogoutIcon /> Выйти
      </button>
    </div>
  );
}

export default function Header({ profileOpen, setProfileOpen, dark, setDark }) {
  const profileRef = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [setProfileOpen]);

  return (
    <header className="wr-header">
      <div className="wr-header-inner">
        <div className="wr-logo">
          <LogoMark />
          <span>ИТ Школа</span>
        </div>

        <nav className="wr-nav" aria-label="Основная навигация">
          {NAV_LINKS.map((link, i) => (
            <a key={link} href="#" className={i === 0 ? "is-active" : ""}>
              {link}
            </a>
          ))}
        </nav>

        <div className="wr-header-actions">
          <button type="button" className="wr-icon-btn" aria-label="Уведомления">
            <BellIcon />
          </button>

          <div className="wr-profile" ref={profileRef}>
            <button
              type="button"
              className="wr-avatar-btn"
              onClick={() => setProfileOpen((open) => !open)}
              aria-expanded={profileOpen}
              aria-haspopup="true"
            >
              <span className="wr-avatar">АИ</span>
            </button>

            {profileOpen && <ProfileMenu dark={dark} setDark={setDark} />}
          </div>
        </div>
      </div>
    </header>
  );
}