import { useEffect, useState } from "react";
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

  return (
    <div className="app">
      {route === "/admin" ? (
        <AdminPage demo />
      ) : route === "/faq" ? (
        <FaqPage />
      ) : route === "/calendar" ? (
        <CalendarPage events={calendarDemoEvents} />
      ) : route === "/reports" ? (
        <ReportsPage />
      ) : (
        <WorkRegion />
      )}
    </div>
  );
}

export default App;