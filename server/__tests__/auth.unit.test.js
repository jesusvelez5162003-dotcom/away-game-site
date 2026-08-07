import { describe, it, expect, vi, beforeEach } from 'vitest'
import jwt from 'jsonwebtoken'

// Mock env before importing the module
vi.stubEnv('JWT_SECRET', 'test_secret')
vi.stubEnv('JWT_EXPIRES', '1h')

const { hashPassword, comparePassword, signToken, verifyToken, authMiddleware } = await import('../auth.js')

describe('hashPassword / comparePassword', () => {
  it('genera un hash distinto al texto plano', () => {
    const hash = hashPassword('miPassword123')
    expect(hash).not.toBe('miPassword123')
    expect(hash.length).toBeGreaterThan(20)
  })

  it('verifica correctamente password correcto', () => {
    const hash = hashPassword('secreto')
    expect(comparePassword('secreto', hash)).toBe(true)
  })

  it('rechaza password incorrecto', () => {
    const hash = hashPassword('secreto')
    expect(comparePassword('otro', hash)).toBe(false)
  })
})

describe('signToken / verifyToken', () => {
  it('firma y verifica un payload', () => {
    const token = signToken({ id: 1, usuario: 'admin' })
    const decoded = verifyToken(token)
    expect(decoded.id).toBe(1)
    expect(decoded.usuario).toBe('admin')
  })

  it('lanza error con token inválido', () => {
    expect(() => verifyToken('token.invalido.xyz')).toThrow()
  })

  it('lanza error con token expirado', () => {
    const expired = jwt.sign({ id: 1 }, 'test_secret', { expiresIn: -1 })
    expect(() => verifyToken(expired)).toThrow()
  })
})

describe('authMiddleware', () => {
  let req, res, next

  beforeEach(() => {
    req = { headers: {} }
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis()
    }
    next = vi.fn()
  })

  it('responde 401 cuando no hay token', () => {
    authMiddleware(req, res, next)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })

  it('responde 401 con token inválido', () => {
    req.headers.authorization = 'Bearer token.malo.xyz'
    authMiddleware(req, res, next)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })

  it('llama next() y asigna req.admin con token válido', () => {
    const token = signToken({ id: 5, usuario: 'tester' })
    req.headers.authorization = `Bearer ${token}`
    authMiddleware(req, res, next)
    expect(next).toHaveBeenCalledOnce()
    expect(req.admin.id).toBe(5)
    expect(req.admin.usuario).toBe('tester')
  })
})
