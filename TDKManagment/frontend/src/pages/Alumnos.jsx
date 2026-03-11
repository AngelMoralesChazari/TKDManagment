import { useState, useEffect } from 'react'
import { API_ALUMNOS, API_GRADOS } from '../api.js'

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
    apellido_paterno: '',
    apellido_materno: '',
    grado: '',
    estado: 'Activo',
    fecha_ingreso: new Date().toISOString().slice(0, 10),
    fecha_nacimiento: '',
    curp: '',
    telefono: '',
    alergias_sn: false,
    alergias_cuales: '',
    fracturas_sn: false,
    fracturas_cuales: '',
    operaciones_sn: false,
    operaciones_cuales: '',
    terapias_sn: false,
    terapias_cuales: '',
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
      setErrorGrados(e.message || 'Revisa que el backend esté en marcha')
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
    const nom = form.nombre.trim()
    const ap = form.apellido_paterno.trim()
    const am = form.apellido_materno.trim()
    if (!nom && !ap && !am) return
    setEnviando(true)
    try {
      const res = await fetch(API_ALUMNOS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nom || undefined,
          apellido_paterno: ap || undefined,
          apellido_materno: am || undefined,
          grado: form.grado,
          estado: form.estado,
          fecha_ingreso: form.fecha_ingreso || undefined,
          fecha_nacimiento: form.fecha_nacimiento || undefined,
          curp: form.curp.trim() || undefined,
          telefono: form.telefono.trim() || undefined,
          alergias_sn: form.alergias_sn,
          alergias_cuales: form.alergias_cuales.trim() || undefined,
          fracturas_sn: form.fracturas_sn,
          fracturas_cuales: form.fracturas_cuales.trim() || undefined,
          operaciones_sn: form.operaciones_sn,
          operaciones_cuales: form.operaciones_cuales.trim() || undefined,
          terapias_sn: form.terapias_sn,
          terapias_cuales: form.terapias_cuales.trim() || undefined,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        const msg = data.detalle ? `${data.error || 'Error al registrar'}: ${data.detalle}` : (data.error || 'Error al registrar')
        throw new Error(msg)
      }
      const nuevo = await res.json()
      setModalAbierto(false)
      await cargarAlumnos()
      setForm((f) => ({
        ...f,
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        grado: grados[0]?.nombre_grado ?? '',
        estado: 'Activo',
        fecha_ingreso: new Date().toISOString().slice(0, 10),
        fecha_nacimiento: '',
        curp: '',
        telefono: '',
        alergias_sn: false,
        alergias_cuales: '',
        fracturas_sn: false,
        fracturas_cuales: '',
        operaciones_sn: false,
        operaciones_cuales: '',
        terapias_sn: false,
        terapias_cuales: '',
      }))
      } catch (err) {
      setError(err.message)
      setEnviando(false)
      return
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
            <form onSubmit={handleCrear} className="space-y-4 max-h-[85vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={form.nombre}
                    onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900"
                    placeholder="Ej. Ana"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Apellido paterno</label>
                  <input
                    type="text"
                    value={form.apellido_paterno}
                    onChange={(e) => setForm((p) => ({ ...p, apellido_paterno: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900"
                    placeholder="Ej. Martínez"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Apellido materno</label>
                  <input
                    type="text"
                    value={form.apellido_materno}
                    onChange={(e) => setForm((p) => ({ ...p, apellido_materno: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900"
                    placeholder="Ej. López"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de nacimiento</label>
                  <input
                    type="date"
                    value={form.fecha_nacimiento}
                    onChange={(e) => setForm((p) => ({ ...p, fecha_nacimiento: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900"
                  />
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
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">CURP</label>
                <input
                  type="text"
                  value={form.curp}
                  onChange={(e) => setForm((p) => ({ ...p, curp: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900"
                  placeholder="Ej. MALU960101HDFLRN01"
                  maxLength={18}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono de contacto</label>
                <input
                  type="tel"
                  value={form.telefono}
                  onChange={(e) => setForm((p) => ({ ...p, telefono: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900"
                  placeholder="Ej. 5512345678"
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

              <div className="border-t border-slate-200 pt-4 mt-2">
                <h4 className="text-sm font-semibold text-slate-800 mb-3">Historial de salud</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <input
                        type="checkbox"
                        id="alergias_sn"
                        checked={form.alergias_sn}
                        onChange={(e) => setForm((p) => ({ ...p, alergias_sn: e.target.checked }))}
                        className="rounded border-slate-300"
                      />
                      <label htmlFor="alergias_sn" className="text-sm font-medium text-slate-700">Alergias</label>
                    </div>
                    {form.alergias_sn && (
                      <input
                        type="text"
                        value={form.alergias_cuales}
                        onChange={(e) => setForm((p) => ({ ...p, alergias_cuales: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 text-sm"
                        placeholder="¿Cuáles?"
                      />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <input
                        type="checkbox"
                        id="fracturas_sn"
                        checked={form.fracturas_sn}
                        onChange={(e) => setForm((p) => ({ ...p, fracturas_sn: e.target.checked }))}
                        className="rounded border-slate-300"
                      />
                      <label htmlFor="fracturas_sn" className="text-sm font-medium text-slate-700">Fracturas</label>
                    </div>
                    {form.fracturas_sn && (
                      <input
                        type="text"
                        value={form.fracturas_cuales}
                        onChange={(e) => setForm((p) => ({ ...p, fracturas_cuales: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 text-sm"
                        placeholder="¿Cuáles?"
                      />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <input
                        type="checkbox"
                        id="operaciones_sn"
                        checked={form.operaciones_sn}
                        onChange={(e) => setForm((p) => ({ ...p, operaciones_sn: e.target.checked }))}
                        className="rounded border-slate-300"
                      />
                      <label htmlFor="operaciones_sn" className="text-sm font-medium text-slate-700">Operaciones</label>
                    </div>
                    {form.operaciones_sn && (
                      <input
                        type="text"
                        value={form.operaciones_cuales}
                        onChange={(e) => setForm((p) => ({ ...p, operaciones_cuales: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 text-sm"
                        placeholder="¿Cuáles?"
                      />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <input
                        type="checkbox"
                        id="terapias_sn"
                        checked={form.terapias_sn}
                        onChange={(e) => setForm((p) => ({ ...p, terapias_sn: e.target.checked }))}
                        className="rounded border-slate-300"
                      />
                      <label htmlFor="terapias_sn" className="text-sm font-medium text-slate-700">Terapias</label>
                    </div>
                    {form.terapias_sn && (
                      <input
                        type="text"
                        value={form.terapias_cuales}
                        onChange={(e) => setForm((p) => ({ ...p, terapias_cuales: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 text-sm"
                        placeholder="¿Cuáles?"
                      />
                    )}
                  </div>
                </div>
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
                  disabled={enviando || (!form.nombre.trim() && !form.apellido_paterno.trim() && !form.apellido_materno.trim())}
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
