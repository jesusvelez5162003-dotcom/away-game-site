# Guía de despliegue — AWAY

Esta guía explica cómo poner el proyecto en producción en capa gratuita usando:

- **GitHub** — repositorio de código
- **Render** — backend (Express API) + base de datos MySQL
- **Netlify** — frontend (Vite build)
- **phpMyAdmin / MySQL** — base de datos (alternativa local)

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   GitHub     │─────▶│   Netlify    │      │    Render    │
│  (código)    │      │  (frontend)  │      │  (backend)   │
└──────────────┘      └──────────────┘      └──────┬───────┘
                                                   │
                                            ┌──────▼───────┐
                                            │  Render MySQL │
                                            │  (base datos) │
                                            └──────────────┘
```

---

## Paso 0 — Requisitos

- Cuenta de [GitHub](https://github.com) (gratis)
- Cuenta de [Render](https://render.com) (gratis, se registra con GitHub)
- Cuenta de [Netlify](https://netlify.com) (gratis, se registra con GitHub)
- Git instalado en tu equipo

---

## Paso 1 — Subir el proyecto a GitHub

### 1.1 Crear el repositorio en GitHub

1. Entra en https://github.com/new
2. Repository name: `away-game-site`
3. Description: `Sitio web del videojuego AWAY`
4. Selecciona **Public** (o Private si prefieres)
5. **NO** marques "Add a README" (ya tenemos uno)
6. **NO** añadas .gitignore (ya tenemos uno)
7. Pulsa **Create repository**

GitHub te mostrará la URL del repo, algo como:
`https://github.com/jesusvelez/away-game-site.git`

### 1.2 Subir el código desde tu equipo

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
git init
git add .
git commit -m "Proyecto AWAY: frontend + backend + base de datos"
git branch -M main
git remote add origin https://github.com/jesusvelez/away-game-site.git
git push -u origin main
```

> Si `git init` ya estaba hecho, omítelo. Si la rama ya existe, omite
> `git branch -M main`.

**Importante**: antes de hacer `git add .`, verifica que `.gitignore`
incluye `node_modules` y `.env` (ya lo hace). Así no subes dependencias
ni secretos al repo público.

---

## Paso 2 — Crear la base de datos en Render

### 2.1 Crear la base de datos

1. Entra en https://dashboard.render.com
2. Pulsa **New +** → **PostgreSQL** (Render no tiene MySQL gratis, pero
   sí PostgreSQL gratis; ver la alternativa más abajo) **O** usa un
   proveedor de MySQL gratuito (recomendado para este proyecto).

### 2.2 Alternativa recomendada: MySQL gratis

Render **no** ofrece MySQL en capa gratuita. Para MySQL gratis tienes
dos opciones buenas:

#### Opción A — Aiven (recomendada, MySQL gratis real)

1. Regístrate en https://aiven.io
2. Crea un servicio **MySQL** (plan Free Tier)
3. Aiven te dará:
   - Host
   - Puerto
   - Usuario
   - Contraseña
   - Nombre de la BD
4. Conéctate con cualquier cliente MySQL (DBeaver, MySQL Workbench o phpMyAdmin) y ejecuta el script `database/schema.sql`

#### Opción B — TiDB Cloud (MySQL compatible, gratis)

1. Regístrate en https://tidbcloud.com
2. Crea un cluster **Serverless** (gratis)
3. Obtén la cadena de conexión (formato `mysql://...`)
4. Ejecuta `database/schema.sql` en la consola SQL de TiDB

#### Opción C — Clever Cloud (MySQL gratis, 10 MB)

1. Regístrate en https://clever-cloud.com
2. Crea un add-on **MySQL** (plan Free)
3. Te dará las credenciales de conexión
4. Ejecuta `database/schema.sql`

> Cualquiera de las tres funciona. Anota la **cadena de conexión**
> (formato `mysql://usuario:password@host:puerto/basededatos`) porque
> la usaremos en Render.

### 2.3 Crear las tablas

Conéctate a tu MySQL con un cliente (DBeaver, MySQL Workbench, la consola
web de TiDB, etc.) y ejecuta el contenido de `database/schema.sql`.
Esto crea las tablas `administradores`, `usuarios` y `mensajes`, y el
admin por defecto.

---

## Paso 3 — Desplegar el backend en Render

### 3.1 Crear el Web Service

1. En Render, pulsa **New +** → **Web Service**
2. Conecta tu cuenta de GitHub y selecciona el repo `away-game-site`
3. Configura:
   - **Name**: `away-api`
   - **Runtime**: Node
   - **Region**: la más cercana a ti
   - **Branch**: main
   - **Build Command**: `npm install`
   - **Start Command**: `node server/index.js`
   - **Plan**: Free

### 3.2 Variables de entorno del backend

En la sección **Environment**, añade:

| Key             | Value                                            |
|-----------------|--------------------------------------------------|
| `DATABASE_URL`  | `mysql://usuario:password@host:puerto/away_game`  |
| `JWT_SECRET`    | (genera un secreto largo y aleatorio)            |
| `JWT_EXPIRES`   | `8h`                                             |
| `ADMIN_USER`    | `admin`                                          |
| `ADMIN_PASS`    | (tu contraseña de admin, cámbiala)               |
| `CORS_ORIGINS`  | `https://away-game-site.netlify.app`             |

> `CORS_ORIGINS` debe ser la URL final de tu frontend en Netlify.
> Al principio puedes poner un placeholder y actualizarlo después.

### 3.3 Desplegar

1. Pulsa **Create Web Service**
2. Render instalará dependencias y arrancará el servidor
3. Cuando termine, tendrás una URL como:
   `https://away-api.onrender.com`
4. Verifica que funciona: abre `https://away-api.onrender.com/api/health`
   Debe devolver `{"ok":true,"ts":...}`

> **Nota sobre el plan free de Render**: el servicio se "duerme" tras
> 15 minutos sin actividad. La primera petición tarda ~30 segundos en
> despertarlo. Es normal.

---

## Paso 4 — Desplegar el frontend en Netlify

### 4.1 Crear el sitio

1. Entra en https://app.netlify.com
2. Pulsa **Add new site** → **Import an existing project**
3. Conecta GitHub y selecciona el repo `away-game-site`
4. Configura:
   - **Base directory**: (déjalo vacío, raíz del repo)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Netlify detecta automáticamente `netlify.toml` y aplica la config

### 4.2 Variables de entorno del frontend

En **Site settings** → **Environment variables**, añade:

| Key               | Value                              |
|-------------------|------------------------------------|
| `VITE_API_URL`    | `https://away-api.onrender.com/api`|

> Usa la URL de tu backend en Render (la del paso 3.3) seguida de `/api`.
> Sin barra final.

### 4.3 Desplegar

1. Pulsa **Deploy site**
2. Netlify hará el build y te dará una URL como:
   `https://away-game-site.netlify.app`
3. **Vuelve a Render** y actualiza `CORS_ORIGINS` con esa URL exacta:
   `https://away-game-site.netlify.app`
4. Redespliega el backend en Render (botón **Manual Deploy** → **Deploy latest commit**)

### 4.4 (Opcional) Dominio personalizado

En Netlify: **Site settings** → **Domain management** → **Add custom domain**.
Si añades un dominio propio, recuerda actualizar `CORS_ORIGINS` en Render
con ese dominio también.

---

## Paso 5 — Verificar el despliegue

1. Abre tu sitio en Netlify: `https://away-game-site.netlify.app`
2. Navega por las páginas (Historia, Presentación, Galería)
3. Ve a **Novedades** y regístrate con un email de prueba
4. Ve a **Admin** (esquina superior derecha) e inicia sesión con tu admin
5. En el panel debes ver el usuario que acabas de registrar
6. Prueba editar, eliminar y enviar un mensaje

Si algo falla:
- Abre la consola del navegador (F12) para ver errores de red
- En Render, revisa los logs del servicio (pestaña **Logs**)
- Verifica que `VITE_API_URL` y `CORS_ORIGINS` coinciden exactamente

---

## Resumen de variables de entorno

### Render (backend)

| Variable         | Descripción                                  |
|------------------|----------------------------------------------|
| `DATABASE_URL`   | Cadena de conexión MySQL de Aiven/TiDB/Clever |
| `JWT_SECRET`     | Secreto para firmar tokens JWT               |
| `JWT_EXPIRES`    | Tiempo de expiración del token (ej. `8h`)    |
| `ADMIN_USER`     | Usuario admin (se crea/actualiza al arrancar) |
| `ADMIN_PASS`     | Contraseña del admin                          |
| `CORS_ORIGINS`   | URL de Netlify, separada por comas si hay varias |

### Netlify (frontend)

| Variable          | Descripción                              |
|-------------------|------------------------------------------|
| `VITE_API_URL`    | URL del backend en Render + `/api`       |

---

## Notas sobre la capa gratuita

| Servicio  | Límite gratuito                                  |
|-----------|--------------------------------------------------|
| Render    | 750 h/mes, se duerme tras 15 min inactivo         |
| Netlify   | 100 GB de ancho de banda/mes, builds limitados    |
| Aiven     | 1 MySQL gratis, 5 GB                              |
| TiDB      | 5 GB, serverless                                 |
| Clever Cloud | 10 MB MySQL (suficiente para empezar)         |

Para un sitio de presentación con pocos suscriptores, la capa gratuita
es más que suficiente.

---

## Actualizaciones

Cada vez que hagas `git push` a la rama `main`:
- Netlify reconstruirá y desplegará el frontend automáticamente
- Render hará lo mismo con el backend

No necesitas hacer nada manual después del primer despliegue.
