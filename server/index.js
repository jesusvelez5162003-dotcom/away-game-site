import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

import pool, { testConnection } from './db.js'
import { seedAdmin } from './seed.js'
import authRoutes from './routes/auth.js'
import usuariosRoutes from './routes/usuarios.js'
import adminRoutes from './routes/admin.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// CORS configurable para producción (Netlify + Render)
const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean)

app.use(cors({
  origin: allowedOrigins.length ? allowedOrigins : true,
  credentials: true
}))
app.use(express.json())

// API
app.use('/api/auth', authRoutes)
app.use('/api/usuarios', usuariosRoutes)
app.use('/api/admin', adminRoutes)

// Healthcheck
app.get('/api/health', (req, res) => res.json({ ok: true, ts: Date.now() }))

// Servir el build de Vite en producción (si existe dist/)
const distDir = path.join(__dirname, '..', 'dist')
const distExists = fs.existsSync(distDir)
if (distExists) {
  app.use(express.static(distDir))
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next()
    res.sendFile(path.join(distDir, 'index.html'))
  })
} else {
  // En desarrollo no hay build; el frontend lo sirve Vite en :5173
  app.get('/', (req, res) => {
    res.send('API de AWAY activa. El frontend se sirve con <code>npm run dev</code> en http://localhost:5173')
  })
}

async function start() {
  await testConnection()
  try {
    await seedAdmin()
  } catch (e) {
    console.warn('[server] seedAdmin falló (¿la BD no está creada todavía?):', e.message)
  }
  app.listen(PORT, () => {
    console.log(`[server] AWAY API escuchando en http://localhost:${PORT}`)
  })
}

start()
