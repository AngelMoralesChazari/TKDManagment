import { useState } from 'react'

const examenesPlaceholder = [
  { id: 1, fecha: '15 Mar 2025', grados: 'Blanca, Naranja, Amarilla', inscritos: 12, estado: 'Programado' },
  { id: 2, fecha: '10 Ene 2025', grados: 'Verde, Azul', inscritos: 8, estado: 'Realizado' },
  { id: 3, fecha: '22 Nov 2024', grados: 'Blanca a Roja', inscritos: 18, estado: 'Realizado' },
  { id: 4, fecha: '28 Mar 2025', grados: 'Roja, Poom, Negra', inscritos: 0, estado: 'Programado' },
]

const GRADOS_OPCIONES = ['Blanca', 'Naranja', 'Amarilla', 'Verde', 'Azul', 'Roja', 'Poom', 'Negra']

export default function Examenes() {
  const [modalAbierto, setModalAbierto] = useState(false)
  const [form, setForm] = useState({
    fecha: '',
    lugar: 'Dojo principal',
    observaciones: '',
    grados: [],
  })

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
    // Simulado: solo cerramos el modal
    setModalAbierto(false)
    setForm({ fecha: '', lugar: 'Dojo principal', observaciones: '', grados: [] })
  }

  const estadoClase = (estado) => {
    if (estado === 'Programado') return 'text-primary-600 font-medium'
    if (estado === 'Realizado') return 'text-emerald-600 font-medium'
    return 'text-slate-500'
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
              {examenesPlaceholder.map((ex) => (
                <tr key={ex.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-medium text-slate-900">{ex.fecha}</td>
                  <td className="px-4 py-3 text-slate-700">{ex.grados}</td>
                  <td className="px-4 py-3 text-slate-700">{ex.inscritos}</td>
                  <td className="px-4 py-3">
                    <span className={estadoClase(ex.estado)}>{ex.estado}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      className="text-sm text-primary-600 hover:underline"
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nuevo examen (simulado) */}
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
                  {GRADOS_OPCIONES.map((g) => (
                    <label key={g} className="inline-flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        checked={form.grados.includes(g)}
                        onChange={() => toggleGrado(g)}
                        className="rounded border-slate-300 text-primary-600"
                      />
                      <span className="text-sm text-slate-700">{g}</span>
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
