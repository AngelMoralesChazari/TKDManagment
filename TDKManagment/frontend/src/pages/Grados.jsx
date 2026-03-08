const gradosPlaceholder = [
  { orden: 1, nombre: 'Blanca', color: 'bg-white border border-slate-200', alumnos: 28 },
  { orden: 2, nombre: 'Naranja', color: 'bg-orange-500', alumnos: 24 },
  { orden: 3, nombre: 'Amarilla', color: 'bg-yellow-400', alumnos: 22 },
  { orden: 4, nombre: 'Verde', color: 'bg-green-500', alumnos: 18 },
  { orden: 5, nombre: 'Azul', color: 'bg-blue-600', alumnos: 14 },
  { orden: 6, nombre: 'Roja', color: 'bg-red-600', alumnos: 8 },
  { orden: 7, nombre: 'Poom', color: 'bg-slate-700', alumnos: 5 },
  { orden: 8, nombre: 'Negra', color: 'bg-slate-900', alumnos: 4 },
]

export default function Grados() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Grados</h2>
        <p className="text-slate-600 mt-0.5">Cintas y distribución de alumnos</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {gradosPlaceholder.map((g) => (
          <div
            key={g.orden}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
          >
            <div className={`w-14 h-14 rounded-full shrink-0 ${g.color} ring-2 ring-slate-200`} />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-900">Cinta {g.nombre}</p>
              <p className="text-sm text-slate-500">{g.alumnos} alumnos</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-4">Próximo examen de grados</h3>
        <p className="text-slate-600 text-sm">
          Fecha prevista: <strong>15 de marzo de 2025</strong>. Los alumnos en Cinta Blanca y Amarilla están habilitados.
        </p>
      </div>
    </div>
  )
}
