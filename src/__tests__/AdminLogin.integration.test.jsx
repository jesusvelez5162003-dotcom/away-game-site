import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import '@testing-library/jest-dom'

vi.mock('../api.js', () => ({
  api: {
    login: vi.fn()
  }
}))

vi.mock('../auth.js', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    saveSession: vi.fn()
  }
})

import { api } from '../api.js'
import { saveSession } from '../auth.js'
import AdminLogin from '../pages/AdminLogin.jsx'

const renderLogin = () =>
  render(
    <MemoryRouter initialEntries={['/admin/login']}>
      <AdminLogin />
    </MemoryRouter>
  )

describe('AdminLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renderiza los campos usuario y contraseña', () => {
    renderLogin()
    expect(screen.getByLabelText(/usuario/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
  })

  it('el botón se deshabilita mientras carga', async () => {
    api.login.mockImplementation(() => new Promise(() => {}))
    renderLogin()
    fireEvent.change(screen.getByLabelText(/usuario/i), { target: { value: 'admin' } })
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'admin123' } })
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))
    await waitFor(() => {
      expect(screen.getByRole('button')).toBeDisabled()
    })
  })

  it('muestra error cuando las credenciales son incorrectas', async () => {
    api.login.mockRejectedValueOnce(new Error('Credenciales incorrectas'))
    renderLogin()
    fireEvent.change(screen.getByLabelText(/usuario/i), { target: { value: 'admin' } })
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'mala' } })
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))
    await waitFor(() => {
      expect(screen.getByText(/credenciales incorrectas/i)).toBeInTheDocument()
    })
  })

  it('llama a saveSession y redirige en login exitoso', async () => {
    api.login.mockResolvedValueOnce({ token: 'tok123', admin: { id: 1, usuario: 'admin' } })
    renderLogin()
    fireEvent.change(screen.getByLabelText(/usuario/i), { target: { value: 'admin' } })
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'admin123' } })
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))
    await waitFor(() => {
      expect(saveSession).toHaveBeenCalledWith('tok123', { id: 1, usuario: 'admin' })
    })
  })

  it('muestra error genérico si la respuesta no tiene mensaje', async () => {
    api.login.mockRejectedValueOnce(new Error())
    renderLogin()
    fireEvent.change(screen.getByLabelText(/usuario/i), { target: { value: 'x' } })
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'y' } })
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))
    await waitFor(() => {
      expect(screen.getByText(/no se pudo/i)).toBeInTheDocument()
    })
  })
})
