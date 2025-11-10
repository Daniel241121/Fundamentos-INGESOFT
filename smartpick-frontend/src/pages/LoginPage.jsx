// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/smartpick';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('testuser1@example.com');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const data = await login(email, password);

      // guardamos token por si client no lo hace
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      navigate('/search');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page auth-page">
      <div className="auth-card">
        <h1>SmartPick</h1>
        <h2>Iniciar sesión</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button className="btn full" type="submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="auth-footer-text">
          ¿No tienes cuenta?{' '}
          <button
            type="button"
            className="link-button"
            onClick={() => navigate('/register')}
          >
            Crear cuenta
          </button>
        </p>

        <button
          type="button"
          className="link-button small"
          onClick={() => navigate('/')}
        >
          ← Volver a inicio
        </button>
      </div>
    </div>
  );
}
