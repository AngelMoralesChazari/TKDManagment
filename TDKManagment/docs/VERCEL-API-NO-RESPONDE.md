# Si en Vercel sale "Unexpected token '<'" o "Sin grados"

Eso significa que las peticiones a `/api/grados` y `/api/alumnos` están recibiendo **HTML** (la página de la app) en lugar de **JSON**. La API no se está ejecutando en esa URL.

**Importante:** Si en Supabase ves "connection authorized", la base está bien; el fallo es que Vercel estaba sirviendo la SPA para `/api/*`. Ahora toda la API va en un solo handler Express: `api/[[...path]].js` usa el mismo backend que en local.

**Cache del navegador:** Si en Network ves `304` en alumnos/grados, el navegador está usando respuesta en caché (a veces HTML viejo). Prueba con **Ctrl+Shift+R** (hard refresh) o en DevTools → Network → marcar "Disable cache" y recargar.

---

## 1. Probar si la API existe

Abre en el navegador **directamente** (cambia por tu URL de Vercel):

```
https://tkd-managment-git-main-angel-morales-projects-94e68cfb.vercel.app/api/health
```

- **Si ves** `{"ok":true,"message":"API funciona"}` → La API sí corre. El fallo sería otro (por ejemplo `DATABASE_URL` o Supabase).
- **Si ves** la misma pantalla que la app (menú, Inicio, etc.) o HTML → Vercel **no** está ejecutando las funciones de la carpeta `api/`. Sigue el paso 2.

---

## 2. Root Directory y último deploy

En Vercel la carpeta `api/` solo se usa si está en la **raíz del proyecto** que Vercel usa.

1. Entra en [vercel.com](https://vercel.com) → tu proyecto **tkd-managment**.
2. **Settings** → **General** → **Root Directory**:
   - Si pone **`frontend`**: bórralo y déjalo **vacío**. Así se usa la raíz del repo, donde están `api/`, `lib/`, `vercel.json` y `package.json` (con `pg`).
   - Si ya está vacío, el problema puede ser que el último deploy no tenga los archivos nuevos. Sigue al paso 3.
3. Asegúrate de haber hecho **commit y push** de todo (sobre todo `api/`, `lib/`, `vercel.json` y `package.json` en la raíz).
4. **Deployments** → **Redeploy** (⋮ del último deploy → Redeploy). Espera a que termine.
5. Prueba de nuevo en el navegador:
   - `https://tu-url.vercel.app/api/health` → debe devolver `{"ok":true,"message":"API funciona"}`.
   - `https://tu-url.vercel.app/api/grados` → debe devolver un JSON (array o error), nunca HTML.

---

## 3. Comprobar que subiste la API

En tu repo (en tu PC o en GitHub) debe existir en la **raíz** (no solo dentro de `frontend/`):

- `api/health.js`
- `api/grados.js`
- `api/alumnos.js`
- `lib/db.js`
- `package.json` (con `"pg"` en dependencies)
- `vercel.json` (con `buildCommand`, `outputDirectory`, etc.)

Si falta algo, haz commit y push de esos archivos y vuelve a desplegar.

---

## 4. Las dos URLs que tienes

- **`tkd-managment-git-main-...`** → suele ser el deploy de la rama **main**.
- **`tkd-managment-6of5nnexh-...`** → suele ser un deploy concreto (preview o producción).

Ambas deben usar la misma configuración (Root Directory y variables). Prueba **`/api/health`** en las dos; si en una responde JSON y en la otra no, revisa que el redeploy se haya aplicado a la que falla.

---

## Resumen

1. Abre **`/api/health`** en el navegador.
2. Si ves HTML → **Root Directory** vacío (raíz del repo), redeploy, y que en la raíz estén `api/`, `lib/`, `vercel.json`, `package.json`.
3. Cuando **`/api/health`** devuelva JSON, prueba **`/api/grados`** y la app; si sigue “Sin grados”, revisa **`DATABASE_URL`** en Vercel (Supabase).
