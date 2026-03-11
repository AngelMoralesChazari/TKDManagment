# Si en Vercel sale "Unexpected token '<'" o "Sin grados"

Eso significa que las peticiones a `/api/grados` y `/api/alumnos` están recibiendo **HTML** (la página de la app) en lugar de **JSON**. La API no se está ejecutando.

---

## 1. Probar si la API existe

Abre en el navegador **directamente** (cambia por tu URL de Vercel):

```
https://tkd-managment-git-main-angel-morales-projects-94e68cfb.vercel.app/api/health
```

- **Si ves** `{"ok":true,"message":"API funciona"}` → La API sí corre. El fallo sería otro (por ejemplo `DATABASE_URL` o Supabase).
- **Si ves** la misma pantalla que la app (menú, Inicio, etc.) o HTML → Vercel **no** está ejecutando las funciones de la carpeta `api/`. Sigue el paso 2.

---

## 2. Ajustar Root Directory en Vercel

Para que Vercel use la carpeta `api/` de tu repo:

1. Entra en [vercel.com](https://vercel.com) → tu proyecto **tkd-managment**.
2. **Settings** → **General**.
3. En **Root Directory**:
   - Si pone **`frontend`**: quítalo. Déjalo **vacío** (raíz del repo).
   - Así Vercel usará el `vercel.json` y la carpeta `api/` que están en la **raíz** del repositorio (junto a `frontend/`, `backend/`, etc.).
4. **Save**.
5. **Deployments** → **Redeploy** (último deploy → ⋮ → Redeploy).

Vuelve a abrir en el navegador:

```
https://tu-url.vercel.app/api/health
```

Si ahora sí ves el JSON, la API ya está respondiendo. Prueba también:

```
https://tu-url.vercel.app/api/grados
```

(debería devolver un array de grados o un error en JSON, no HTML).

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
