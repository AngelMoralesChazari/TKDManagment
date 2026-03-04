const resumenPlaceholder = [
  { label: 'Al corriente', valor: 18, total: '18', color: 'emerald' },
  { label: 'Pendiente', valor: 6, total: '6', color: 'amber' },
  { label: 'Vencido', valor: 8, total: '8', color: 'red' },
]

const colorBar = { emerald: 'bg-emerald-500', amber: 'bg-amber-500', red: 'bg-red-500' }

export default function Cobranza() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Cobranza</h2>
        <p className="text-slate-600 mt-0.5">Estado de colegiatura y pagos</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {resumenPlaceholder.map(({ label, total, color }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{total}</p>
            <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full rounded-full ${colorBar[color]}`}
                style={{ width: label === 'Al corriente' ? '79%' : label === 'Pendiente' ? '15%' : '6%' }}
              />
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
              {[
                { alumno: 'Familia López', concepto: 'Colegiatura Mar 2025', monto: '$ 1,200', estado: 'Pagado' },
                { alumno: 'Ana Martínez', concepto: 'Colegiatura Mar 2025', monto: '$ 800', estado: 'Pagado' },
                { alumno: 'Carlos Ruiz', concepto: 'Colegiatura Mar 2025', monto: '$ 800', estado: 'Pendiente' },
                { alumno: 'Luis Hernández', concepto: 'Colegiatura Mar 2025', monto: '$ 800', estado: 'Pagado' },
                { alumno: 'Familia García', concepto: 'Colegiatura Mar 2025', monto: '$ 1,500', estado: 'Pagado' },
                { alumno: 'Sofía Castro', concepto: 'Colegiatura Mar 2025', monto: '$ 800', estado: 'Vencido' },
                { alumno: 'Mateo Sánchez', concepto: 'Colegiatura Mar 2025', monto: '$ 1,000', estado: 'Pagado' },
                { alumno: 'Elena Flores', concepto: 'Colegiatura Mar 2025', monto: '$ 800', estado: 'Pendiente' },
                { alumno: 'Familia Mendoza', concepto: 'Colegiatura Mar 2025', monto: '$ 1,200', estado: 'Pagado' },
                { alumno: 'Javier Ortiz', concepto: 'Colegiatura Mar 2025', monto: '$ 800', estado: 'Pagado' },
                { alumno: 'Lucía Méndez', concepto: 'Colegiatura Mar 2025', monto: '$ 1,000', estado: 'Pendiente' },
                { alumno: 'Diego Ramírez', concepto: 'Colegiatura Mar 2025', monto: '$ 800', estado: 'Pagado' },
                { alumno: 'Valentina Rojas', concepto: 'Colegiatura Mar 2025', monto: '$ 800', estado: 'Vencido' }
              ].map((row, i) => (
                <tr key={i} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-medium text-slate-900">{row.alumno}</td>
                  <td className="px-4 py-3 text-slate-700">{row.concepto}</td>
                  <td className="px-4 py-3 text-slate-700">{row.monto}</td>
                  <td className="px-4 py-3">
                    <span className={row.estado === 'Pagado' ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}>
                      {row.estado}
                    </span>
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
