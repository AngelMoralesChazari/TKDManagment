CREATE TABLE IF NOT EXISTS tutor (
  id_tutor SERIAL PRIMARY KEY,
  nombre_completo VARCHAR(100),
  telefono VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS colegiatura (
  id_colegiatura SERIAL PRIMARY KEY,
  monto DECIMAL(10,2) NOT NULL,
  descripcion VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS grado (
  id_grado SERIAL PRIMARY KEY,
  nombre_grado VARCHAR(50) NOT NULL,
  nivel INT
);

CREATE TABLE IF NOT EXISTS alumno (
  id_alumno SERIAL PRIMARY KEY,
  nombre VARCHAR(50),
  apellido_paterno VARCHAR(50),
  apellido_materno VARCHAR(50),
  sexo CHAR(1),
  fecha_nacimiento DATE,
  fecha_admision DATE,
  estatus VARCHAR(20),
  telefono VARCHAR(20),
  curp VARCHAR(18),
  alergias_sn BOOLEAN DEFAULT false,
  alergias_cuales TEXT,
  fracturas_sn BOOLEAN DEFAULT false,
  fracturas_cuales TEXT,
  operaciones_sn BOOLEAN DEFAULT false,
  operaciones_cuales TEXT,
  terapias_sn BOOLEAN DEFAULT false,
  terapias_cuales TEXT,
  id_tutor INT,
  id_colegiatura INT,
  CONSTRAINT fk_tutor FOREIGN KEY (id_tutor) REFERENCES tutor(id_tutor),
  CONSTRAINT fk_colegiatura FOREIGN KEY (id_colegiatura) REFERENCES colegiatura(id_colegiatura)
);

CREATE TABLE IF NOT EXISTS historial_grado (
  id_historial SERIAL PRIMARY KEY,
  id_alumno INT NOT NULL,
  id_grado INT NOT NULL,
  fecha_asignacion DATE,
  CONSTRAINT fk_alumno FOREIGN KEY (id_alumno) REFERENCES alumno(id_alumno),
  CONSTRAINT fk_grado FOREIGN KEY (id_grado) REFERENCES grado(id_grado)
);

CREATE TABLE IF NOT EXISTS pago (
  id_pago SERIAL PRIMARY KEY,
  id_alumno INT NOT NULL,
  fecha_pago DATE,
  monto_pagado DECIMAL(10,2),
  estado VARCHAR(20),
  CONSTRAINT fk_pago_alumno FOREIGN KEY (id_alumno) REFERENCES alumno(id_alumno)
);

-- Grados (cintas) para la app
INSERT INTO grado (nombre_grado, nivel) VALUES
  ('Blanca',                    1),
  ('Naranja 10mo kup',          2),
  ('Naranja avanzada 9no kup',  3),
  ('Amarilla 8vo kup',          4),
  ('Amarilla avanzada 7mo kup', 5),
  ('Verde 6to kup',             6),
  ('Verde avanzada 5to kup',    7),
  ('Azul 4to kup',              8),
  ('Azul avanzada 3er kup',     9),
  ('Roja 2do kup',             10),
  ('Roja avanzada 1er kup',    11),
  ('Parcial 1',                12),
  ('Parcial 2',                13),
  ('Parcial 3',                14),
  ('Negra 1er poom',          15),
  ('Negra 2do poom',          16),
  ('Negra 3er poom',          17),
  ('Negra 1er dan',           18),
  ('Negra 2do dan',           19),
  ('Negra 3er dan',           20);
