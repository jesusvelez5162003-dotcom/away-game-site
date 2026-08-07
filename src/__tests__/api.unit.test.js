import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { api } from '../api.js'

const localStorageMock = (() => {
  let store = {}
  return {
    getItem: (k) => store[k] ?? null,
    setItem: (k, v) => { store[k] = String(v) },
    removeItem: (k) => { delete store[k] },
    clear: () => { store = {} }
  }
})()

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock })

function mockFetch(body, status = 200) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body
  })
}

beforeEach(() => {
  localStorageMock.clear()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('api.login', () => {
  it('llama a /api/auth/login con método POST', async () => {
    globalThis.fetch = mockFetch({ token: 'tok', admin: { id: 1 } })
    const data = await api.login('admin', 'admin123')
    expect(fetch).toHaveBeenCalledOnce()
    const [url, opts] = fetch.mock.calls[0]
    expect(url).toContain('/auth/login')
    expect(opts.method).toBe('POST')
    expect(JSON.parse(opts.body)).toEqual({ usuario: 'admin', password: 'admin123' })
    expect(data.token).toBe('tok')
  })

  it('lanza error cuando la respuesta no es ok', async () => {
    globalThis.fetch = mockFetch({ error: 'Credenciales incorrectas' }, 401)
    await expect(api.login('mal', 'mal')).rejects.toThrow('Credenciales incorrectas')
  })
})

describe('api.registrarUsuario', () => {
  it('POST /api/usuarios con nombre y email', async () => {
    globalThis.fetch = mockFetch({ id: 5, ok: true })
    const data = await api.registrarUsuario({ nombre: 'Ana', email: 'ana@test.com' })
    expect(fetch).toHaveBeenCalledOnce()
    const [url, opts] = fetch.mock.calls[0]
    expect(url).toContain('/usuarios')
    expect(opts.method).toBe('POST')
    expect(data.ok).toBe(true)
  })
})

describe('api.getUsuarios (autenticado)', () => {
  it('envía el token en el header Authorization', async () => {
    localStorageMock.setItem('away_token', 'mitoken')
    globalThis.fetch = mockFetch([{ id: 1, nombre: 'Juan' }])
    await api.getUsuarios()
    const [, opts] = fetch.mock.calls[0]
    expect(opts.headers.Authorization).toBe('Bearer mitoken')
  })
})

describe('api.updateUsuario', () => {
  it('PUT /api/admin/usuarios/:id', async () => {
    globalThis.fetch = mockFetch({ ok: true })
    await api.updateUsuario(3, { nombre: 'Nuevo' })
    const [url, opts] = fetch.mock.calls[0]
    expect(url).toContain('/admin/usuarios/3')
    expect(opts.method).toBe('PUT')
  })
})

describe('api.deleteUsuario', () => {
  it('DELETE /api/admin/usuarios/:id', async () => {
    globalThis.fetch = mockFetch({ ok: true })
    await api.deleteUsuario(7)
    const [url, opts] = fetch.mock.calls[0]
    expect(url).toContain('/admin/usuarios/7')
    expect(opts.method).toBe('DELETE')
  })
})

describe('api.sendMensaje', () => {
  it('POST /api/admin/mensajes', async () => {
    globalThis.fetch = mockFetch({ ok: true, id: 1 }, 201)
    await api.sendMensaje({ asunto: 'Hola', cuerpo: 'Mundo' })
    const [url, opts] = fetch.mock.calls[0]
    expect(url).toContain('/admin/mensajes')
    expect(opts.method).toBe('POST')
  })
})
