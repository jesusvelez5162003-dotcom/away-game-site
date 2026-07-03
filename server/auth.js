import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const SECRET = process.env.JWT_SECRET || 'away_secret_dev'
const EXPIRES = process.env.JWT_EXPIRES || '8h'

export function hashPassword(plain) {
  return bcrypt.hashSync(plain, 10)
}

export function comparePassword(plain, hash) {
  return bcrypt.compareSync(plain, hash)
}

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES })
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET)
}

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' })
  }
  try {
    req.admin = verifyToken(token)
    next()
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' })
  }
}
