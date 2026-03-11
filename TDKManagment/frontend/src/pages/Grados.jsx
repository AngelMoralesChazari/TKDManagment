import { useState, useEffect } from 'react'

const API_GRADOS = import.meta.env.DEV ? 'http://localhost:3001/api/grados' : '/api/grados'

function colorClase(nombre) {
  if (!nombre) return 'bg-slate-400'
  const n = nombre.toLowerCase()
  if (n.includes('blanca')) return 'bg-white border border-slate-200'
  if (n.includes('naranja')) return 'bg-orange-500'
  if (n.includes('amarilla')) return 'bg-yellow-400'
  if (n.includes('verde')) return 'bg-green-500'
  if (n.includes('azul')) return 'bg-blue-600'
  if (n.includes('roja')) return 'bg-red-600'
  if (n.includes('poom')) return 'poom'
  if (n.includes('negra')) return 'bg-slate-900'
  return 'bg-slate-500'
}

export default function Grados() {
  const [grados, setGrados] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let ok = true
    fetch(API_GRADOS)
      .then((res) => res.ok ? res.json() : [])
      .then((data) => { if (ok) setGrados(Array.isArray(data) ? data : []) })
      .catch(() => { if (ok) setGrados([]) })
      .finally(() => { if (ok) setCargando(false) })
    return () => { ok = false }
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Grados</h2>
        <p className="text-slate-600 mt-0.5">Cintas y distribución de alumnos</p>
      </div>

      {cargando ? (
        <p className="text-slate-500">Cargando grados...</p>
      ) : grados.length === 0 ? (
        <p className="text-slate-500">No hay grados cargados. Ejecuta seed-grados.sql en pgAdmin.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {grados.map((g) => {
            const color = colorClase(g.nombre_grado)
            return (
              <div
                key={g.id_grado}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
              >
                {color === 'poom' ? (
                  <div className="w-14 h-14 rounded-full shrink-0 overflow-hidden flex ring-2 ring-slate-200">
                    <div className="w-1/2 h-full bg-red-600" />
                    <div className="w-1/2 h-full bg-slate-900" />
                  </div>
                ) : (
                  <div className={`w-14 h-14 rounded-full shrink-0 ${color} ring-2 ring-slate-200`} />
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900">Cinta {g.nombre_grado}</p>
                  <p className="text-sm text-slate-500">— alumnos</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-4">Próximo examen de grados</h3>
        <p className="text-slate-600 text-sm">Programa exámenes en la sección Exámenes. La fecha y los grados habilitados se mostrarán aquí.</p>
      </div>
    </div>
  )
}
