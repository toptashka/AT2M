import { useState } from 'react'
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

  if (!token) {
    return (
      <div className="app">
        <AuthCard onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="app" style={{ padding: '2rem', color: '#fff', width: '100%' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>ИТ Школа РТК — CRM</h2>
        <button 
          onClick={handleLogout}
          style={{ padding: '8px 16px', background: '#444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Выйти
        </button>
      </header>
      <main>
        <h3>Вы успешно авторизованы!</h3>
        <p>Здесь будет сетка карточек и детальная информация о вузах.</p>
        <p style={{ wordBreak: 'break-all', fontSize: '12px', color: '#888', marginTop: '20px' }}>
          Ваш токен: {token.substring(0, 50)}...
        </p>
      </main>
    </div>
  )
}

export default App