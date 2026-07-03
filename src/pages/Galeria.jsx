import { useState } from 'react'

const images = [
  { src: '/imagen1.png', title: 'El despertar', desc: 'Donde todo comienza, entre cenizas y silencio.' },
  { src: '/imagen2.png', title: 'El bosque', desc: 'La luz se filtra apenas entre las sombras.' },
  { src: '/imagen3.png', title: 'La ciudad', desc: 'Ruinas de un mundo que ya no recuerda su nombre.' }
]

export default function Galeria() {
  const [active, setActive] = useState(null)

  return (
    <div className="page">
      <header className="page__header">
        <div className="container">
          <p className="section__eyebrow">Mundo</p>
          <h1 className="page__title">Galería</h1>
          <p className="page__lead">
            Un vistazo a los rincones de AWAY. Haz clic en una imagen para verla en grande.
          </p>
        </div>
      </header>

      <section className="section section--light">
        <div className="container">
          <div className="gallery">
            {images.map((img, i) => (
              <button
                key={i}
                className="gallery__item"
                onClick={() => setActive(img)}
              >
                <img
                  src={img.src}
                  alt={img.title}
                  onError={(e) => { e.target.style.opacity = 0.2 }}
                />
                <div className="gallery__overlay">
                  <h3>{img.title}</h3>
                  <span>Ver imagen</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {active && (
        <div className="lightbox" onClick={() => setActive(null)}>
          <button className="lightbox__close" aria-label="Cerrar">×</button>
          <figure className="lightbox__figure" onClick={(e) => e.stopPropagation()}>
            <img src={active.src} alt={active.title} onError={(e) => { e.target.style.opacity = 0.3 }} />
            <figcaption>
              <h3>{active.title}</h3>
              <p>{active.desc}</p>
            </figcaption>
          </figure>
        </div>
      )}
    </div>
  )
}
