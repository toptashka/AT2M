import { useEffect, useState } from "react";
import { AuthContext } from "./auth.jsx";
import { apiJson } from "./api.js";
import AdminPage from "./components/AdminPage/AdminPage";
import FaqPage from "./components/FaqPage/FaqPage";
import WorkRegion from "./components/WorkRegion/WorkRegionManager";
import ReportsPage from "./components/ReportsPage/ReportsPage";
import CalendarPage from "./components/CalendarPage/CalendarPage";
import { calendarDemoEvents } from "./components/CalendarPage/calendarDemo";
import AuthCard from "./components/AuthPage/AuthPage";
import "./components/AuthPage/AuthPage.css";

function getCurrentRoute() {
  return window.location.hash.slice(1).split("?")[0] || "/";
}

function App() {
  const [route, setRoute] = useState(getCurrentRoute);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [identity, setIdentity] = useState({ token: null, user: null, error: "" });
  const user = identity.token === token ? identity.user : null;
  const authError = identity.token === token ? identity.error : "";

  useEffect(() => {
    if (!token) return;
    let active = true;
    apiJson("/api/v1/me")
      .then(value => {
        if (active) setIdentity({ token, user: value, error: "" });
      })
      .catch(error => {
        if (active) setIdentity({ token, user: null, error: error.message });
      });
    return () => { active = false; };
  }, [token]);

  useEffect(() => {
    const expire = () => {
      localStorage.removeItem("token");
      setToken(null);
      setIdentity({ token: null, user: null, error: "" });
    };
    window.addEventListener("auth:expired", expire);
    return () => window.removeEventListener("auth:expired", expire);
  }, []);

  useEffect(() => {
    function handleRouteChange() {
      setRoute(getCurrentRoute());
    }

    window.addEventListener("hashchange", handleRouteChange);

    return () => {
      window.removeEventListener("hashchange", handleRouteChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setIdentity({ token: null, user: null, error: "" });
  };

  const handleLogin = async ({ username, password }) => {
    const params = new URLSearchParams();

    params.append("client_id", "frontend-app");
    params.append("username", username);
    params.append("password", password);
    params.append("grant_type", "password");

    let response;

    try {
      response = await fetch(
        "/auth/realms/rtk_crm/protocol/openid-connect/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params,
        }
      );
    } catch (networkError) {
      throw {
        code: "NETWORK_ERROR",
        original: networkError,
      };
    }

    if (!response.ok) {
      throw {
        status: response.status,
        code: response.status === 401 ? "INVALID_CREDENTIALS" : "UNKNOWN",
      };
    }

    const data = await response.json();

    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
      setToken(data.access_token);
    }
  };

  if (!token) {
    return (
      <div className="app">
        <AuthCard onLogin={handleLogin} />
      </div>
    );
  }

  if (!user) {
    return <div className="app"><main style={{ padding: 24 }}>
      <p role={authError ? "alert" : "status"}>{authError || "Проверяем права доступа…"}</p>
      {authError && <button onClick={handleLogout}>Выйти и повторить вход</button>}
    </main></div>;
  }

  return (
    <AuthContext.Provider value={user}>
    <div className="app">
      {route === "/admin" ? (
        user.canAdmin ? <AdminPage /> : <main style={{ padding: 24 }}><h1>Доступ запрещён</h1><p>Раздел доступен администратору.</p><a href="#/">На главную</a></main>
      ) : route === "/faq" ? (
        <FaqPage />
      ) : route === "/calendar" ? (
        <CalendarPage events={calendarDemoEvents} />
      ) : route === "/reports" ? (
        <ReportsPage />
      ) : (
        <WorkRegion key={user.username} manager={user.canManage} onLogout={handleLogout} />
      )}
    </div>
    </AuthContext.Provider>
  );
}

export default App;