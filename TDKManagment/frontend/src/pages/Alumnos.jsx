const alumnosPlaceholder = [
  { id: 1, nombre: 'Ana Martínez', grado: 'Cinta Blanca', estado: 'Activo', ingreso: 'Ene 2025' },
  { id: 2, nombre: 'Carlos Ruiz', grado: 'Cinta Amarilla', estado: 'Activo', ingreso: 'Nov 2024' },
  { id: 3, nombre: 'María López', grado: 'Cinta Verde', estado: 'Activo', ingreso: 'Ago 2024' },
  { id: 4, nombre: 'Luis Hernández', grado: 'Cinta Azul', estado: 'Inactivo', ingreso: 'Mar 2024' },
  { id: 5, nombre: 'Sofía García', grado: 'Cinta Blanca', estado: 'Activo', ingreso: 'Feb 2025' },
  { id: 6, nombre: 'Diego Ramírez', grado: 'Cinta Roja', estado: 'Activo', ingreso: 'May 2023' },
  { id: 7, nombre: 'Valentina Rojas', grado: 'Cinta Negra', estado: 'Activo', ingreso: 'Ene 2022' },
  { id: 8, nombre: 'Javier Ortiz', grado: 'Cinta Amarilla', estado: 'Baja', ingreso: 'Oct 2024' },
  { id: 9, nombre: 'Lucía Méndez', grado: 'Cinta Verde', estado: 'Inactivo', ingreso: 'Jun 2024' },
  { id: 10, nombre: 'Mateo Sánchez', grado: 'Cinta Blanca', estado: 'Activo', ingreso: 'Mar 2025' },
  { id: 11, nombre: 'Elena Flores', grado: 'Cinta Azul', estado: 'Activo', ingreso: 'Dic 2023' },
  { id: 12, nombre: 'Ricardo Lara', grado: 'Cinta Roja', estado: 'Inactivo', ingreso: 'Jul 2023' },
  { id: 13, nombre: 'Fernanda Solís', grado: 'Cinta Amarilla', estado: 'Activo', ingreso: 'Sep 2024' },
  { id: 14, nombre: 'Gabriel Nava', grado: 'Cinta Negra', estado: 'Baja', ingreso: 'Feb 2022' },
  { id: 15, nombre: 'Ximena Duarte', grado: 'Cinta Blanca', estado: 'Activo', ingreso: 'Feb 2025' }
]

const estadoStyles = {
  Activo: 'bg-emerald-100 text-emerald-800',
  Inactivo: 'bg-amber-100 text-amber-800',
  Baja: 'bg-red-200 text-red-600',
}

export default function Alumnos() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Alumnos</h2>
          <p className="text-slate-600 mt-0.5">Expedientes y estado de los alumnos</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          + Nuevo alumno
        </button>
      </div>

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
              {alumnosPlaceholder.map((a) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
