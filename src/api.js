// En desarrollo usamos el proxy de Vite (relativo a /api).
// En producción apuntamos a la URL del backend en Render.
const BASE = import.meta.env.VITE_API_URL || '/api'

async function request(path, options = {}) {
  const token = localStorage.getItem('away_token')
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  }
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${BASE}${path}`, { ...options, headers })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error || 'Error en la petición')
    err.status = res.status
    err.body = data
    throw err
  }
  return data
}

export const api = {
  // Público
  registrarUsuario: (payload) => request('/usuarios', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),

  // Auth admin
  login: (usuario, password) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ usuario, password })
  }),

  // Admin - usuarios
  getUsuarios: () => request('/admin/usuarios'),
  updateUsuario: (id, payload) => request(`/admin/usuarios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  }),
  deleteUsuario: (id) => request(`/admin/usuarios/${id}`, { method: 'DELETE' }),

  // Admin - mensajes
  getMensajes: () => request('/admin/mensajes'),
  sendMensaje: (payload) => request('/admin/mensajes', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  deleteMensaje: (id) => request(`/admin/mensajes/${id}`, { method: 'DELETE' })
}
