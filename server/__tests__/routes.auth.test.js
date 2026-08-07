import { describe, it, expect, vi, beforeEach } from 'vitest'
import express from 'express'
import supertest from 'supertest'

// ---- Mock del pool de MySQL ----
const mockQuery = vi.fn()
vi.mock('../db.js', () => ({
  default: { query: mockQuery }
}))

vi.stubEnv('JWT_SECRET', 'test_secret')

const { hashPassword, signToken } = await import('../auth.js')
const authRouter = (await import('../routes/auth.js')).default

const app = express()
app.use(express.json())
app.use('/api/auth', authRouter)

const request = supertest(app)

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    mockQuery.mockReset()
  })

  it('400 si faltan credenciales', async () => {
    const res = await request.post('/api/auth/login').send({})
    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/obligatorios/i)
  })

  it('400 si falta la contraseña', async () => {
    const res = await request.post('/api/auth/login').send({ usuario: 'admin' })
    expect(res.status).toBe(400)
  })

  it('401 si el usuario no existe en BD', async () => {
    mockQuery.mockResolvedValueOnce([[]])
    const res = await request.post('/api/auth/login').send({ usuario: 'noexiste', password: '1234' })
    expect(res.status).toBe(401)
    expect(res.body.error).toMatch(/credenciales/i)
  })

  it('401 si la contraseña es incorrecta', async () => {
    const hash = hashPassword('correcta')
    mockQuery.mockResolvedValueOnce([[{ id: 1, usuario: 'admin', password_hash: hash, nombre: 'Admin' }]])
    const res = await request.post('/api/auth/login').send({ usuario: 'admin', password: 'incorrecta' })
    expect(res.status).toBe(401)
  })

  it('200 y devuelve token con credenciales correctas', async () => {
    const hash = hashPassword('admin123')
    mockQuery.mockResolvedValueOnce([[{ id: 1, usuario: 'admin', password_hash: hash, nombre: 'Admin' }]])
    const res = await request.post('/api/auth/login').send({ usuario: 'admin', password: 'admin123' })
    expect(res.status).toBe(200)
    expect(res.body.token).toBeTruthy()
    expect(res.body.admin.usuario).toBe('admin')
  })

  it('500 si la BD lanza un error', async () => {
    mockQuery.mockRejectedValueOnce(new Error('DB down'))
    const res = await request.post('/api/auth/login').send({ usuario: 'admin', password: 'admin123' })
    expect(res.status).toBe(500)
  })
})
