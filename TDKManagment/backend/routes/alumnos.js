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
        COALESCE(g.nivel, 0) AS nivel,
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
      nivel: r.nivel != null ? r.nivel : 0,
      estado: r.estado,
      ingreso: r.ingreso ? formatFecha(r.ingreso) : '-',
      fecha_ingreso: r.ingreso ? formatFechaISO(r.ingreso) : null,
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

// GET /api/alumnos/:id — detalle completo de un alumno
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10)
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'ID de alumno inválido' })
  }
  try {
    const result = await query(
      `
      SELECT
        a.id_alumno,
        a.nombre,
        a.apellido_paterno,
        a.apellido_materno,
        a.sexo,
        TO_CHAR(a.fecha_nacimiento, 'YYYY-MM-DD') AS fecha_nacimiento,
        TO_CHAR(a.fecha_admision, 'YYYY-MM-DD') AS fecha_admision,
        a.estatus,
        a.telefono,
        a.curp,
        a.alergias_sn,
        a.alergias_cuales,
        a.fracturas_sn,
        a.fracturas_cuales,
        a.operaciones_sn,
        a.operaciones_cuales,
        a.terapias_sn,
        a.terapias_cuales,
        g.nombre_grado AS grado_nombre
      FROM alumno a
      LEFT JOIN (
        SELECT DISTINCT ON (id_alumno) id_alumno, id_grado
        FROM historial_grado
        ORDER BY id_alumno, fecha_asignacion DESC NULLS LAST, id_historial DESC
      ) h ON a.id_alumno = h.id_alumno
      LEFT JOIN grado g ON h.id_grado = g.id_grado
      WHERE a.id_alumno = $1
      `,
      [id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Alumno no encontrado' })
    }
    const a = result.rows[0]
    res.json({
      id: a.id_alumno,
      nombre: a.nombre || '',
      apellido_paterno: a.apellido_paterno || '',
      apellido_materno: a.apellido_materno || '',
      sexo: a.sexo || null,
      fecha_nacimiento: a.fecha_nacimiento || '',
      fecha_admision: a.fecha_admision || '',
      estado: a.estatus || 'Activo',
      telefono: a.telefono || '',
      curp: a.curp || '',
      grado: a.grado_nombre || '',
      alergias_sn: !!a.alergias_sn,
      alergias_cuales: a.alergias_cuales || '',
      fracturas_sn: !!a.fracturas_sn,
      fracturas_cuales: a.fracturas_cuales || '',
      operaciones_sn: !!a.operaciones_sn,
      operaciones_cuales: a.operaciones_cuales || '',
      terapias_sn: !!a.terapias_sn,
      terapias_cuales: a.terapias_cuales || '',
    })
  } catch (err) {
    console.error('Error en GET /api/alumnos/:id:', err)
    res.status(500).json({
      error: 'Error al obtener alumno',
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
    sexo,
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
    // Validar CURP duplicada (si viene)
    const curpTrim = (curp || '').trim()
    if (curpTrim) {
      const curpRes = await query(
        'SELECT 1 FROM alumno WHERE curp = $1 LIMIT 1',
        [curpTrim]
      )
      if (curpRes.rowCount > 0) {
        return res.status(409).json({
          error: 'CURP ya está registrada',
        })
      }
    }

    // Validar nombre + apellidos duplicado
    const dupRes = await query(
      `SELECT 1 FROM alumno
       WHERE lower(nombre) = lower($1)
         AND lower(COALESCE(apellido_paterno, '')) = lower($2)
         AND lower(COALESCE(apellido_materno, '')) = lower($3)
       LIMIT 1`,
      [nom, ap || '', am || '']
    )
    if (dupRes.rowCount > 0) {
      return res.status(409).json({
        error: 'Ya existe un alumno con ese nombre y apellidos',
      })
    }

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
        $1, $2, $3,
        $4, $5, $6, $7, $8, $9,
        $10, $11, $12, $13,
        $14, $15, $16, $17,
        NULL, NULL
      )
      RETURNING id_alumno, nombre, apellido_paterno, apellido_materno, estatus, fecha_admision`,
      [
        nom || null, ap || null, am || null,
        (sexo || null),
        fecha_nacimiento || null,
        fechaAdmision,
        estado,
        telefono || null,
        curpTrim || null,
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

// PUT /api/alumnos/:id — actualizar datos de un alumno
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10)
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'ID de alumno inválido' })
  }

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
    sexo,
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
    const curpTrim = (curp || '').trim()
    if (curpTrim) {
      const curpRes = await query(
        'SELECT 1 FROM alumno WHERE curp = $1 AND id_alumno <> $2 LIMIT 1',
        [curpTrim, id]
      )
      if (curpRes.rowCount > 0) {
        return res.status(409).json({ error: 'CURP ya está registrada en otro alumno' })
      }
    }

    const dupRes = await query(
      `SELECT 1 FROM alumno
       WHERE lower(nombre) = lower($1)
         AND lower(COALESCE(apellido_paterno, '')) = lower($2)
         AND lower(COALESCE(apellido_materno, '')) = lower($3)
         AND id_alumno <> $4
       LIMIT 1`,
      [nom, ap || '', am || '', id]
    )
    if (dupRes.rowCount > 0) {
      return res.status(409).json({
        error: 'Ya existe un alumno con ese nombre y apellidos',
      })
    }

    const gradoRes = await query(
      'SELECT id_grado FROM grado WHERE nombre_grado = $1 LIMIT 1',
      [grado.trim()]
    )
    const idGrado = gradoRes.rows[0]?.id_grado ?? null

    const updateRes = await query(
      `UPDATE alumno
       SET nombre = $1,
           apellido_paterno = $2,
           apellido_materno = $3,
           sexo = $4,
           fecha_nacimiento = $5,
           fecha_admision = $6,
           estatus = $7,
           telefono = $8,
           curp = $9,
           alergias_sn = $10,
           alergias_cuales = $11,
           fracturas_sn = $12,
           fracturas_cuales = $13,
           operaciones_sn = $14,
           operaciones_cuales = $15,
           terapias_sn = $16,
           terapias_cuales = $17
       WHERE id_alumno = $18
       RETURNING id_alumno, nombre, apellido_paterno, apellido_materno, estatus, fecha_admision`,
      [
        nom || null,
        ap || null,
        am || null,
        (sexo || null),
        fecha_nacimiento || null,
        fechaAdmision,
        estado,
        telefono || null,
        curpTrim || null,
        Boolean(alergias_sn),
        alergias_cuales || null,
        Boolean(fracturas_sn),
        fracturas_cuales || null,
        Boolean(operaciones_sn),
        operaciones_cuales || null,
        Boolean(terapias_sn),
        terapias_cuales || null,
        id,
      ]
    )

    if (updateRes.rows.length === 0) {
      return res.status(404).json({ error: 'Alumno no encontrado' })
    }

    const alumno = updateRes.rows[0]
    const nombreMostrar = [alumno.nombre, alumno.apellido_paterno, alumno.apellido_materno].filter(Boolean).join(' ').trim() || nombreCompleto

    if (idGrado) {
      await query(
        `INSERT INTO historial_grado (id_alumno, id_grado, fecha_asignacion)
         VALUES ($1, $2, $3)`,
        [id, idGrado, fechaAdmision]
      )
    }

    res.json({
      id,
      nombre: nombreMostrar,
      grado: grado,
      estado: alumno.estatus,
      ingreso: formatFecha(alumno.fecha_admision),
    })
  } catch (err) {
    console.error('Error en PUT /api/alumnos/:id:', err)
    res.status(500).json({
      error: 'Error al actualizar alumno',
      detalle: err?.message || String(err),
      code: err?.code,
      name: err?.name,
    })
  }
})

// DELETE /api/alumnos/:id — eliminar alumno (y sus historiales/pagos relacionados)
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10)
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'ID de alumno inválido' })
  }
  try {
    await query('DELETE FROM historial_grado WHERE id_alumno = $1', [id])
    await query('DELETE FROM pago WHERE id_alumno = $1', [id])
    const del = await query('DELETE FROM alumno WHERE id_alumno = $1 RETURNING id_alumno', [id])
    if (del.rowCount === 0) {
      return res.status(404).json({ error: 'Alumno no encontrado' })
    }
    res.json({ ok: true })
  } catch (err) {
    console.error('Error en DELETE /api/alumnos/:id:', err)
    res.status(500).json({
      error: 'Error al eliminar alumno',
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

function formatFechaISO(date) {
  if (!date) return null
  const d = new Date(date)
  return d.toISOString().slice(0, 10)
}

export default router
