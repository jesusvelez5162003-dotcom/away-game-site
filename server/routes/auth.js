import { Router } from 'express'
import pool from '../db.js'
import { signToken, comparePassword } from '../auth.js'

const router = Router()

// POST /api/auth/login  -> login de administrador
router.post('/login', async (req, res) => {
  const { usuario, password } = req.body || {}
  if (!usuario || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña son obligatorios' })
  }
  try {
    const [rows] = await pool.query(
      'SELECT id, usuario, password_hash, nombre FROM administradores WHERE usuario = ?',
      [usuario]
    )
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' })
    }
    const admin = rows[0]
    if (!comparePassword(password, admin.password_hash)) {
      return res.status(401).json({ error: 'Credenciales incorrectas' })
    }
    const token = signToken({ id: admin.id, usuario: admin.usuario })
    return res.json({
      token,
      admin: { id: admin.id, usuario: admin.usuario, nombre: admin.nombre }
    })
  } catch (err) {
    return res.status(500).json({ error: 'Error al iniciar sesión' })
  }
})

export default router
