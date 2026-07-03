import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <img src="/logo.png" alt="AWAY" className="footer__logo" onError={(e) => { e.target.style.display = 'none' }} />
          <div>
            <h3 className="footer__title">AWAY</h3>
            <p className="footer__tag">Una aventura pixel art de sombras y silencio.</p>
          </div>
        </div>

        <div className="footer__cols">
          <div className="footer__col">
            <h4>Explora</h4>
            <Link to="/historia">Historia</Link>
            <Link to="/presentacion">Presentación</Link>
            <Link to="/galeria">Galería</Link>
          </div>
          <div className="footer__col">
            <h4>Comunidad</h4>
            <Link to="/registro">Suscríbete</Link>
            <Link to="/admin/login">Acceso admin</Link>
          </div>
          <div className="footer__col">
            <h4>Síguenos</h4>
            <a href="#" onClick={(e) => e.preventDefault()}>Twitter</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Discord</a>
            <a href="#" onClick={(e) => e.preventDefault()}>YouTube</a>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <span>© {new Date().getFullYear()} AWAY. Todos los derechos reservados.</span>
        <span>Hecho con cariño pixel a pixel.</span>
      </div>
    </footer>
  )
}
