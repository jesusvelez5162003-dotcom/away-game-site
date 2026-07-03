import { useState } from 'react'
import { api } from '../api.js'

export default function Registro() {
  const [form, setForm] = useState({ nombre: '', email: '', acepta_novedades: true })
  const [status, setStatus] = useState({ type: '', msg: '' })
  const [loading, setLoading] = useState(false)

  const onChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus({ type: '', msg: '' })
    setLoading(true)
    try {
      await api.registrarUsuario(form)
      setStatus({ type: 'ok', msg: '¡Listo! Te has suscrito a las novedades de AWAY.' })
      setForm({ nombre: '', email: '', acepta_novedades: true })
    } catch (err) {
      setStatus({ type: 'error', msg: err.message || 'No se pudo completar el registro.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <header className="page__header">
        <div className="container">
          <p className="section__eyebrow">Únete</p>
          <h1 className="page__title">Recibe las novedades</h1>
          <p className="page__lead">
            Sé de los primeros en saber sobre el lanzamiento, betas y noticias de AWAY.
          </p>
        </div>
      </header>

      <section className="section section--light">
        <div className="container container--narrow">
          <form className="form" onSubmit={onSubmit}>
            <div className="form__field">
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                value={form.nombre}
                onChange={onChange}
                placeholder="Tu nombre"
                required
              />
            </div>
            <div className="form__field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                placeholder="tu@correo.com"
                required
              />
            </div>
            <label className="form__check">
              <input
                type="checkbox"
                name="acepta_novedades"
                checked={form.acepta_novedades}
                onChange={onChange}
              />
              <span>Quiero recibir novedades y avisos sobre el lanzamiento.</span>
            </label>

            {status.msg && (
              <div className={`form__msg form__msg--${status.type}`}>
                {status.msg}
              </div>
            )}

            <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
              {loading ? 'Enviando…' : 'Suscribirme'}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
