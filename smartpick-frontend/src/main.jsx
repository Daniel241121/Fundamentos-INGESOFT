// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
// main.jsx o App.jsx
import { setAuthToken } from './api/client';

const savedToken = localStorage.getItem('token');
if (savedToken) {
  setAuthToken(savedToken);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
