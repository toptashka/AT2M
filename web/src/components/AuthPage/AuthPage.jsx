import Footer from "../Footer/Footer";
import { useId, useRef, useState } from "react";

import logo from "../../assets/Logo.svg";
import illustrationLight from "../../assets/illustrationLight.svg";
import illustrationDark from "../../assets/illustrationDark.svg";
import eyeOpen from "../../assets/PasswordShow.svg";
import eyeClosed from "../../assets/PasswordHide.svg";
import sun from "../../assets/Sun.svg";
import moon from "../../assets/Moon.svg";
import { useAppTheme } from "../../theme";

import "./AuthPage.css";

function ThemeIcon({ isDark }) {
  return (
    <span
      className="auth-theme-icon"
      style={{ "--theme-icon": `url("${isDark ? sun : moon}")` }}
      aria-hidden="true"
    />
  );
}

function NoticeIcon({ warning = false }) {
  return (
    <svg
      className="auth-notice-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" fill="currentColor" />

      <path
        d={warning ? "M12 11v6" : "M12 6v7"}
        fill="none"
        stroke="var(--auth-notice-background)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <circle
        cx="12"
        cy={warning ? "7" : "17"}
        r="1"
        fill="var(--auth-notice-background)"
      />
    </svg>
  );
}

function classifyLoginError(error) {
  const status = Number(error?.status);

  if (
    error?.code === "SERVICE_UNAVAILABLE" ||
    error?.code === "NETWORK_ERROR" ||
    status === 429 ||
    status >= 500
  ) {
    return "unavailable";
  }

  if (
    error?.code === "INVALID_CREDENTIALS" ||
    status === 401
  ) {
    return "credentials";
  }

  return "unknown";
}

export default function AuthPage({ onLogin }) {
  const id = useId();

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const submitting = useRef(false);

  const { theme, toggleTheme } = useAppTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [invalidField, setInvalidField] = useState(null);

  const isDark = theme === "dark";
  const isLoading = status === "loading";
  const isUnavailable = status === "unavailable";
  const fieldsDisabled = isLoading || isUnavailable;

  const passwordIcon = passwordVisible
    ? eyeOpen
    : eyeClosed;

  const hasPasswordError = invalidField === "password";
  const hasUsernameError = invalidField === "username";
  const showUsernameLabel = username.length > 0 || hasUsernameError;
  const showPasswordLabel = password.length > 0 || hasPasswordError;

  function clearError() {
    if (status === "error") {
      setStatus("idle");
      setErrorMessage("");
      setInvalidField(null);
    }
  }

  function handleUsernameChange(event) {
    setUsername(event.target.value);
    clearError();
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
    clearError();
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (submitting.current) {
      return;
    }

    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setStatus("error");
      setInvalidField("username");
      setErrorMessage("Введите логин.");
      usernameRef.current?.focus();
      return;
    }

    if (!password) {
      setStatus("error");
      setInvalidField("password");
      setErrorMessage("Введите пароль.");
      passwordRef.current?.focus();
      return;
    }

    if (typeof onLogin !== "function") {
      setStatus("error");
      setInvalidField(null);
      setErrorMessage("Обработчик авторизации пока не подключён.");
      return;
    }

    submitting.current = true;
    setStatus("loading");
    setErrorMessage("");
    setInvalidField(null);

    try {
      await onLogin({
        username: trimmedUsername,
        password,
      });

      setStatus("idle");
    } catch (error) {
      const errorType = classifyLoginError(error);

      if (errorType === "unavailable") {
        setStatus("unavailable");
      } else {
        setStatus("error");

        if (errorType === "credentials") {
          setInvalidField("password");
          setErrorMessage("Неверный логин или пароль");
        } else {
          setErrorMessage(
            "Не удалось выполнить вход. Попробуйте ещё раз.",
          );
        }
      }
    } finally {
      submitting.current = false;
    }
  }

  const buttonLabel = isLoading
    ? "Выполняется вход…"
    : isUnavailable
      ? "Повторить"
      : "Войти";

  return (
    <>
    <main className="auth-page" data-theme={theme}>
      <button
        className="auth-theme-toggle"
        type="button"
        onClick={toggleTheme}
        aria-label="Тёмная тема"
        aria-pressed={isDark}
        title={
          isDark
            ? "Включить светлую тему"
            : "Включить тёмную тему"
        }
      >
        <ThemeIcon isDark={isDark} />
      </button>

      <section
        className="auth-intro"
        aria-labelledby={`${id}-intro`}
      >
        <div className="auth-brand">
          <span className="auth-logo" aria-hidden="true">
            <img src={logo} alt="" />
          </span>

          <span>ИТ Школа</span>
        </div>

        <div className="auth-presentation">
          <div className="auth-illustration" aria-hidden="true">
            <img className="auth-illustration-light" src={illustrationLight} alt="" />
            <img className="auth-illustration-dark" src={illustrationDark} alt="" />
          </div>

          <h1 className="auth-intro-title" id={`${id}-intro`}>
            <span className="auth-desktop-title">
              Управление взаимодействием с вузами и школами
            </span>

            <span className="auth-mobile-title">
              Взаимодействие с вузами и школами
            </span>
          </h1>

          <p className="auth-description">
            Единая система контроля образовательных программ,
            <br className="auth-description-break" /> ИТ-продуктов
            и этапов взаимодействия ИТ Школы с вузами.
          </p>
        </div>
      </section>

      <section
        className="auth-content"
        aria-labelledby={`${id}-title`}
      >
        <div className="auth-card" data-state={status}>
          <h2 className="auth-title" id={`${id}-title`}>
            Вход в систему
          </h2>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
            aria-busy={isLoading}
            noValidate
          >
            {isUnavailable && (
              <div
                className="auth-notice auth-notice-warning"
                id={`${id}-service-notice`}
                role="alert"
              >
                <NoticeIcon warning />

                <div className="auth-notice-content">
                  <p className="auth-notice-title">
                    Сервис авторизации недоступен
                  </p>

                  <p className="auth-notice-description">
                    Повторите попытку через несколько минут
                  </p>
                </div>
              </div>
            )}

            <div
              className="auth-field"
              data-invalid={hasUsernameError}
              data-floating={showUsernameLabel}
            >
              <label
                className={showUsernameLabel ? "auth-field-label" : "auth-visually-hidden"}
                htmlFor={`${id}-username`}
              >
                Логин
              </label>

              <input
                ref={usernameRef}
                className="auth-input"
                id={`${id}-username`}
                name="username"
                type="text"
                value={username}
                onChange={handleUsernameChange}
                placeholder="Логин"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                required
                disabled={fieldsDisabled}
                aria-invalid={invalidField === "username"}
                aria-describedby={
                  status === "error" ? `${id}-error` : undefined
                }
              />
            </div>

            <div
              className="auth-field"
              data-invalid={hasPasswordError}
              data-floating={showPasswordLabel}
            >
              <label
                className={
                  showPasswordLabel
                    ? "auth-field-label"
                    : "auth-visually-hidden"
                }
                htmlFor={`${id}-password`}
              >
                Пароль
              </label>

              <input
                ref={passwordRef}
                className="auth-input auth-password-input"
                id={`${id}-password`}
                name="password"
                type={passwordVisible ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                placeholder={
                  hasPasswordError ? "Введите пароль" : "Пароль"
                }
                autoComplete="current-password"
                required
                disabled={fieldsDisabled}
                aria-invalid={hasPasswordError}
                aria-describedby={
                  status === "error" ? `${id}-error` : undefined
                }
              />

              <button
                className="auth-password-toggle"
                type="button"
                disabled={fieldsDisabled}
                aria-label="Показывать пароль"
                aria-pressed={passwordVisible}
                aria-controls={`${id}-password`}
                title={
                  passwordVisible
                    ? "Скрыть пароль"
                    : "Показать пароль"
                }
                onClick={() =>
                  setPasswordVisible((visible) => !visible)
                }
              >
                <img
                  className="auth-password-icon"
                  src={passwordIcon}
                  alt=""
                  aria-hidden="true"
                />
              </button>
            </div>

            {status === "error" && (
              <div
                className="auth-notice auth-notice-error"
                id={`${id}-error`}
                role="alert"
              >
                <NoticeIcon />

                <p className="auth-notice-title">
                  {errorMessage}
                </p>
              </div>
            )}

            <button
              className="auth-submit"
              type="submit"
              disabled={isLoading}
            >
              {buttonLabel}
            </button>
          </form>

          <p
            className="auth-security-note"
            role="status"
            aria-live="polite"
          >
            {isLoading
              ? "Проверяем данные и создаём защищённую сессию"
              : "Защищённый вход через Keycloak"}
          </p>
        </div>

        <footer className="auth-footer">
          Доступ для сотрудников ИТ Школы
        </footer>
      </section>
    </main>
    <Footer />
    </>
  );
}