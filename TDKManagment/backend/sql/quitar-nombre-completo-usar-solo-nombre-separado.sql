ALTER TABLE alumno ADD COLUMN IF NOT EXISTS nombre VARCHAR(50);
ALTER TABLE alumno ADD COLUMN IF NOT EXISTS apellido_paterno VARCHAR(50);
ALTER TABLE alumno ADD COLUMN IF NOT EXISTS apellido_materno VARCHAR(50);
ALTER TABLE alumno ADD COLUMN IF NOT EXISTS curp VARCHAR(18);
ALTER TABLE alumno ADD COLUMN IF NOT EXISTS alergias_sn BOOLEAN DEFAULT false;
ALTER TABLE alumno ADD COLUMN IF NOT EXISTS alergias_cuales TEXT;
ALTER TABLE alumno ADD COLUMN IF NOT EXISTS fracturas_sn BOOLEAN DEFAULT false;
ALTER TABLE alumno ADD COLUMN IF NOT EXISTS fracturas_cuales TEXT;
ALTER TABLE alumno ADD COLUMN IF NOT EXISTS operaciones_sn BOOLEAN DEFAULT false;
ALTER TABLE alumno ADD COLUMN IF NOT EXISTS operaciones_cuales TEXT;
ALTER TABLE alumno ADD COLUMN IF NOT EXISTS terapias_sn BOOLEAN DEFAULT false;
ALTER TABLE alumno ADD COLUMN IF NOT EXISTS terapias_cuales TEXT;

-- 2) Pasar datos de nombre_completo a nombre 
UPDATE alumno
SET nombre = TRIM(nombre_completo)
WHERE (nombre IS NULL OR nombre = '')
  AND nombre_completo IS NOT NULL
  AND TRIM(nombre_completo) <> '';

-- 3) Quitar la columna nombre_completo
ALTER TABLE alumno DROP COLUMN IF EXISTS nombre_completo;
