import { Router } from 'express'
import { query } from '../db.js'

const router = Router()

// GET /api/alumnos — listar todos (tu esquema: alumno + grado actual vía historial_grado)
router.get('/', async (req, res) => {
  try {
    const result = await query(`
      SELECT
        a.id_alumno AS id,
        TRIM(COALESCE(a.nombre,'') || ' ' || COALESCE(a.apellido_paterno,'') || ' ' || COALESCE(a.apellido_materno,'')) AS nombre,
        COALESCE(g.nombre_grado, 'Sin grado') AS grado,
        COALESCE(a.estatus, 'Activo') AS estado,
        a.fecha_admision AS ingreso
      FROM alumno a
      LEFT JOIN (
        SELECT DISTINCT ON (id_alumno) id_alumno, id_grado
        FROM historial_grado
        ORDER BY id_alumno, fecha_asignacion DESC NULLS LAST, id_historial DESC
      ) h ON a.id_alumno = h.id_alumno
      LEFT JOIN grado g ON h.id_grado = g.id_grado
      ORDER BY a.id_alumno DESC
    `)
    const rows = result.rows.map((r) => ({
      id: r.id,
      nombre: r.nombre,
      grado: r.grado,
      estado: r.estado,
      ingreso: r.ingreso ? formatFecha(r.ingreso) : '-',
    }))
    res.json(rows)
  } catch (err) {
    console.error('Error en GET /api/alumnos:', err)
    res.status(500).json({
      error: 'Error al obtener alumnos',
      detalle: err?.message || String(err),
      code: err?.code,
      name: err?.name,
    })
  }
})

// POST /api/alumnos — crear alumno (insertar en alumno y asignar grado en historial_grado)
router.post('/', async (req, res) => {
  const {
    nombre,
    apellido_paterno,
    apellido_materno,
    grado,
    estado,
    fecha_ingreso,
    fecha_nacimiento,
    curp,
    telefono,
    alergias_sn,
    alergias_cuales,
    fracturas_sn,
    fracturas_cuales,
    operaciones_sn,
    operaciones_cuales,
    terapias_sn,
    terapias_cuales,
  } = req.body

  const nom = (nombre || '').trim()
  const ap = (apellido_paterno || '').trim()
  const am = (apellido_materno || '').trim()
  const nombreCompleto = [nom, ap, am].filter(Boolean).join(' ') || null

  if (!nombreCompleto || !grado || !estado) {
    return res.status(400).json({
      error: 'Faltan datos: al menos nombre, grado y estado son obligatorios',
    })
  }
  const fechaAdmision = fecha_ingreso || new Date().toISOString().slice(0, 10)
  try {
    // 1. Obtener id_grado por nombre (ej. "Blanca", "Amarilla")
    const gradoRes = await query(
      'SELECT id_grado FROM grado WHERE nombre_grado = $1 LIMIT 1',
      [grado.trim()]
    )
    const idGrado = gradoRes.rows[0]?.id_grado ?? null

    // 2. Insertar alumno con todos los campos (nombre desglosado, curp, historial de salud)
    const insertAlumno = await query(
      `INSERT INTO alumno (
        nombre, apellido_paterno, apellido_materno,
        sexo, fecha_nacimiento, fecha_admision, estatus, telefono, curp,
        alergias_sn, alergias_cuales, fracturas_sn, fracturas_cuales,
        operaciones_sn, operaciones_cuales, terapias_sn, terapias_cuales,
        id_tutor, id_colegiatura
      ) VALUES (
        $1, $2, $3, NULL, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13, $14, $15, $16, NULL, NULL
      )
      RETURNING id_alumno, nombre, apellido_paterno, apellido_materno, estatus, fecha_admision`,
      [
        nom || null, ap || null, am || null,
        fecha_nacimiento || null, fechaAdmision, estado, telefono || null, (curp || '').trim() || null,
        Boolean(alergias_sn), alergias_cuales || null, Boolean(fracturas_sn), fracturas_cuales || null,
        Boolean(operaciones_sn), operaciones_cuales || null, Boolean(terapias_sn), terapias_cuales || null,
      ]
    )
    const alumno = insertAlumno.rows[0]
    const idAlumno = alumno.id_alumno
    const nombreMostrar = [alumno.nombre, alumno.apellido_paterno, alumno.apellido_materno].filter(Boolean).join(' ').trim() || nombreCompleto

    // 3. Si tenemos grado, registrar en historial_grado
    if (idGrado) {
      await query(
        `INSERT INTO historial_grado (id_alumno, id_grado, fecha_asignacion)
         VALUES ($1, $2, $3)`,
        [idAlumno, idGrado, fechaAdmision]
      )
    }

    res.status(201).json({
      id: idAlumno,
      nombre: nombreMostrar,
      grado: idGrado ? grado : 'Sin grado',
      estado: alumno.estatus,
      ingreso: formatFecha(alumno.fecha_admision),
    })
  } catch (err) {
    console.error('Error en POST /api/alumnos:', err)
    res.status(500).json({
      error: 'Error al registrar alumno',
      detalle: err?.message || String(err),
      code: err?.code,
      name: err?.name,
    })
  }
})

function formatFecha(date) {
  if (!date) return '-'
  const d = new Date(date)
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  return `${meses[d.getMonth()]} ${d.getFullYear()}`
}

export default router
