import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api.js'
import { saveSession } from '../auth.js'

export default function AdminLogin() {
  const [form, setForm] = useState({ usuario: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await api.login(form.usuario, form.password)
      saveSession(data.token, data.admin)
      navigate('/admin')
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page page--center">
      <div className="login-card">
        <div className="login-card__head">
          <img src="/logo.png" alt="AWAY" className="login-card__logo" onError={(e) => { e.target.style.display = 'none' }} />
          <h1>Acceso administrador</h1>
          <p>Introduce tus credenciales para gestionar los suscriptores.</p>
        </div>

        <form className="form" onSubmit={onSubmit}>
          <div className="form__field">
            <label htmlFor="usuario">Usuario</label>
            <input
              id="usuario"
              name="usuario"
              type="text"
              value={form.usuario}
              onChange={(e) => setForm(f => ({ ...f, usuario: e.target.value }))}
              autoComplete="username"
              required
            />
          </div>
          <div className="form__field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
              autoComplete="current-password"
              required
            />
          </div>

          {error && <div className="form__msg form__msg--error">{error}</div>}

          <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <p className="login-card__hint">
          Por defecto: Usuario:"admin" Contraseña:"admin123"
        </p>
      </div>
    </div>
  )
}
