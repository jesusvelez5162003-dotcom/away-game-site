import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { getAdmin, logout } from '../auth.js'
import { useNavigate } from 'react-router-dom'

export default function AdminPanel() {
  const [tab, setTab] = useState('usuarios')
  const [usuarios, setUsuarios] = useState([])
  const [mensajes, setMensajes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const admin = getAdmin()
  const navigate = useNavigate()

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const loadUsuarios = async () => {
    setLoading(true); setError('')
    try { setUsuarios(await api.getUsuarios()) }
    catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  const loadMensajes = async () => {
    setLoading(true); setError('')
    try { setMensajes(await api.getMensajes()) }
    catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  useEffect(() => {
    if (tab === 'usuarios') loadUsuarios()
    else loadMensajes()
  }, [tab])

  const onLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="page">
      <header className="page__header page__header--admin">
        <div className="container admin-head">
          <div>
            <p className="section__eyebrow">Panel de administración</p>
            <h1 className="page__title">Hola, {admin?.usuario || 'admin'}</h1>
            <p className="page__lead">Gestiona los suscriptores y los mensajes enviados.</p>
          </div>
          <button className="btn btn--ghost" onClick={onLogout}>Cerrar sesión</button>
        </div>
      </header>

      <section className="section section--light">
        <div className="container">
          <div className="tabs">
            <button
              className={`tab ${tab === 'usuarios' ? 'is-active' : ''}`}
              onClick={() => setTab('usuarios')}
            >
              Suscriptores
            </button>
            <button
              className={`tab ${tab === 'mensajes' ? 'is-active' : ''}`}
              onClick={() => setTab('mensajes')}
            >
              Mensajes
            </button>
          </div>

          {error && <div className="form__msg form__msg--error">{error}</div>}
          {loading && <p className="muted">Cargando…</p>}

          {tab === 'usuarios' && (
            <UsuariosTable
              usuarios={usuarios}
              onRefresh={loadUsuarios}
              onToast={showToast}
            />
          )}

          {tab === 'mensajes' && (
            <MensajesSection
              usuarios={usuarios}
              mensajes={mensajes}
              onRefresh={loadMensajes}
              onToast={showToast}
            />
          )}
        </div>
      </section>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

function UsuariosTable({ usuarios, onRefresh, onToast }) {
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ nombre: '', email: '', acepta_novedades: true })

  const startEdit = (u) => {
    setEditing(u.id)
    setForm({ nombre: u.nombre, email: u.email, acepta_novedades: !!u.acepta_novedades })
  }

  const cancel = () => setEditing(null)

  const save = async (id) => {
    try {
      await api.updateUsuario(id, form)
      setEditing(null)
      onRefresh()
      onToast('Usuario actualizado')
    } catch (e) {
      alert(e.message)
    }
  }

  const remove = async (id) => {
    if (!confirm('¿Eliminar este suscriptor? Esta acción no se puede deshacer.')) return
    try {
      await api.deleteUsuario(id)
      onRefresh()
      onToast('Suscriptor eliminado')
    } catch (e) {
      alert(e.message)
    }
  }

  if (usuarios.length === 0) {
    return <p className="muted">Aún no hay suscriptores. Cuando alguien se registre en la página de Novedades, aparecerá aquí.</p>
  }

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Novedades</th>
            <th>Registro</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(u => (
            <tr key={u.id}>
              {editing === u.id ? (
                <>
                  <td>{u.id}</td>
                  <td>
                    <input value={form.nombre} onChange={(e) => setForm(f => ({ ...f, nombre: e.target.value }))} />
                  </td>
                  <td>
                    <input value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} />
                  </td>
                  <td>
                    <label className="switch">
                      <input type="checkbox" checked={form.acepta_novedades}
                        onChange={(e) => setForm(f => ({ ...f, acepta_novedades: e.target.checked }))} />
                      <span className="switch__track"></span>
                    </label>
                  </td>
                  <td>{new Date(u.creado_en).toLocaleDateString()}</td>
                  <td className="table__actions">
                    <button className="btn btn--small btn--primary" onClick={() => save(u.id)}>Guardar</button>
                    <button className="btn btn--small btn--ghost" onClick={cancel}>Cancelar</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{u.id}</td>
                  <td>{u.nombre}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.acepta_novedades ? 'badge--ok' : 'badge--off'}`}>
                      {u.acepta_novedades ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td>{new Date(u.creado_en).toLocaleString()}</td>
                  <td className="table__actions">
                    <button className="btn btn--small btn--ghost" onClick={() => startEdit(u)}>Editar</button>
                    <button className="btn btn--small btn--danger" onClick={() => remove(u.id)}>Eliminar</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function MensajesSection({ usuarios, mensajes, onRefresh, onToast }) {
  const [form, setForm] = useState({ asunto: '', cuerpo: '', usuario_id: '' })
  const [sending, setSending] = useState(false)

  const send = async (e) => {
    e.preventDefault()
    if (!form.asunto || !form.cuerpo) return
    setSending(true)
    try {
      const payload = {
        asunto: form.asunto,
        cuerpo: form.cuerpo,
        ...(form.usuario_id ? { usuario_id: Number(form.usuario_id) } : {})
      }
      const res = await api.sendMensaje(payload)
      setForm({ asunto: '', cuerpo: '', usuario_id: '' })
      onRefresh()
      onToast(res.enviados ? `Mensaje enviado a ${res.enviados} usuarios` : 'Mensaje enviado')
    } catch (e) {
      alert(e.message)
    } finally {
      setSending(false)
    }
  }

  const remove = async (id) => {
    if (!confirm('¿Eliminar este mensaje?')) return
    try {
      await api.deleteMensaje(id)
      onRefresh()
      onToast('Mensaje eliminado')
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <div className="mensajes">
      <div className="mensajes__form">
        <h3 className="block-title">Enviar mensaje</h3>
        <form className="form" onSubmit={send}>
          <div className="form__field">
            <label htmlFor="asunto">Asunto</label>
            <input
              id="asunto"
              value={form.asunto}
              onChange={(e) => setForm(f => ({ ...f, asunto: e.target.value }))}
              placeholder="Asunto del mensaje"
              required
            />
          </div>
          <div className="form__field">
            <label htmlFor="cuerpo">Cuerpo</label>
            <textarea
              id="cuerpo"
              rows="5"
              value={form.cuerpo}
              onChange={(e) => setForm(f => ({ ...f, cuerpo: e.target.value }))}
              placeholder="Escribe aquí el mensaje para el suscriptor..."
              required
            />
          </div>
          <div className="form__field">
            <label htmlFor="usuario_id">Destinatario</label>
            <select
              id="usuario_id"
              value={form.usuario_id}
              onChange={(e) => setForm(f => ({ ...f, usuario_id: e.target.value }))}
            >
              <option value="">Todos los suscriptores</option>
              {usuarios.map(u => (
                <option key={u.id} value={u.id}>{u.nombre} — {u.email}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn--primary btn--block" disabled={sending}>
            {sending ? 'Enviando…' : 'Enviar mensaje'}
          </button>
        </form>
      </div>

      <div className="mensajes__list">
        <h3 className="block-title">Historial ({mensajes.length})</h3>
        {mensajes.length === 0 ? (
          <p className="muted">Todavía no se ha enviado ningún mensaje.</p>
        ) : (
          <ul className="msg-list">
            {mensajes.map(m => (
              <li key={m.id} className="msg">
                <div className="msg__head">
                  <strong>{m.asunto}</strong>
                  <span className="msg__date">{new Date(m.creado_en).toLocaleString()}</span>
                </div>
                <p className="msg__body">{m.cuerpo}</p>
                <div className="msg__meta">
                  <span>Para: {m.usuario_nombre ? `${m.usuario_nombre} (${m.usuario_email})` : 'Todos'}</span>
                  <span>Por: {m.enviado_por}</span>
                  <button className="btn btn--small btn--danger" onClick={() => remove(m.id)}>Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
