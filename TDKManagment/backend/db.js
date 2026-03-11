import pg from 'pg'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// Cargar .env desde backend/ o desde la raíz del proyecto (TDKManagment/)
dotenv.config({ path: path.join(__dirname, '.env') })
dotenv.config({ path: path.join(__dirname, '..', '.env') })

const { Pool } = pg

function stripDbUrlQuery(url) {
  try {
    const u = new URL(url)
    // Evita que parámetros como sslmode manipulen la config interna de pg
    u.search = ''
    u.hash = ''
    return u.toString()
  } catch {
    return url
  }
}

const rawDbUrl = process.env.DATABASE_URL
const connectionString = rawDbUrl ? stripDbUrlQuery(rawDbUrl) : undefined

const pool = connectionString
  ? new Pool({
      connectionString,
      // Supabase/hosted Postgres suele requerir SSL; aceptamos la cadena de certificados del proveedor
      ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false },
    })
  : new Pool({
      host: process.env.PGHOST || 'localhost',
      port: parseInt(process.env.PGPORT || '5432', 10),
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || '',
      database: process.env.PGDATABASE || 'tdk_management',
      ssl: (process.env.PGHOST || 'localhost') === 'localhost'
        ? false
        : { rejectUnauthorized: false },
    })

export async function query(text, params) {
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result
  } finally {
    client.release()
  }
}

export default pool
