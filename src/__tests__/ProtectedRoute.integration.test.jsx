import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import '@testing-library/jest-dom'

vi.mock('../auth.js', () => ({
  isAuthenticated: vi.fn()
}))

import { isAuthenticated } from '../auth.js'
import ProtectedRoute from '../components/ProtectedRoute.jsx'

function renderWithRoute(authenticated) {
  isAuthenticated.mockReturnValue(authenticated)
  return render(
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route path="/admin/login" element={<div>Login page</div>} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <div>Panel de admin</div>
          </ProtectedRoute>
        } />
      </Routes>
    </MemoryRouter>
  )
}

describe('ProtectedRoute', () => {
  it('muestra el contenido si el usuario está autenticado', () => {
    renderWithRoute(true)
    expect(screen.getByText(/panel de admin/i)).toBeInTheDocument()
  })

  it('redirige a /admin/login si no está autenticado', () => {
    renderWithRoute(false)
    expect(screen.getByText(/login page/i)).toBeInTheDocument()
    expect(screen.queryByText(/panel de admin/i)).not.toBeInTheDocument()
  })
})
