import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// El registro del service worker lo maneja automáticamente vite-plugin-pwa
// (registerType: 'autoUpdate' en vite.config.js). No se registra manualmente
// aquí para evitar una segunda ruta hardcodeada que no respeta el `base`
// de despliegue (GitHub Pages sirve el sitio bajo /SCARE/, no en la raíz).
