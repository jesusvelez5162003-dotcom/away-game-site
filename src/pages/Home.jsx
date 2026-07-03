import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <img src="/fondo.png" alt="AWAY" className="hero__bg" onError={(e) => { e.target.style.opacity = 0 }} />
        <div className="hero__overlay"></div>
        <div className="hero__content">
          <p className="hero__eyebrow">Una aventura pixel art</p>
          <h1 className="hero__title">AWAY</h1>
          <p className="hero__subtitle">
            Sumérgete en un mundo de sombras donde la luz es tu única esperanza.
            Un viaje silencioso entre lo conocido y lo olvidado.
          </p>
          <div className="hero__cta">
            <Link to="/presentacion" className="btn btn--primary">Descubrir más</Link>
            <Link to="/registro" className="btn btn--ghost">Recibir novedades</Link>
          </div>
        </div>
        <div className="hero__scroll">
          <span></span>
          <p>Desliza</p>
        </div>
      </section>

      <section className="section section--light">
        <div className="container">
          <p className="section__eyebrow">El viaje</p>
          <h2 className="section__title">Una historia contada sin palabras</h2>
          <p className="section__lead">
            AWAY es una experiencia de aventura pixel art inspirada en los grandes
            del género. Como en LIMBO, INSIDE o Little Nightmares, aquí no hay
            diálogos: solo tú, el entorno y los peligros que acechan en la penumbra.
          </p>
          <div className="cards">
            <article className="card">
              <div className="card__icon">◐</div>
              <h3>Atmósfera</h3>
              <p>Iluminación cuidada y sonido ambiental que cuentan lo que las palabras no pueden.</p>
            </article>
            <article className="card">
              <div className="card__icon">✦</div>
              <h3>Pixel art</h3>
              <p>Cada frame está dibujado a mano para evocar la melancolía de un mundo olvidado.</p>
            </article>
            <article className="card">
              <div className="card__icon">⌖</div>
              <h3>Plataformas</h3>
              <p>Salta, esquiva y resuelve puzles en un viaje lateral lleno de tensión constante.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container container--narrow">
          <blockquote className="quote">
            “A veces, para encontrar el camino a casa, primero hay que perderse.”
            <cite>— AWAY</cite>
          </blockquote>
        </div>
      </section>

      <section className="section section--light">
        <div className="container">
          <div className="cta-block">
            <div>
              <h2 className="section__title">No te pierdas ninguna novedad</h2>
              <p className="section__lead">Suscríbete y sé de los primeros en entrar al mundo de AWAY.</p>
            </div>
            <Link to="/registro" className="btn btn--primary">Quiero suscribirme</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
