import { useState } from 'react'
import WorkRegion from './components/WorkRegion/WorkRegion'
import AuthCard from './components/AuthPage/AuthPage'
import './components/AuthPage/AuthPage.css'

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const handleLogin = async ({ username, password }) => {
    const params = new URLSearchParams();
    params.append('client_id', 'frontend-app');
    params.append('username', username);
    params.append('password', password);
    params.append('grant_type', 'password');

    let response;
    
    try {
      response = await fetch('/auth/realms/rtk_crm/protocol/openid-connect/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
      });
    } catch (networkError) {
      throw { code: 'NETWORK_ERROR', original: networkError };
    }

    if (!response.ok) {
      throw { status: response.status, code: response.status === 401 ? 'INVALID_CREDENTIALS' : 'UNKNOWN' };
    }

    const data = await response.json();
    
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
      setToken(data.access_token);
    }
  };

    //   if (!token) {
  //   return (
  //     <div className="app">
  //       <AuthCard onLogin={handleLogin} />
  //     </div>
  //   );
  // }

  // Выключил (убрал), чтобы посмотреть свой личный компомент :)

  return (
    <div className="app">
      <WorkRegion />
    </div>
  )
}

export default App