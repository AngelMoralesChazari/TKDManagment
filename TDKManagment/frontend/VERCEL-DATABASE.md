# Base de datos en Vercel (Supabase)

En Vercel la app usa **Serverless Functions** (carpeta `api/`) que se ejecutan cuando alguien llama a `/api/alumnos` o `/api/grados`. No hace falta tener un servidor backend encendido.

**Esquema de dos bases:** desarrollo en tu PC usa **PostgreSQL local**; la web en Vercel usa **Supabase**. Ver `docs/DOS-BASES-LOCAL-Y-SUPABASE.md` para el detalle.

---

## 1. Crear proyecto en Supabase

1. [supabase.com](https://supabase.com) → inicia sesión → **New project**.
2. Nombre del proyecto (ej. `tdk-management`), **Database password** (guárdala), región → **Create new project**.
3. Cuando esté listo: **Project Settings** (engranaje) → **Database**.
4. En **Connection string** elige **URI**. Copia la URL y sustituye `[YOUR-PASSWORD]` por tu contraseña. Esa es tu `DATABASE_URL` para Vercel.

---

## 2. Crear tablas y grados en Supabase

1. En Supabase abre **SQL Editor**.
2. Pega y ejecuta **todo** el contenido de **`backend/sql/schema-para-supabase.sql`** (incluye tablas + grados). Así la base en la nube queda igual que tu esquema local.

---

## 3. Configurar Vercel

1. [vercel.com](https://vercel.com) → tu proyecto → **Settings**:
   - **Root Directory:** debe ser la **raíz del repo** (vacío o `.`), no `frontend`. Así Vercel usa la carpeta `api/` de la raíz y la API responde en `/api/grados` y `/api/alumnos`.
   - **Environment Variables:** añade **`DATABASE_URL`** con la connection string de Supabase (URI con la contraseña ya puesta).
2. **Save** → **Redeploy** (Deployments → ⋮ → Redeploy).

Después del redeploy, la web en Vercel usará Supabase; tu desarrollo local sigue usando PostgreSQL.
