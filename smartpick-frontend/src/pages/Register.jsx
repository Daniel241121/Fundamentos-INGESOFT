// src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/smartpick';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      });

      setSuccess('Cuenta creada correctamente. Ahora puedes iniciar sesión.');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      console.error(err);
      setError(
        err.message ||
          'No se pudo crear la cuenta. Verifica los datos e inténtalo de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page auth-page">
      <div className="auth-card">
        <h1>SmartPick</h1>
        <h2>Crear cuenta</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field-row">
            <label>
              Nombre
              <input
                name="firstName"
                type="text"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Apellido
              <input
                name="lastName"
                type="text"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <label>
            Email
            <input
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Contraseña
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}
          {success && <p className="auth-success">{success}</p>}

          <button className="btn full" type="submit" disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Registrarme'}
          </button>
        </form>

        <p className="auth-footer-text">
          ¿Ya tienes cuenta?{' '}
          <button
            type="button"
            className="link-button"
            onClick={() => navigate('/login')}
          >
            Inicia sesión
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
