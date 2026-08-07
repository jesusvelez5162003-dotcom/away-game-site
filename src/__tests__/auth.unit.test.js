import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { saveSession, getToken, getAdmin, logout, isAuthenticated } from '../auth.js'

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

beforeEach(() => localStorageMock.clear())

describe('saveSession', () => {
  it('guarda token y admin en localStorage', () => {
    saveSession('tok123', { id: 1, usuario: 'admin' })
    expect(localStorage.getItem('away_token')).toBe('tok123')
    expect(JSON.parse(localStorage.getItem('away_admin'))).toEqual({ id: 1, usuario: 'admin' })
  })

  it('funciona sin pasar admin', () => {
    saveSession('tok456')
    expect(localStorage.getItem('away_token')).toBe('tok456')
  })
})

describe('getToken', () => {
  it('retorna null si no hay token', () => {
    expect(getToken()).toBeNull()
  })

  it('retorna el token guardado', () => {
    localStorage.setItem('away_token', 'mitoken')
    expect(getToken()).toBe('mitoken')
  })
})

describe('getAdmin', () => {
  it('retorna null si no hay admin guardado', () => {
    expect(getAdmin()).toBeNull()
  })

  it('retorna el objeto admin parseado', () => {
    localStorage.setItem('away_admin', JSON.stringify({ id: 1, usuario: 'admin' }))
    expect(getAdmin()).toEqual({ id: 1, usuario: 'admin' })
  })

  it('retorna null si el JSON es inválido', () => {
    localStorage.setItem('away_admin', 'json{invalido}')
    expect(getAdmin()).toBeNull()
  })
})

describe('logout', () => {
  it('elimina token y admin del localStorage', () => {
    localStorage.setItem('away_token', 'tok')
    localStorage.setItem('away_admin', '{"id":1}')
    logout()
    expect(localStorage.getItem('away_token')).toBeNull()
    expect(localStorage.getItem('away_admin')).toBeNull()
  })
})

describe('isAuthenticated', () => {
  it('retorna false sin token', () => {
    expect(isAuthenticated()).toBe(false)
  })

  it('retorna true con token', () => {
    localStorage.setItem('away_token', 'tok')
    expect(isAuthenticated()).toBe(true)
  })
})
