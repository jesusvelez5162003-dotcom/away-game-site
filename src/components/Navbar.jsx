import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { isAuthenticated, logout } from '../auth.js'

const links = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/historia', label: 'Historia' },
  { to: '/presentacion', label: 'Presentación' },
  { to: '/galeria', label: 'Galería' },
  { to: '/registro', label: 'Novedades' }
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [authed, setAuthed] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setAuthed(isAuthenticated())
  }, [location.pathname])

  const close = () => setOpen(false)

  return (
    <header className={`navbar ${scrolled ? 'navbar--solid' : ''}`}>
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand" onClick={close}>
          <img src="/logo.png" alt="AWAY" className="navbar__logo" onError={(e) => { e.target.style.display = 'none' }} />
          <span className="navbar__title">AWAY</span>
        </Link>

        <button
          className={`navbar__burger ${open ? 'is-open' : ''}`}
          aria-label="Menú"
          onClick={() => setOpen(o => !o)}
        >
          <span></span><span></span><span></span>
        </button>

        <nav className={`navbar__menu ${open ? 'is-open' : ''}`}>
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={close}
              className={({ isActive }) => `navbar__link ${isActive ? 'is-active' : ''}`}
            >
              {l.label}
            </NavLink>
          ))}
          {authed ? (
            <>
              <NavLink to="/admin" onClick={close} className="navbar__link navbar__link--admin">Panel</NavLink>
              <button
                className="navbar__link navbar__link--btn"
                onClick={() => { logout(); setAuthed(false); close() }}
              >
                Salir
              </button>
            </>
          ) : (
            <NavLink to="/admin/login" onClick={close} className="navbar__link navbar__link--admin">Admin</NavLink>
          )}
        </nav>
      </div>
    </header>
  )
}
