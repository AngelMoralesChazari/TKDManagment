const colorBar = { emerald: 'bg-emerald-500', amber: 'bg-amber-500', red: 'bg-red-500' }

const resumenInicial = [
  { label: 'Al corriente', total: '0', color: 'emerald' },
  { label: 'Pendiente', total: '0', color: 'amber' },
  { label: 'Vencido', total: '0', color: 'red' },
]

export default function Cobranza() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Cobranza</h2>
        <p className="text-slate-600 mt-0.5">Estado de colegiatura y pagos</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {resumenInicial.map(({ label, total, color }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{total}</p>
            <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div className={`h-full rounded-full ${colorBar[color]}`} style={{ width: '0%' }} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <h3 className="px-5 py-4 font-semibold text-slate-900 border-b border-slate-200">Últimos movimientos</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Alumno / Tutor</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Concepto</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Monto</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  No hay movimientos registrados. Los pagos y colegiaturas se mostrarán aquí.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
