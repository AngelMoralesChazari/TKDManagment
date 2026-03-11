import { useState, useEffect } from 'react'

// Usar la URL del backend en desarrollo para que funcione aunque el proxy falle
const API_BASE = import.meta.env.DEV ? 'http://localhost:3001' : ''
const API_ALUMNOS = `${API_BASE}/api/alumnos`
const API_GRADOS = `${API_BASE}/api/grados`

const estadoStyles = {
  Activo: 'bg-emerald-100 text-emerald-800',
  Inactivo: 'bg-amber-100 text-amber-800',
  Baja: 'bg-red-200 text-red-600',
}

const ESTADOS = ['Activo', 'Inactivo', 'Baja']

export default function Alumnos() {
  const [alumnos, setAlumnos] = useState([])
  const [grados, setGrados] = useState([])
  const [errorGrados, setErrorGrados] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [form, setForm] = useState({
    nombre: '',
    grado: '',
    estado: 'Activo',
    fecha_ingreso: new Date().toISOString().slice(0, 10),
  })

  const cargarGrados = async () => {
    setErrorGrados(null)
    try {
      const res = await fetch(API_GRADOS)
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setGrados(Array.isArray(data) ? data : [])
        if (data?.length > 0) setForm((f) => ({ ...f, grado: f.grado || data[0].nombre_grado }))
      } else {
        setErrorGrados(data.detalle || data.error || 'No se pudieron cargar los grados')
      }
    } catch (e) {
      setErrorGrados(e.message || 'Revisa que el backend esté en http://localhost:3001')
    }
  }

  const cargarAlumnos = async () => {
    setCargando(true)
    setError(null)
    try {
      const res = await fetch(API_ALUMNOS)
      if (!res.ok) throw new Error('Error al cargar alumnos')
      const data = await res.json()
      setAlumnos(data)
    } catch (err) {
      setError(err.message || 'No se pudo conectar con el servidor. ¿Está corriendo el backend?')
      setAlumnos([])
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarGrados()
  }, [])

  useEffect(() => {
    cargarAlumnos()
  }, [])

  useEffect(() => {
    if (modalAbierto && grados.length > 0 && !form.grado) {
      setForm((f) => ({ ...f, grado: grados[0].nombre_grado }))
    }
  }, [modalAbierto, grados])

  const handleCrear = async (e) => {
    e.preventDefault()
    if (!form.nombre.trim()) return
    setEnviando(true)
    try {
      const res = await fetch(API_ALUMNOS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre.trim(),
          grado: form.grado,
          estado: form.estado,
          fecha_ingreso: form.fecha_ingreso || undefined,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Error al registrar')
      }
      const nuevo = await res.json()
      setAlumnos((prev) => [nuevo, ...prev])
      setModalAbierto(false)
      setForm((f) => ({ ...f, nombre: '', grado: grados[0]?.nombre_grado ?? '', estado: 'Activo', fecha_ingreso: new Date().toISOString().slice(0, 10) }))
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Alumnos</h2>
          <p className="text-slate-600 mt-0.5">Expedientes y estado de los alumnos</p>
        </div>
        <button
          type="button"
          onClick={() => setModalAbierto(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          + Nuevo alumno
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Nombre</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Grado</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Estado</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider hidden sm:table-cell">Ingreso</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider w-20">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    Cargando alumnos...
                  </td>
                </tr>
              ) : alumnos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    No hay alumnos registrados. Agrega uno con &quot;Nuevo alumno&quot;.
                  </td>
                </tr>
              ) : (
                alumnos.map((a) => (
                  <tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900">{a.nombre}</td>
                    <td className="px-4 py-3 text-slate-700">{a.grado}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${estadoStyles[a.estado] || estadoStyles.Baja}`}>
                        {a.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 hidden sm:table-cell">{a.ingreso}</td>
                    <td className="px-4 py-3">
                      <button type="button" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        Ver
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nuevo alumno */}
      {modalAbierto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setModalAbierto(false)}
          aria-hidden="true"
        >
          <div
            className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Nuevo alumno</h3>
            {errorGrados && (
              <p className="mb-4 text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
                Grados: {errorGrados}
              </p>
            )}
            <form onSubmit={handleCrear} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre completo</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900"
                  placeholder="Ej. Ana Martínez"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Grado / Cinta</label>
                <select
                  value={form.grado}
                  onChange={(e) => setForm((p) => ({ ...p, grado: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900"
                >
                  {grados.length === 0 && (
                    <option value="">— Sin grados. Ejecuta seed-grados.sql en pgAdmin —</option>
                  )}
                  {grados.map((g) => (
                    <option key={g.id_grado} value={g.nombre_grado}>{g.nombre_grado}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
                <select
                  value={form.estado}
                  onChange={(e) => setForm((p) => ({ ...p, estado: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900"
                >
                  {ESTADOS.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de ingreso</label>
                <input
                  type="date"
                  value={form.fecha_ingreso}
                  onChange={(e) => setForm((p) => ({ ...p, fecha_ingreso: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={enviando || !form.nombre.trim()}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 disabled:opacity-50"
                >
                  {enviando ? 'Guardando...' : 'Registrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
