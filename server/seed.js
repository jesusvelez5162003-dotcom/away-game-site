import bcrypt from 'bcryptjs'
import pool from './db.js'

export async function seedAdmin() {
  const user = process.env.ADMIN_USER || 'admin'
  const pass = process.env.ADMIN_PASS || 'admin123'
  const name = 'Administrador'

  try {
    const [rows] = await pool.query('SELECT id FROM administradores WHERE usuario = ?', [user])
    const hash = bcrypt.hashSync(pass, 10)

    if (rows.length === 0) {
      await pool.query(
        'INSERT INTO administradores (usuario, password_hash, nombre) VALUES (?, ?, ?)',
        [user, hash, name]
      )
      console.log(`[seed] Admin creado -> usuario: ${user}  contraseña: ${pass}`)
    } else {
      await pool.query('UPDATE administradores SET password_hash = ? WHERE usuario = ?', [hash, user])
      console.log(`[seed] Admin actualizado -> usuario: ${user}`)
    }
  } catch (err) {
    console.error('[seed] No se pudo crear/actualizar el admin:', err.message)
  }
}
