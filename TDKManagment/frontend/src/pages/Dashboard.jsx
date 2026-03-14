import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { API_ALUMNOS } from '../api.js'

export default function Dashboard() {
  const [alumnos, setAlumnos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let ok = true
    fetch(API_ALUMNOS)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (ok) setAlumnos(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        if (ok) setAlumnos([])
      })
      .finally(() => {
        if (ok) setCargando(false)
      })
    return () => { ok = false }
  }, [])

  const alumnosActivos = alumnos.filter((a) => (a.estado || '').toLowerCase() === 'activo')
  const totalActivos = alumnosActivos.length

  const stats = [
    { label: 'Alumnos activos', value: cargando ? '…' : String(totalActivos), sub: 'Se actualiza al cargar Inicio', color: 'primary' },
    { label: 'Pagos al corriente', value: '—', sub: 'Desde cobranza', color: 'emerald' },
    { label: 'Pendientes de pago', value: '—', sub: 'Desde cobranza', color: 'amber' },
    { label: 'Exámenes este mes', value: '—', sub: 'Desde exámenes', color: 'slate' },
  ]

  const colorClasses = {
    primary: 'bg-primary-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    slate: 'bg-slate-600',
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Inicio</h2>
        <p className="text-slate-600 mt-0.5">Resumen de la escuela</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, sub, color }) => (
          <div
            key={label}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
                <p className="text-xs text-slate-500 mt-1">{sub}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} opacity-90`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Alumnos activos</h3>
            <Link to="/alumnos" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Ver todos
            </Link>
          </div>
          {cargando ? (
            <p className="text-slate-500 text-sm">Cargando lista…</p>
          ) : alumnosActivos.length === 0 ? (
            <p className="text-slate-500 text-sm">No hay alumnos activos. Registra alumnos en la sección Alumnos.</p>
          ) : (
            <ul className="space-y-2">
              {alumnosActivos.slice(0, 10).map((a) => (
                <li key={a.id} className="flex justify-between items-center text-sm">
                  <span className="text-slate-900 font-medium truncate pr-2">{a.nombre}</span>
                  <span className="text-slate-500 shrink-0">{a.grado}</span>
                </li>
              ))}
              {alumnosActivos.length > 10 && (
                <li className="text-slate-500 text-sm pt-1">
                  y {alumnosActivos.length - 10} más…
                </li>
              )}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-4">Próximos eventos</h3>
          <p className="text-slate-500 text-sm">No hay eventos programados. Crea exámenes en la sección Exámenes para verlos aquí.</p>
        </div>
      </div>
    </div>
  )
}
