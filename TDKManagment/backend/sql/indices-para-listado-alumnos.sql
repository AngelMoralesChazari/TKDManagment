CREATE INDEX IF NOT EXISTS idx_historial_grado_alumno_fecha
  ON historial_grado (id_alumno, fecha_asignacion DESC NULLS LAST, id_historial DESC);

-- Opcional: si en el futuro filtras o ordenas por estatus o fecha_admision
CREATE INDEX IF NOT EXISTS idx_alumno_estatus ON alumno (estatus);
CREATE INDEX IF NOT EXISTS idx_alumno_fecha_admision ON alumno (fecha_admision DESC);
