import { query } from '../lib/db.js'

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

export default async function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método no permitido' })

  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: 'DATABASE_URL no configurada en Vercel', detalle: 'Revisa Environment Variables' })
  }

  try {
    const result = await query(
      'SELECT id_grado, nombre_grado, nivel FROM grado ORDER BY nivel ASC'
    )
    return res.status(200).json(result.rows || [])
  } catch (err) {
    console.error('GET /api/grados:', err.message)
    return res.status(500).json({
      error: 'Error al obtener grados',
      detalle: err.message,
    })
  }
}
