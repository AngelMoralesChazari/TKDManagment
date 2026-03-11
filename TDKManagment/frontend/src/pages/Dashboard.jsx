export default function Dashboard() {
  const stats = [
    { label: 'Alumnos activos', value: '—', sub: 'Se actualiza con los datos registrados', color: 'primary' },
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
          <h3 className="font-semibold text-slate-900 mb-4">Actividad reciente</h3>
          <p className="text-slate-500 text-sm">No hay actividad reciente. Los registros de alumnos, pagos y exámenes se mostrarán aquí.</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-4">Próximos eventos</h3>
          <p className="text-slate-500 text-sm">No hay eventos programados. Crea exámenes en la sección Exámenes para verlos aquí.</p>
        </div>
      </div>
    </div>
  )
}
