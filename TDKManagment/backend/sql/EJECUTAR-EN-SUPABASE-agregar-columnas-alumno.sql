-- Nombre desglosado
ALTER TABLE alumno ADD COLUMN IF NOT EXISTS nombre VARCHAR(50);
ALTER TABLE alumno ADD COLUMN IF NOT EXISTS apellido_paterno VARCHAR(50);
ALTER TABLE alumno ADD COLUMN IF NOT EXISTS apellido_materno VARCHAR(50);

-- CURP
ALTER TABLE alumno ADD COLUMN IF NOT EXISTS curp VARCHAR(18);

-- Historial de salud
ALTER TABLE alumno ADD COLUMN IF NOT EXISTS alergias_sn BOOLEAN DEFAULT false;
ALTER TABLE alumno ADD COLUMN IF NOT EXISTS alergias_cuales TEXT;
ALTER TABLE alumno ADD COLUMN IF NOT EXISTS fracturas_sn BOOLEAN DEFAULT false;
ALTER TABLE alumno ADD COLUMN IF NOT EXISTS fracturas_cuales TEXT;
ALTER TABLE alumno ADD COLUMN IF NOT EXISTS operaciones_sn BOOLEAN DEFAULT false;
ALTER TABLE alumno ADD COLUMN IF NOT EXISTS operaciones_cuales TEXT;
ALTER TABLE alumno ADD COLUMN IF NOT EXISTS terapias_sn BOOLEAN DEFAULT false;
ALTER TABLE alumno ADD COLUMN IF NOT EXISTS terapias_cuales TEXT;

-- (Opcional) Si quieres eliminar nombre_completo y usar solo nombre + apellidos,
-- usa el script: quitar-nombre-completo-usar-solo-nombre-separado.sql
