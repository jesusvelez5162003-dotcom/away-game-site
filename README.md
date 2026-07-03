# AWAY — Sitio web del videojuego

Sitio web de presentación del videojuego **AWAY**, una aventura pixel art al
estilo de LIMBO, INSIDE y Little Nightmares. Incluye páginas de historia,
presentación, galería, registro de usuarios para novedades y un panel de
administración para gestionar los suscriptores y enviar mensajes.

## Stack

- **Frontend**: Vite + React + React Router
- **Backend**: Express + MySQL (mysql2) + JWT + bcrypt
- **Base de datos**: MySQL (XAMPP local / Render en producción)
- **Estilo**: CSS custom tipo Riot Games (blanco + verde claro)

## Estructura

```
project/
├── index.html
├── vite.config.js
├── netlify.toml          # Configuración de despliegue en Netlify
├── render.yaml           # Configuración de despliegue en Render
├── public/               # Imágenes (logo.png, fondo.png, imagen1-3.png)
├── database/
│   └── schema.sql        # Script para crear la BD y tablas
├── server/               # Backend Express
│   ├── index.js
│   ├── db.js
│   ├── auth.js
│   ├── seed.js
│   └── routes/
│       ├── auth.js
│       ├── usuarios.js
│       └── admin.js
└── src/                  # Frontend React
    ├── main.jsx
    ├── App.jsx
    ├── api.js
    ├── auth.js
    ├── components/
    ├── pages/
    └── styles/global.css
```

## Páginas

| Ruta            | Descripción                                  |
|-----------------|----------------------------------------------|
| `/`             | Inicio con portada a pantalla completa       |
| `/historia`     | Historia del juego                           |
| `/presentacion` | Ficha técnica y pilares de diseño            |
| `/galeria`      | Galería de imágenes con lightbox             |
| `/registro`     | Registro público para recibir novedades     |
| `/admin/login`  | Inicio de sesión de administrador            |
| `/admin`        | Panel: gestionar usuarios y enviar mensajes  |

## Imágenes

Coloca tus imágenes en `public/` con estos nombres exactos:

- `logo.png` — logo de la esquina superior izquierda
- `fondo.png` — imagen de portada de la home
- `imagen1.png`, `imagen2.png`, `imagen3.png` — galería

## Desarrollo local

### 1. Base de datos (XAMPP)

1. Inicia XAMPP y arranca MySQL (puerto 3307 en este proyecto).
2. Abre phpMyAdmin → **Importar** → selecciona `database/schema.sql`.
3. Se crea la base `away_game` con sus tablas y el admin por defecto.

### 2. Variables de entorno

El archivo `.env` ya viene configurado para XAMPP en puerto 3307:

```
DB_HOST=localhost
DB_PORT=3307
DB_USER=root
DB_PASSWORD=
DB_NAME=away_game
PORT=3001
JWT_SECRET=away_secret_clave_2024_cambiar_en_produccion
JWT_EXPIRES=8h
ADMIN_USER=admin
ADMIN_PASS=admin123
```

### 3. Instalar y ejecutar

```bash
npm install

# Terminal 1 — backend
npm run dev:server

# Terminal 2 — frontend
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- Admin por defecto: `admin` / `admin123`

## Build

```bash
npm run build
```

Genera la carpeta `dist/` con el frontend compilado.

## Despliegue

Consulta la guía completa en [`DEPLOY.md`](./DEPLOY.md).

## Licencia

Proyecto de ejemplo para el videojuego AWAY.
