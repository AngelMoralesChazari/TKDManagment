# Cómo ejecutar la app (y ver los datos en pgAdmin)

Sigue estos pasos en orden. La base de datos es la misma que usas en **pgAdmin**, así que todo lo que registres en la app lo verás ahí.

---

## 1. Configurar la conexión a tu base de datos

La app debe usar **la misma base** que abres en pgAdmin (mismo servidor, usuario, contraseña y nombre de base).

1. Entra en la carpeta del backend:
   ```
   cd backend
   ```
2. Copia el archivo de ejemplo y ábrelo para editarlo:
   ```
   cp .env.example .env
   ```
3. Edita el archivo **`.env`** y pon los mismos datos que usas en pgAdmin:
   - **Host:** normalmente `localhost`
   - **Puerto:** normalmente `5432`
   - **Usuario:** el que usas en pgAdmin (ej. `postgres`)
   - **Contraseña:** la de ese usuario
   - **Base de datos:** el nombre de la base donde creaste las tablas (alumno, grado, etc.)

   Ejemplo si en pgAdmin te conectas a una base llamada `tdk`:

   ```
   PGHOST=localhost
   PGPORT=5432
   PGUSER=postgres
   PGPASSWORD=tu_contraseña
   PGDATABASE=tdk
   ```

   O con URL única:

   ```
   DATABASE_URL=postgresql://postgres:tu_contraseña@localhost:5432/tdk
   ```

---

## 2. Poblar los grados (solo la primera vez)

En **pgAdmin**:

1. Conéctate a tu servidor y abre tu base de datos.
2. Clic derecho en la base → **Query Tool**.
3. Abre el archivo `backend/sql/seed-grados.sql` (o copia y pega su contenido).
4. Ejecuta el script (F5 o botón ▶).
5. Comprueba en pgAdmin: `SELECT * FROM grado;` — deberías ver todos los grados (Blanca, Naranja 10mo kup, etc.).

Si la tabla `grado` ya tenía filas, revisa que no se dupliquen; si hace falta, vacía la tabla antes de ejecutar el seed.

---

## 3. Instalar dependencias (solo la primera vez)

En una terminal:

```bash
cd backend
npm install
```

En **otra** terminal (o después), para el frontend:

```bash
cd frontend
npm install
```

(Usa la ruta completa hasta `TDKManagment` si no estás en esa carpeta, por ejemplo:  
`cd "C:\Users\angel\Documents\Taller de BD\TDKManagment\backend"`.)

---

## 4. Arrancar la aplicación

Necesitas **dos terminales** (o dos pestañas): una para el backend y otra para el frontend.

**Terminal 1 – Backend (API y base de datos):**

```bash
cd backend
npm run dev
```

Debe aparecer algo como: `Servidor en http://localhost:3001`. Déjalo abierto.

**Terminal 2 – Frontend (página web):**

```bash
cd frontend
npm run dev
```

Verás una URL tipo `http://localhost:5173`. Esa es la app.

---

## 5. Probar que funciona y ver los datos en pgAdmin

1. Abre el navegador en la URL que te dio el frontend (ej. `http://localhost:5173`).
2. Entra en **Alumnos** y haz clic en **Nuevo alumno**.
3. Rellena nombre, elige un grado del desplegable, estado y fecha de ingreso → **Registrar**.
4. En la misma página debería aparecer el alumno en la tabla.
5. En **pgAdmin**, en tu base de datos, abre **Query Tool** y ejecuta:
   ```sql
   SELECT * FROM alumno;
   SELECT * FROM historial_grado;
   ```
   Deberías ver el alumno recién creado y su grado asignado.

A partir de ahí puedes seguir registrando alumnos desde la app y haciendo todas las consultas que quieras en pgAdmin sobre las tablas `alumno`, `grado`, `historial_grado`, etc.
