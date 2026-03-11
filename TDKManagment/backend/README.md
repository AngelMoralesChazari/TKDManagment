# Backend TDK Management

API en Node.js + Express + PostgreSQL. Usa **tu base de datos** con las tablas: `alumno`, `tutor`, `colegiatura`, `grado`, `historial_grado`, `pago`.

## 1. Instalar dependencias

```bash
cd backend
npm install
```

## 2. Conectar tu base de datos

Copia el archivo de ejemplo y pon los datos de tu PostgreSQL (el mismo que usas en pgAdmin):

```bash
cp .env.example .env
```

Edita `.env`:

- **Opción A – Variables sueltas:**  
  `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` (nombre de la base donde creaste las tablas)

- **Opción B – URL única:**  
  `DATABASE_URL=postgresql://usuario:password@localhost:5432/nombre_de_tu_base`

El nombre de la base y el usuario deben ser los mismos que en pgAdmin para que los datos se guarden ahí y puedas hacer consultas en pgAdmin.

## 3. Poblar la tabla de grados (cintas)

La app asigna grado al alumno desde la tabla `grado`. Si `grado` está vacía, ejecuta **una vez** en pgAdmin (o psql) el archivo:

```
backend/sql/seed-grados.sql
```

Eso inserta: Blanca, Naranja, Amarilla, Verde, Azul, Roja, Poom, Negra. Si ya tienes esos grados con otros nombres, ajusta el script o los nombres en la app.

## 4. Arrancar el servidor

```bash
npm run dev
```

El API queda en `http://localhost:3001`. El frontend redirige las peticiones a `/api` a este puerto.

## 5. Probar que se guarda en tu BD

1. Arranca el backend (`npm run dev` en `backend`).
2. Arranca el frontend (`npm run dev` en `frontend`).
3. En la app ve a **Alumnos** → **Nuevo alumno** → llena nombre, grado, estado, fecha de ingreso → **Registrar**.
4. En **pgAdmin** abre tu base → ejecuta:  
   `SELECT * FROM alumno;`  
   `SELECT * FROM historial_grado;`  
   Deberías ver el nuevo alumno y su grado asignado.

## Endpoints

- `GET /api/alumnos` – Lista alumnos (nombre, grado actual desde `historial_grado`, estatus, fecha admisión).
- `POST /api/alumnos` – Crea alumno en `alumno` y asigna su cinta en `historial_grado`. Body: `nombre`, `grado`, `estado`, opcional `fecha_ingreso`.

## Esquema que usa la API

- **alumno:** `id_alumno`, `nombre_completo`, `fecha_admision`, `estatus`, etc. (`id_tutor` e `id_colegiatura` pueden ser NULL al crear desde la app).
- **grado:** `id_grado`, `nombre_grado`, `nivel` (llenada con `seed-grados.sql`).
- **historial_grado:** se inserta un registro al dar de alta un alumno con su primer grado.
