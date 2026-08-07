import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import '@testing-library/jest-dom'

vi.mock('../api.js', () => ({
  api: {
    registrarUsuario: vi.fn()
  }
}))

import { api } from '../api.js'
import Registro from '../pages/Registro.jsx'

const renderRegistro = () =>
  render(
    <MemoryRouter>
      <Registro />
    </MemoryRouter>
  )

describe('Registro', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renderiza campos nombre, email y checkbox', () => {
    renderRegistro()
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /suscribirme/i })).toBeInTheDocument()
  })

  it('muestra mensaje de éxito al suscribirse correctamente', async () => {
    api.registrarUsuario.mockResolvedValueOnce({ id: 1, ok: true })
    renderRegistro()
    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Ana' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'ana@test.com' } })
    fireEvent.click(screen.getByRole('button', { name: /suscribirme/i }))
    await waitFor(() => {
      expect(screen.getByText(/suscrito/i)).toBeInTheDocument()
    })
  })

  it('limpia el formulario tras registro exitoso', async () => {
    api.registrarUsuario.mockResolvedValueOnce({ id: 1, ok: true })
    renderRegistro()
    const nombreInput = screen.getByLabelText(/nombre/i)
    fireEvent.change(nombreInput, { target: { value: 'Luis' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'luis@test.com' } })
    fireEvent.click(screen.getByRole('button', { name: /suscribirme/i }))
    await waitFor(() => {
      expect(nombreInput.value).toBe('')
    })
  })

  it('muestra error cuando el email ya está suscrito', async () => {
    api.registrarUsuario.mockRejectedValueOnce(new Error('Este email ya está suscrito'))
    renderRegistro()
    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Dup' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'dup@test.com' } })
    fireEvent.click(screen.getByRole('button', { name: /suscribirme/i }))
    await waitFor(() => {
      expect(screen.getByText(/este email ya está suscrito/i)).toBeInTheDocument()
    })
  })

  it('botón dice "Enviando…" mientras carga', async () => {
    api.registrarUsuario.mockImplementation(() => new Promise(() => {}))
    renderRegistro()
    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'X' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'x@test.com' } })
    fireEvent.click(screen.getByRole('button', { name: /suscribirme/i }))
    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveTextContent(/enviando/i)
    })
  })
})
