import { Router } from 'express'
import pool from '../db.js'

const router = Router()

// POST /api/usuarios  -> registro público para novedades
router.post('/', async (req, res) => {
  const { nombre, email, acepta_novedades = 1 } = req.body || {}
  if (!nombre || !email) {
    return res.status(400).json({ error: 'Nombre y email son obligatorios' })
  }
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailOk.test(email)) {
    return res.status(400).json({ error: 'Email no válido' })
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, email, acepta_novedades) VALUES (?, ?, ?)',
      [nombre.trim(), email.trim().toLowerCase(), acepta_novedades ? 1 : 0]
    )
    return res.status(201).json({ id: result.insertId, nombre, email, ok: true })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Este email ya está suscrito' })
    }
    return res.status(500).json({ error: 'Error al registrar usuario' })
  }
})

export default router
