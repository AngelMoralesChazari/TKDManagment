import { query } from '../lib/db.js'

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

function formatFecha(date) {
  if (!date) return '-'
  const d = new Date(date)
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  return `${meses[d.getMonth()]} ${d.getFullYear()}`
}

export default async function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method === 'GET') {
    try {
      const result = await query(`
        SELECT
          a.id_alumno AS id,
          a.nombre_completo AS nombre,
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
      return res.status(200).json(rows)
    } catch (err) {
      console.error('GET /api/alumnos:', err.message)
      return res.status(500).json({ error: 'Error al obtener alumnos' })
    }
  }

  if (req.method === 'POST') {
    const { nombre, grado, estado, fecha_ingreso } = req.body || {}
    if (!nombre || !grado || !estado) {
      return res.status(400).json({
        error: 'Faltan datos: nombre, grado y estado son obligatorios',
      })
    }
    const fechaAdmision = fecha_ingreso || new Date().toISOString().slice(0, 10)
    try {
      const gradoRes = await query(
        'SELECT id_grado FROM grado WHERE nombre_grado = $1 LIMIT 1',
        [String(grado).trim()]
      )
      const idGrado = gradoRes.rows[0]?.id_grado ?? null

      const insertAlumno = await query(
        `INSERT INTO alumno (nombre_completo, sexo, fecha_nacimiento, fecha_admision, estatus, telefono, id_tutor, id_colegiatura)
         VALUES ($1, NULL, NULL, $2, $3, NULL, NULL, NULL)
         RETURNING id_alumno, nombre_completo, estatus, fecha_admision`,
        [String(nombre).trim(), fechaAdmision, estado]
      )
      const alumno = insertAlumno.rows[0]
      const idAlumno = alumno.id_alumno

      if (idGrado) {
        await query(
          `INSERT INTO historial_grado (id_alumno, id_grado, fecha_asignacion)
           VALUES ($1, $2, $3)`,
          [idAlumno, idGrado, fechaAdmision]
        )
      }

      return res.status(201).json({
        id: idAlumno,
        nombre: alumno.nombre_completo,
        grado: idGrado ? grado : 'Sin grado',
        estado: alumno.estatus,
        ingreso: formatFecha(alumno.fecha_admision),
      })
    } catch (err) {
      console.error('POST /api/alumnos:', err.message)
      return res.status(500).json({ error: 'Error al registrar alumno' })
    }
  }

  return res.status(405).json({ error: 'Método no permitido' })
}
