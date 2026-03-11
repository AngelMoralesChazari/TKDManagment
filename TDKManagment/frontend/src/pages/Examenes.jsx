import { useState, useEffect } from 'react'
import { API_GRADOS } from '../api.js'

export default function Examenes() {
  const [examenes, setExamenes] = useState([])
  const [gradosOpciones, setGradosOpciones] = useState([])
  const [modalAbierto, setModalAbierto] = useState(false)
  const [form, setForm] = useState({
    fecha: '',
    lugar: 'Dojo principal',
    observaciones: '',
    grados: [],
  })

  useEffect(() => {
    fetch(API_GRADOS)
      .then((res) => res.ok ? res.json() : [])
      .then((data) => setGradosOpciones(Array.isArray(data) ? data : []))
      .catch(() => setGradosOpciones([]))
  }, [])

  const toggleGrado = (grado) => {
    setForm((prev) => ({
      ...prev,
      grados: prev.grados.includes(grado)
        ? prev.grados.filter((g) => g !== grado)
        : [...prev.grados, grado],
    }))
  }

  const handleCrear = (e) => {
    e.preventDefault()
    setModalAbierto(false)
    setForm({ fecha: '', lugar: 'Dojo principal', observaciones: '', grados: [] })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Exámenes</h2>
          <p className="text-slate-600 mt-0.5">Programa y consulta exámenes de grados</p>
        </div>
        <button
          type="button"
          onClick={() => setModalAbierto(true)}
          className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
        >
          <span>+</span>
          Nuevo examen
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <h3 className="px-5 py-4 font-semibold text-slate-900 border-b border-slate-200">Exámenes programados y realizados</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Fecha</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Grados</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Inscritos</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Estado</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase w-24">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {examenes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    No hay exámenes. Crea uno con el botón &quot;Nuevo examen&quot;.
                  </td>
                </tr>
              ) : (
                examenes.map((ex) => (
                  <tr key={ex.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-medium text-slate-900">{ex.fecha}</td>
                    <td className="px-4 py-3 text-slate-700">{ex.grados}</td>
                    <td className="px-4 py-3 text-slate-700">{ex.inscritos}</td>
                    <td className="px-4 py-3">
                      <span className={ex.estado === 'Programado' ? 'text-primary-600 font-medium' : 'text-emerald-600 font-medium'}>
                        {ex.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button type="button" className="text-sm text-primary-600 hover:underline">Ver</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Nuevo examen de grados</h3>
            <form onSubmit={handleCrear} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
                <input
                  type="date"
                  value={form.fecha}
                  onChange={(e) => setForm((p) => ({ ...p, fecha: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Grados a evaluar</label>
                <div className="flex flex-wrap gap-2">
                  {gradosOpciones.map((g) => (
                    <label key={g.id_grado} className="inline-flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        checked={form.grados.includes(g.nombre_grado)}
                        onChange={() => toggleGrado(g.nombre_grado)}
                        className="rounded border-slate-300 text-primary-600"
                      />
                      <span className="text-sm text-slate-700">{g.nombre_grado}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Lugar</label>
                <input
                  type="text"
                  value={form.lugar}
                  onChange={(e) => setForm((p) => ({ ...p, lugar: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900"
                  placeholder="Dojo principal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Observaciones</label>
                <textarea
                  value={form.observaciones}
                  onChange={(e) => setForm((p) => ({ ...p, observaciones: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900"
                  placeholder="Opcional"
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
                  className="flex-1 px-4 py-2.5 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700"
                >
                  Programar examen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
