// Helpers de almacenamiento local. SCARE no persiste búsquedas por diseño
// (Fase 1 no tiene backend con base de datos), pero se deja este wrapper
// listo para preferencias de UI no sensibles (ej. último rango de años usado).
const PREFIX = 'scare:';

export function saveLocal(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* localStorage no disponible */
  }
}

export function readLocal(key, fallback = null) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function clearLocal(key) {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    /* noop */
  }
}
