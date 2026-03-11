# Dos bases de datos: local (PostgreSQL) + nube (Supabase)

Tu app usa **dos bases distintas** según dónde corra:

| Dónde corre la app | Base de datos | Uso |
|--------------------|---------------|-----|
| **En tu PC** (desarrollo) | PostgreSQL local (`tks_taekwondo`) en pgAdmin | Probar, desarrollar, datos de prueba |
| **En Vercel** (web pública) | **Supabase** (PostgreSQL en la nube) | Datos reales de la web |

No se borra nada: son independientes. Lo que hagas en local queda en local; lo que pase en la web (Vercel) se guarda en Supabase.

---

## 1. Base local (ya la tienes)

- **PostgreSQL** en tu PC, base `tks_taekwondo`.
- **Backend** con `.env` (o variables en `backend`): `PGDATABASE=tks_taekwondo`, etc.
- **pgAdmin** para consultas y scripts.

Sigue usándola igual para desarrollar. No cambies nada aquí.

---

## 2. Base en la nube: Supabase (para Vercel)

### Crear proyecto en Supabase

1. Entra en [supabase.com](https://supabase.com) e inicia sesión.
2. **New project** → elige organización (o crea una).
3. **Name** (ej. `tdk-management`), **Database password** (guárdala), **Region** → **Create new project**.
4. Cuando esté listo, ve a **Project Settings** (engranaje) → **Database**.
5. En **Connection string** elige **URI** y copia la URL. Se ve así:
   ```text
   postgresql://postgres.[ref]:[TU_PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```
   Sustituye `[TU_PASSWORD]` por la contraseña que pusiste al crear el proyecto. Esa es tu **connection string** para Vercel.

### Crear tablas y grados en Supabase

1. En Supabase, abre **SQL Editor**.
2. Ejecuta **todo** el contenido del archivo **`backend/sql/schema-para-supabase.sql`** (incluye tablas + grados). Así la base en Supabase queda igual que tu esquema local.

### Conectar Vercel a Supabase

1. En [vercel.com](https://vercel.com) → tu proyecto → **Settings** → **Environment Variables**.
2. Añade:
   - **Name:** `DATABASE_URL`
   - **Value:** la connection string de Supabase (la URI que copiaste, con la contraseña ya puesta).
3. **Save** y haz **Redeploy** del proyecto.

Listo: la web en Vercel usará Supabase; tu desarrollo local seguirá usando PostgreSQL.

---

## Resumen

- **Desarrollo (tu PC):** PostgreSQL local + backend con `.env` → sigues como hasta ahora.
- **Producción (Vercel):** Supabase → creas proyecto, ejecutas `schema-para-supabase.sql`, pones `DATABASE_URL` en Vercel y redeploy.

No hace falta borrar ni migrar la base local; las dos conviven.
