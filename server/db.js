import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

// Render provee DATABASE_URL en formato mysql://user:pass@host:port/dbname
// Si existe, la usamos; si no, caemos a las variables individuales (XAMPP local).
function buildConfig() {
  if (process.env.DATABASE_URL) {
    return { uri: process.env.DATABASE_URL }
  }
  return {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'away_game'
  }
}

const cfg = buildConfig()
const pool = mysql.createPool(
  cfg.uri
    ? { uri: cfg.uri, waitForConnections: true, connectionLimit: 10, queueLimit: 0 }
    : { ...cfg, waitForConnections: true, connectionLimit: 10, queueLimit: 0 }
)

export async function testConnection() {
  try {
    const conn = await pool.getConnection()
    await conn.ping()
    conn.release()
    console.log('[db] Conexión a MySQL correcta')
  } catch (err) {
    console.error('[db] No se pudo conectar a MySQL:', err.message)
    console.error('[db] Revisa las variables DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME o DATABASE_URL')
  }
}

export default pool
