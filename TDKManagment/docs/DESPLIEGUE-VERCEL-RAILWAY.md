# Desplegar con Vercel (frontend) + Railway (backend)

Como en Vercel la API no llegaba a ejecutarse, usamos **solo el frontend** en Vercel y el **backend en Railway**. La app en el navegador llama a la URL de Railway para alumnos y grados.

---

## Esquema

- **Vercel:** solo la carpeta `frontend` (SPA). No usa la carpeta `api/`.
- **Railway:** despliegue del backend (carpeta `backend`). Ahí corre Express y se conecta a Supabase.
- **Frontend en producción:** pide los datos a la URL del backend en Railway (variable `VITE_API_URL`).

---

## 1. Desplegar el backend en Railway

1. Entra en [railway.app](https://railway.app) e inicia sesión (con GitHub si quieres).
2. **New Project** → **Deploy from GitHub repo** → elige tu repositorio (el que tiene TDKManagment).
3. En el proyecto, **Settings** del servicio:
   - **Root Directory:** pon **`backend`** (o la ruta donde está tu `backend` respecto a la raíz del repo, ej. `TDKManagment/backend` si el repo es “Taller de BD” y backend está dentro de TDKManagment).
   - **Build Command:** déjalo por defecto (`npm install` o vacío).
   - **Start Command:** `npm start` (o `node server.js`).
4. **Variables** (en Railway):
   - **`DATABASE_URL`** = connection string de **Supabase** (la misma que usas en Supabase, URI con contraseña).
   - **`PORT`** no hace falta; Railway la asigna.
5. **Deploy.** Cuando termine, en **Settings** → **Networking** → **Generate Domain**. Te dará una URL como:
   ```text
   https://tdkmanagment-backend-production-xxxx.up.railway.app
   ```
   Copia esa URL (sin barra final); es la **URL del backend**.

6. Prueba en el navegador:
   ```text
   https://tu-url.up.railway.app/api/health
   ```
   Deberías ver algo como `{"ok":true,"message":"API TDK Management"}`.

---

## 2. Configurar Vercel para que use el backend en Railway

1. En [vercel.com](https://vercel.com) → tu proyecto del frontend.
2. **Settings** → **Environment Variables**.
3. Añade:
   - **Name:** `VITE_API_URL`
   - **Value:** la URL de Railway (ej. `https://tdkmanagment-backend-production-xxxx.up.railway.app`) **sin** barra final.
   - Aplica a **Production** (y Preview si quieres).
4. **Save**.
5. **Deployments** → **Redeploy** (último deploy → ⋮ → Redeploy).

Importante: `VITE_API_URL` se mete en el build del frontend, así que hace falta **redeploy** después de añadirla para que la app en Vercel use esa URL.

---

## 3. Vercel: solo frontend

Para que Vercel no intente usar la API propia:

1. **Settings** → **General** → **Root Directory** pon **`frontend`** (o la ruta a tu carpeta frontend, ej. `TDKManagment/frontend`).
2. Así Vercel solo construye y sirve la SPA; las peticiones a alumnos/grados irán a la URL de Railway.

---

## 4. Comprobar

1. Abre la URL de tu app en Vercel (ej. `https://tkd-managment.vercel.app`).
2. Ve a **Alumnos** o **Grados**.
3. Deberían cargarse los datos desde Supabase a través del backend en Railway.
4. Si no, abre DevTools → **Network** y revisa que las peticiones vayan a tu dominio de Railway (no a `/api/...` del mismo Vercel).

---

## Resumen

| Dónde    | Qué hace |
|----------|----------|
| **Vercel**  | Sirve solo el frontend (HTML, JS, CSS). Root Directory = `frontend`. Variable `VITE_API_URL` = URL de Railway. |
| **Railway** | Ejecuta el backend (Express). Root Directory = `backend`. Variable `DATABASE_URL` = Supabase. |
| **Supabase**| Base de datos. La usa solo el backend en Railway. |

Con esto la conexión no depende de que Vercel ejecute funciones; todo el backend corre en Railway y el frontend en Vercel solo llama a esa URL.
  esoer funcione