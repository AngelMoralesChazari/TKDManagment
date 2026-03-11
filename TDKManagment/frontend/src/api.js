// En desarrollo: backend local. En producción: usa VITE_API_URL (ej. Railway) o nada.
const BASE =
  import.meta.env.DEV
    ? 'http://localhost:3001'
    : (import.meta.env.VITE_API_URL || '')

export const API_ALUMNOS = `${BASE}/api/alumnos`
export const API_GRADOS = `${BASE}/api/grados`
