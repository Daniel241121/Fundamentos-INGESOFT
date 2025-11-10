// src/api/client.js
const BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

let authToken = localStorage.getItem('token') || null;

// Guardar token en memoria + localStorage
export function setAuthToken(token) {
  authToken = token;
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
}

// Borrar token (para logout)
export function clearAuthToken() {
  setAuthToken(null);
}

// Leer token (por si lo necesitas en otros lados)
export function getAuthToken() {
  if (!authToken) {
    authToken = localStorage.getItem('token');
  }
  return authToken;
}

// Función genérica para llamar al backend
async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // Si hay token, lo mandamos en Authorization
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  let data = null;
  try {
    data = await response.json();
  } catch (_) {
    // por si el backend devuelve vacío
  }

  if (!response.ok) {
    const message =
      (data && (data.error || data.message)) ||
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
}

export default { request };
