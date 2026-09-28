import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { useAppTheme, setAppTheme } from "../../theme";

import logo from "../../assets/Logo.svg";
import userIcon from "../../assets/user.svg";
import settingsIcon from "../../assets/settings.svg";
import moonIcon from "../../assets/Moon.svg";
import sunIcon from "../../assets/Sun.svg";
import logoutIcon from "../../assets/Logout.svg";

import ProfileModal from "../Profile/ProfileModal";
import SettingsDrawer from "../Settings/SettingsDrawer";

import "../WorkRegion/WorkspaceUI.css";
import "./Header.css";

const navigation = [
  ["Главная", "#/"],
  ["Отчёты", "#/reports"],
  ["Календарь", "#/calendar"],
  ["FAQ", "#/faq"],
  ["Администрирование", "#/admin"],
];

// Header монтируется заново при переходах между страницами.
// Здесь сохраняем последний активный раздел.
let previousNavigationHref = null;

function ProfileIcon({ src }) {
  return (
    <span
      className="at-profile-icon"
      style={{ "--at-profile-icon": `url("${src}")` }}
      aria-hidden="true"
    />
  );
}

function useNavigationIndicator(navRef, indicatorRef, activePage) {
  // План перехода сохраняется между повторными запусками
  // эффекта в StrictMode.
  const transitionRef = useRef(null);

  useLayoutEffect(() => {
    const nav = navRef.current;
    const indicator = indicatorRef.current;

    if (!nav || !indicator) return;

    const links = [...nav.querySelectorAll("a[data-nav-link]")];

    const activeLink = links.find(
      (link) => link.dataset.page === activePage,
    );

    if (!activeLink) {
      indicator.style.opacity = "0";
      return;
    }

    const activeHref = activeLink.getAttribute("href");

    if (transitionRef.current?.to !== activeHref) {
      transitionRef.current = {
        from: previousNavigationHref,
        to: activeHref,
      };
    }

    const previousLink = links.find(
      (link) =>
        link.getAttribute("href") === transitionRef.current.from,
    );

    previousNavigationHref = activeHref;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const mobile = window.matchMedia("(max-width: 767px)");

    let animation = null;
    let disposed = false;
    let targetPosition = null;

    const duration = 420;
    const easing = "cubic-bezier(0.22, 1, 0.36, 1)";

    function getPosition(link) {
      const navRect = nav.getBoundingClientRect();
      const linkRect = link.getBoundingClientRect();

      return (
        linkRect.left -
        navRect.left +
        nav.scrollLeft +
        (linkRect.width - indicator.offsetWidth) / 2
      );
    }

    function stopAnimation() {
      animation?.cancel();
      animation = null;
    }

    function moveIndicator(from, to) {
      stopAnimation();

      indicator.style.opacity = "1";
      indicator.style.transform = `translateX(${to}px)`;
      targetPosition = to;

      if (
        reducedMotion.matches ||
        Math.abs(from - to) < 0.5
      ) {
        return;
      }

      animation = indicator.animate(
        [
          { transform: `translateX(${from}px)` },
          { transform: `translateX(${to}px)` },
        ],
        {
          duration,
          easing,
        },
      );
    }

    function placeImmediately() {
      stopAnimation();

      if (mobile.matches) {
        indicator.style.opacity = "0";
        targetPosition = null;
        return;
      }

      const target = getPosition(activeLink);

      indicator.style.opacity = "1";
      indicator.style.transform = `translateX(${target}px)`;
      targetPosition = target;
    }

    if (mobile.matches) {
      placeImmediately();
    } else {
      const target = getPosition(activeLink);
      const start = previousLink
        ? getPosition(previousLink)
        : target;

      moveIndicator(start, target);
    }

    function updatePosition() {
      if (disposed) return;

      if (mobile.matches) {
        placeImmediately();
        return;
      }

      const target = getPosition(activeLink);

      if (
        targetPosition !== null &&
        Math.abs(target - targetPosition) < 0.5
      ) {
        return;
      }

      const isAnimating = animation?.playState === "running";

      if (isAnimating && !reducedMotion.matches) {
        const transform = window.getComputedStyle(
          indicator,
        ).transform;

        const currentPosition =
          transform === "none"
            ? target
            : new DOMMatrixReadOnly(transform).m41;

        moveIndicator(currentPosition, target);
      } else {
        placeImmediately();
      }
    }

    function handleMotionChange() {
      if (reducedMotion.matches) {
        placeImmediately();
      }
    }

    const observer = new ResizeObserver(updatePosition);

    observer.observe(nav);
    links.forEach((link) => observer.observe(link));

    window.addEventListener("resize", updatePosition);
    mobile.addEventListener("change", updatePosition);
    reducedMotion.addEventListener("change", handleMotionChange);

    document.fonts?.ready.then(() => {
      if (!disposed) {
        updatePosition();
      }
    });

    return () => {
      disposed = true;
      stopAnimation();
      observer.disconnect();

      window.removeEventListener("resize", updatePosition);
      mobile.removeEventListener("change", updatePosition);
      reducedMotion.removeEventListener(
        "change",
        handleMotionChange,
      );
    };
  }, [activePage, navRef, indicatorRef]);
}

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
  const isDark = dark ?? (theme === "dark");

  const [localOpen, setLocalOpen] = useState(false);
  const [view, setView] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navId = useId();
  const profileMenuId = useId();

  const headerRef = useRef(null);
  const navRef = useRef(null);
  const indicatorRef = useRef(null);
  const menuButtonRef = useRef(null);
  const profileRef = useRef(null);
  const profileButtonRef = useRef(null);

  const open = profileOpen ?? localOpen;
  const changeOpen = setProfileOpen ?? setLocalOpen;

  useNavigationIndicator(navRef, indicatorRef, activePage);

  const closeView = useCallback(() => {
    setView(null);
  }, []);

  useEffect(() => {
    if (!open) return;

    function handleOutside(event) {
      if (!profileRef.current?.contains(event.target)) {
        changeOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key !== "Escape") return;

      changeOpen(false);
      profileButtonRef.current?.focus();
    }

    document.addEventListener("pointerdown", handleOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, changeOpen]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");

    function resetMobileMenu() {
      setMobileOpen(false);
    }

    media.addEventListener("change", resetMobileMenu);
    window.addEventListener("hashchange", resetMobileMenu);

    return () => {
      media.removeEventListener("change", resetMobileMenu);
      window.removeEventListener("hashchange", resetMobileMenu);
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    function handleOutside(event) {
      if (!headerRef.current?.contains(event.target)) {
        setMobileOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key !== "Escape") return;

      setMobileOpen(false);
      menuButtonRef.current?.focus();
    }

    document.addEventListener("pointerdown", handleOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [mobileOpen]);

  function showView(nextView) {
    setMobileOpen(false);
    changeOpen(false);
    setView(nextView);
  }

  function toggleTheme() {
    if (setDark) {
      setDark(!isDark);
      return;
    }

    setAppTheme(isDark ? "light" : "dark");
  }

  function handleLogout() {
    if (!onLogout) return;

    changeOpen(false);
    onLogout();
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
            ref={navRef}
            id={navId}
            className="at-nav"
            aria-label="Основная навигация"
          >
            {navigation.map(([label, href]) => (
              <a
                key={href}
                href={href}
                data-nav-link=""
                data-page={label}
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

            <span
              ref={indicatorRef}
              className="at-nav-indicator"
              aria-hidden="true"
            />
          </nav>

          <div
            ref={profileRef}
            className="at-profile"
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
              ref={profileButtonRef}
              type="button"
              className="at-avatar-button"
              aria-label="Меню пользователя"
              aria-expanded={open}
              aria-controls={open ? profileMenuId : undefined}
              onClick={() => {
                setMobileOpen(false);
                changeOpen(!open);
              }}
            >
              <span className="at-avatar">{initials}</span>
            </button>

            {open && (
              <div
                id={profileMenuId}
                className="at-profile-menu"
                role="group"
                aria-label="Меню пользователя"
              >
                <div className="at-identity">
                  <span className="at-avatar" aria-hidden="true">
                    {initials}
                  </span>

                  <div className="at-identity-text">
                    <strong>{userName}</strong>
                    <small>{userEmail}</small>
                  </div>
                </div>

                <div
                  className="at-profile-divider"
                  aria-hidden="true"
                />

                <div className="at-profile-actions">
                  <button
                    type="button"
                    className="at-profile-action"
                    onClick={() => showView("profile")}
                  >
                    <ProfileIcon src={userIcon} />
                    <span>Профиль</span>
                  </button>

                  <button
                    type="button"
                    className="at-profile-action"
                    onClick={() => showView("settings")}
                  >
                    <ProfileIcon src={settingsIcon} />
                    <span>Настройки</span>
                  </button>

                  <button
                    type="button"
                    className="at-profile-action"
                    onClick={toggleTheme}
                  >
                    <ProfileIcon
                      src={isDark ? sunIcon : moonIcon}
                    />
                    <span>
                      {isDark ? "Светлая тема" : "Темная тема"}
                    </span>
                  </button>
                </div>

                <div
                  className="at-profile-divider"
                  aria-hidden="true"
                />

                <div className="at-profile-footer">
                  <button
                    type="button"
                    className="at-profile-action at-logout"
                    disabled={!onLogout}
                    onClick={handleLogout}
                  >
                    <ProfileIcon src={logoutIcon} />
                    <span>Выйти</span>
                  </button>
                </div>
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