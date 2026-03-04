export default function Configuracion() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Configuración</h2>
        <p className="text-slate-600 mt-0.5">Ajustes de la escuela y del sistema</p>
      </div>

      <div className="grid gap-4 max-w-2xl">
        {[
          { title: 'Datos de la escuela', desc: 'Nombre, dirección y contacto' },
          { title: 'Costos y colegiaturas', desc: 'Montos por grado y periodicidad' },
          { title: 'Usuarios y permisos', desc: 'Accesos al panel de administración' },
          { title: 'Notificaciones', desc: 'Recordatorios de pago y exámenes' },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between"
          >
            <div>
              <p className="font-semibold text-slate-900">{item.title}</p>
              <p className="text-sm text-slate-500 mt-0.5">{item.desc}</p>
            </div>
            <span className="text-slate-400">→</span>
          </div>
        ))}
      </div>
    </div>
  )
}
