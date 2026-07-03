export default function Presentacion() {
  return (
    <div className="page">
      <header className="page__header">
        <div className="container">
          <p className="section__eyebrow">Detrás del juego</p>
          <h1 className="page__title">Presentación</h1>
          <p className="page__lead">
            AWAY nace del amor por los juegos que dicen mucho con muy poco.
          </p>
        </div>
      </header>

      <section className="section section--light">
        <div className="container">
          <div className="feature-grid">
            <div className="feature">
              <h3>Género</h3>
              <p>Aventura de plataformas y puzles, con narrativa ambiental y sin diálogos.</p>
            </div>
            <div className="feature">
              <h3>Inspiración</h3>
              <p>LIMBO, INSIDE y Little Nightmares. Juegos donde el silencio pesa más que las palabras.</p>
            </div>
            <div className="feature">
              <h3>Arte</h3>
              <p>Pixel art dibujado a mano, con paletas limitadas y mucho contraste para crear atmósfera.</p>
            </div>
            <div className="feature">
              <h3>Sonido</h3>
              <p>Banda sonora ambiental y efectos minimalistas. El sonido es parte del puzle.</p>
            </div>
            <div className="feature">
              <h3>Duración</h3>
              <p>Una aventura compacta de unas 4 a 6 horas, sin relleno, sin grasa.</p>
            </div>
            <div className="feature">
              <h3>Plataformas</h3>
              <p>PC (Windows, macOS, Linux) y consolas modernas. Fecha de lanzamiento por anunciar.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container container--narrow">
          <h2 className="section__title">Pilares de diseño</h2>
          <ul className="pillars">
            <li><strong>Mostrar, no contar.</strong> La historia se descubre, no se lee.</li>
            <li><strong>Tensión sobre acción.</strong> El peligro se siente, no se grita.</li>
            <li><strong>El entorno es el narrador.</strong> Cada pantalla cuenta algo si sabes mirar.</li>
            <li><strong>Respeto al jugador.</strong> Sin tutoriales invasivos, sin marcadores constantes.</li>
          </ul>
        </div>
      </section>
    </div>
  )
}
