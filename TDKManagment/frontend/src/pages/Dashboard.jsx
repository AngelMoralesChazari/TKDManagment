export default function Dashboard() {
  const stats = [
    { label: 'Alumnos activos', value: '24', sub: '+8 este mes', color: 'primary' },
    { label: 'Pagos al corriente', value: '18', sub: '64.28% del total', color: 'emerald' },
    { label: 'Pendientes de pago', value: '6', sub: 'Revisar cobranza', color: 'amber' },
    { label: 'Exámenes este mes', value: '12', sub: 'Próximo: 15 Mar', color: 'slate' },
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
          <ul className="space-y-3">
            {[
              { text: 'Nuevo alumno registrado: Ana Martínez', time: 'Hace 2 h' },
              { text: 'Pago recibido — Familia López', time: 'Hace 5 h' },
              { text: 'Examen de cinta programado: 15 Mar', time: 'Ayer' },
              { text: 'Actualización de grado: Carlos Ruiz → Cinta Amarilla', time: 'Ayer' },
            ].map((item, i) => (
              <li key={i} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                <span className="text-slate-700 text-sm">{item.text}</span>
                <span className="text-slate-400 text-xs">{item.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-4">Próximos eventos</h3>
          <ul className="space-y-3">
            {[
              { title: 'Examen de grados', date: '15 Mar 2025', type: 'Examen' },
              { title: 'Clase especial infantil', date: '20 Mar 2025', type: 'Clase' },
              { title: 'Torneo interno', date: '28 Mar 2025', type: 'Evento' },
            ].map((event, i) => (
              <li key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                <div className="w-1 h-10 rounded-full bg-primary-500" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900">{event.title}</p>
                  <p className="text-sm text-slate-500">{event.date} · {event.type}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
