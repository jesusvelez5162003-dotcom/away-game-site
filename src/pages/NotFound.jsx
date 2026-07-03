import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="page page--center">
      <div className="notfound">
        <h1>404</h1>
        <p>Te has adentrado demasiado en la oscuridad.</p>
        <Link to="/" className="btn btn--primary">Volver al inicio</Link>
      </div>
    </div>
  )
}
