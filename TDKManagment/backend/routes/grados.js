import { Router } from 'express'
import { query } from '../db.js'

const router = Router()

// GET /api/grados — listar todos los grados ordenados por nivel (para dropdowns y listados)
router.get('/', async (req, res) => {
  try {
    const result = await query(
      'SELECT id_grado, nombre_grado, nivel FROM grado ORDER BY nivel ASC'
    )
    res.json(result.rows)
  } catch (err) {
    console.error('Error en GET /api/grados:', err.message)
    res.status(500).json({
      error: 'Error al obtener grados',
      detalle: err.message,
    })
  }
})

export default router
