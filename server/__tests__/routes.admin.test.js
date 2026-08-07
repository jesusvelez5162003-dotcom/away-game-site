import { describe, it, expect, vi, beforeEach } from 'vitest'
import express from 'express'
import supertest from 'supertest'

const mockQuery = vi.fn()
vi.mock('../db.js', () => ({
  default: { query: mockQuery }
}))

vi.stubEnv('JWT_SECRET', 'test_secret')

const { signToken } = await import('../auth.js')
const adminRouter = (await import('../routes/admin.js')).default

const app = express()
app.use(express.json())
app.use('/api/admin', adminRouter)

const request = supertest(app)

const validToken = `Bearer ${signToken({ id: 1, usuario: 'admin' })}`

describe('GET /api/admin/usuarios', () => {
  beforeEach(() => mockQuery.mockReset())

  it('401 sin token', async () => {
    const res = await request.get('/api/admin/usuarios')
    expect(res.status).toBe(401)
  })

  it('200 retorna lista de usuarios', async () => {
    const usuarios = [
      { id: 1, nombre: 'Juan', email: 'juan@test.com', acepta_novedades: 1, creado_en: '2024-01-01' }
    ]
    mockQuery.mockResolvedValueOnce([usuarios])
    const res = await request.get('/api/admin/usuarios').set('Authorization', validToken)
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0].email).toBe('juan@test.com')
  })
})

describe('PUT /api/admin/usuarios/:id', () => {
  beforeEach(() => mockQuery.mockReset())

  it('401 sin token', async () => {
    const res = await request.put('/api/admin/usuarios/1').send({ nombre: 'Nuevo' })
    expect(res.status).toBe(401)
  })

  it('400 si no hay campos para actualizar', async () => {
    const res = await request.put('/api/admin/usuarios/1').set('Authorization', validToken).send({})
    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/nada que actualizar/i)
  })

  it('400 si el email no es válido', async () => {
    const res = await request.put('/api/admin/usuarios/1').set('Authorization', validToken).send({ email: 'invalido' })
    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/email/i)
  })

  it('404 si el usuario no existe', async () => {
    mockQuery.mockResolvedValueOnce([{ affectedRows: 0 }])
    const res = await request.put('/api/admin/usuarios/99').set('Authorization', validToken).send({ nombre: 'x' })
    expect(res.status).toBe(404)
  })

  it('200 actualiza correctamente', async () => {
    mockQuery.mockResolvedValueOnce([{ affectedRows: 1 }])
    const res = await request.put('/api/admin/usuarios/1').set('Authorization', validToken).send({ nombre: 'Nuevo nombre' })
    expect(res.status).toBe(200)
    expect(res.body.ok).toBe(true)
  })

  it('409 si el email ya está en uso', async () => {
    const err = new Error('dup')
    err.code = 'ER_DUP_ENTRY'
    mockQuery.mockRejectedValueOnce(err)
    const res = await request.put('/api/admin/usuarios/1').set('Authorization', validToken).send({ email: 'dup@test.com' })
    expect(res.status).toBe(409)
  })
})

describe('DELETE /api/admin/usuarios/:id', () => {
  beforeEach(() => mockQuery.mockReset())

  it('401 sin token', async () => {
    const res = await request.delete('/api/admin/usuarios/1')
    expect(res.status).toBe(401)
  })

  it('404 si el usuario no existe', async () => {
    mockQuery.mockResolvedValueOnce([{ affectedRows: 0 }])
    const res = await request.delete('/api/admin/usuarios/99').set('Authorization', validToken)
    expect(res.status).toBe(404)
  })

  it('200 elimina correctamente', async () => {
    mockQuery.mockResolvedValueOnce([{ affectedRows: 1 }])
    const res = await request.delete('/api/admin/usuarios/1').set('Authorization', validToken)
    expect(res.status).toBe(200)
    expect(res.body.ok).toBe(true)
  })
})

describe('POST /api/admin/mensajes', () => {
  beforeEach(() => mockQuery.mockReset())

  it('400 si faltan asunto o cuerpo', async () => {
    const res = await request.post('/api/admin/mensajes').set('Authorization', validToken).send({ asunto: 'Hola' })
    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/obligatorios/i)
  })

  it('201 envía mensaje a usuario específico', async () => {
    mockQuery
      .mockResolvedValueOnce([[{ id: 1 }]])
      .mockResolvedValueOnce([{ insertId: 10 }])
    const res = await request.post('/api/admin/mensajes').set('Authorization', validToken)
      .send({ asunto: 'Test', cuerpo: 'Hola', usuario_id: 1 })
    expect(res.status).toBe(201)
    expect(res.body.ok).toBe(true)
  })

  it('400 si no hay usuarios para broadcast', async () => {
    mockQuery.mockResolvedValueOnce([[]])
    const res = await request.post('/api/admin/mensajes').set('Authorization', validToken)
      .send({ asunto: 'Broadcast', cuerpo: 'Para todos' })
    expect(res.status).toBe(400)
  })

  it('201 broadcast a todos los usuarios', async () => {
    mockQuery
      .mockResolvedValueOnce([[{ id: 1 }, { id: 2 }]])
      .mockResolvedValueOnce([{}])
    const res = await request.post('/api/admin/mensajes').set('Authorization', validToken)
      .send({ asunto: 'Broadcast', cuerpo: 'Para todos' })
    expect(res.status).toBe(201)
    expect(res.body.enviados).toBe(2)
  })
})

describe('DELETE /api/admin/mensajes/:id', () => {
  beforeEach(() => mockQuery.mockReset())

  it('404 si el mensaje no existe', async () => {
    mockQuery.mockResolvedValueOnce([{ affectedRows: 0 }])
    const res = await request.delete('/api/admin/mensajes/99').set('Authorization', validToken)
    expect(res.status).toBe(404)
  })

  it('200 elimina correctamente', async () => {
    mockQuery.mockResolvedValueOnce([{ affectedRows: 1 }])
    const res = await request.delete('/api/admin/mensajes/1').set('Authorization', validToken)
    expect(res.status).toBe(200)
  })
})
