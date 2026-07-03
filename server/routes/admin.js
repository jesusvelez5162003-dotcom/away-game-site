import { Router } from 'express'
import pool from '../db.js'
import { authMiddleware } from '../auth.js'

const router = Router()

// Todas las rutas requieren token de admin
router.use(authMiddleware)

// GET /api/admin/usuarios  -> listar suscriptores
router.get('/usuarios', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, nombre, email, acepta_novedades, creado_en FROM usuarios ORDER BY creado_en DESC'
    )
    return res.json(rows)
  } catch (err) {
    return res.status(500).json({ error: 'Error al obtener usuarios' })
  }
})

// PUT /api/admin/usuarios/:id  -> modificar suscriptor
router.put('/usuarios/:id', async (req, res) => {
  const { id } = req.params
  const { nombre, email, acepta_novedades } = req.body || {}
  const fields = []
  const values = []
  if (nombre) { fields.push('nombre = ?'); values.push(nombre.trim()) }
  if (email) {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailOk.test(email)) return res.status(400).json({ error: 'Email no válido' })
    fields.push('email = ?'); values.push(email.trim().toLowerCase())
  }
  if (typeof acepta_novedades === 'boolean') {
    fields.push('acepta_novedades = ?'); values.push(acepta_novedades ? 1 : 0)
  }
  if (fields.length === 0) {
    return res.status(400).json({ error: 'Nada que actualizar' })
  }
  values.push(id)
  try {
    const [result] = await pool.query(
      `UPDATE usuarios SET ${fields.join(', ')} WHERE id = ?`,
      values
    )
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' })
    return res.json({ ok: true })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Ese email ya lo usa otro usuario' })
    }
    return res.status(500).json({ error: 'Error al actualizar usuario' })
  }
})

// DELETE /api/admin/usuarios/:id  -> eliminar suscriptor
router.delete('/usuarios/:id', async (req, res) => {
  const { id } = req.params
  try {
    const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id])
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' })
    return res.json({ ok: true })
  } catch (err) {
    return res.status(500).json({ error: 'Error al eliminar usuario' })
  }
})

// GET /api/admin/mensajes  -> listar mensajes
router.get('/mensajes', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT m.id, m.asunto, m.cuerpo, m.creado_en, m.leido,
              u.nombre AS usuario_nombre, u.email AS usuario_email,
              a.usuario AS enviado_por
       FROM mensajes m
       LEFT JOIN usuarios u ON m.usuario_id = u.id
       JOIN administradores a ON m.enviado_por = a.id
       ORDER BY m.creado_en DESC`
    )
    return res.json(rows)
  } catch (err) {
    return res.status(500).json({ error: 'Error al obtener mensajes' })
  }
})

// POST /api/admin/mensajes  -> enviar mensaje a un usuario o a todos
router.post('/mensajes', async (req, res) => {
  const { asunto, cuerpo, usuario_id } = req.body || {}
  if (!asunto || !cuerpo) {
    return res.status(400).json({ error: 'Asunto y cuerpo son obligatorios' })
  }
  try {
    if (usuario_id) {
      const [u] = await pool.query('SELECT id FROM usuarios WHERE id = ?', [usuario_id])
      if (u.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' })
      const [r] = await pool.query(
        'INSERT INTO mensajes (usuario_id, asunto, cuerpo, enviado_por) VALUES (?, ?, ?, ?)',
        [usuario_id, asunto, cuerpo, req.admin.id]
      )
      return res.status(201).json({ id: r.insertId, ok: true })
    }
    // Broadcast a todos los usuarios
    const [users] = await pool.query('SELECT id FROM usuarios')
    if (users.length === 0) return res.status(400).json({ error: 'No hay usuarios suscritos' })
    const values = users.map(u => [u.id, asunto, cuerpo, req.admin.id])
    await pool.query(
      'INSERT INTO mensajes (usuario_id, asunto, cuerpo, enviado_por) VALUES ?',
      [values]
    )
    return res.status(201).json({ enviados: users.length, ok: true })
  } catch (err) {
    return res.status(500).json({ error: 'Error al enviar mensaje' })
  }
})

// DELETE /api/admin/mensajes/:id
router.delete('/mensajes/:id', async (req, res) => {
  const { id } = req.params
  try {
    const [result] = await pool.query('DELETE FROM mensajes WHERE id = ?', [id])
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Mensaje no encontrado' })
    return res.json({ ok: true })
  } catch (err) {
    return res.status(500).json({ error: 'Error al eliminar mensaje' })
  }
})

export default router
