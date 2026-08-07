import { describe, it, expect, vi, beforeEach } from 'vitest'
import express from 'express'
import supertest from 'supertest'

const mockQuery = vi.fn()
vi.mock('../db.js', () => ({
  default: { query: mockQuery }
}))

const usuariosRouter = (await import('../routes/usuarios.js')).default

const app = express()
app.use(express.json())
app.use('/api/usuarios', usuariosRouter)

const request = supertest(app)

describe('POST /api/usuarios', () => {
  beforeEach(() => mockQuery.mockReset())

  it('400 si falta nombre', async () => {
    const res = await request.post('/api/usuarios').send({ email: 'a@b.com' })
    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/obligatorios/i)
  })

  it('400 si falta email', async () => {
    const res = await request.post('/api/usuarios').send({ nombre: 'Juan' })
    expect(res.status).toBe(400)
  })

  it('400 si el email no es válido', async () => {
    const res = await request.post('/api/usuarios').send({ nombre: 'Juan', email: 'no-es-email' })
    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/email/i)
  })

  it('201 registra usuario correctamente', async () => {
    mockQuery.mockResolvedValueOnce([{ insertId: 42 }])
    const res = await request.post('/api/usuarios').send({ nombre: 'Ana', email: 'ana@test.com' })
    expect(res.status).toBe(201)
    expect(res.body.id).toBe(42)
    expect(res.body.ok).toBe(true)
  })

  it('normaliza el email a minúsculas', async () => {
    mockQuery.mockResolvedValueOnce([{ insertId: 1 }])
    await request.post('/api/usuarios').send({ nombre: 'Luis', email: 'LUIS@TEST.COM' })
    const callArgs = mockQuery.mock.calls[0][1]
    expect(callArgs[1]).toBe('luis@test.com')
  })

  it('409 si el email ya está suscrito', async () => {
    const err = new Error('dup')
    err.code = 'ER_DUP_ENTRY'
    mockQuery.mockRejectedValueOnce(err)
    const res = await request.post('/api/usuarios').send({ nombre: 'Dup', email: 'dup@test.com' })
    expect(res.status).toBe(409)
    expect(res.body.error).toMatch(/suscrito/i)
  })

  it('500 si la BD falla', async () => {
    mockQuery.mockRejectedValueOnce(new Error('DB error'))
    const res = await request.post('/api/usuarios').send({ nombre: 'X', email: 'x@test.com' })
    expect(res.status).toBe(500)
  })
})
