import { useState, useEffect } from 'react'
import { API_GRADOS, API_ALUMNOS } from '../api.js'

function colorClase(nombre) {
  if (!nombre) return 'bg-slate-400'
  const n = nombre.toLowerCase()
  if (n.includes('blanca')) return 'bg-white border border-slate-200'
  if (n.includes('naranja')) return 'bg-orange-500'
  if (n.includes('amarilla')) return 'bg-yellow-400'
  if (n.includes('verde')) return 'bg-green-500'
  if (n.includes('azul')) return 'bg-blue-600'
  if (n.includes('roja')) return 'bg-red-600'
  if (n.includes('poom')) return 'poom'
  if (n.includes('negra')) return 'bg-slate-900'
  return 'bg-slate-500'
}

function gradoBase(nombre) {
  if (!nombre) return null
  const n = nombre.toLowerCase()
  if (n.includes('blanca')) return 'Blanca'
  if (n.includes('naranja')) return 'Naranja'
  if (n.includes('amarilla')) return 'Amarilla'
  if (n.includes('verde')) return 'Verde'
  if (n.includes('azul')) return 'Azul'
  if (n.includes('roja')) return 'Roja'
  if (n.includes('poom')) return 'Poom'
  if (n.includes('negra')) return 'Negra'
  return null
}

function esGradoBase(nombre) {
  if (!nombre) return false
  const n = nombre.toLowerCase()
  if (n.includes('blanca')) return true
  if (n.includes('naranja') && !n.includes('avanz')) return true
  if (n.includes('amarilla') && !n.includes('avanz')) return true
  if (n.includes('verde') && !n.includes('avanz')) return true
  if (n.includes('azul') && !n.includes('avanz')) return true
  if (n.includes('roja') && !n.includes('avanz')) return true
  if (n.includes('1er poom')) return true
  if (n.includes('1er dan')) return true
  return false
}

export default function Grados() {
  const [grados, setGrados] = useState([])
  const [alumnos, setAlumnos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [cargandoAlumnos, setCargandoAlumnos] = useState(true)
  const [errorAlumnos, setErrorAlumnos] = useState(null)
  const [seleccionBase, setSeleccionBase] = useState(null)
  const [filtroTipo, setFiltroTipo] = useState('base') // 'base' | 'avanzado'
  const [vista, setVista] = useState('resumen') // 'resumen' | 'detalle'

  useEffect(() => {
    let ok = true
    fetch(API_GRADOS)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (ok) setGrados(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        if (ok) setGrados([])
      })
      .finally(() => {
        if (ok) setCargando(false)
      })

    fetch(API_ALUMNOS)
      .then(async (res) => {
        if (!res.ok) throw new Error('Error al cargar alumnos')
        return res.json()
      })
      .then((data) => {
        if (ok) setAlumnos(Array.isArray(data) ? data : [])
      })
      .catch((e) => {
        if (ok) {
          setAlumnos([])
          setErrorAlumnos(e.message || 'No se pudieron cargar los alumnos')
        }
      })
      .finally(() => {
        if (ok) setCargandoAlumnos(false)
      })

    return () => { ok = false }
  }, [])

  const gruposBase = grados.reduce((acc, g) => {
    const base = gradoBase(g.nombre_grado)
    if (!base) return acc
    const tipo = esGradoBase(g.nombre_grado) ? 'base' : 'avanzado'
    if (!acc[base]) acc[base] = { base, gradosBase: [], gradosAvanzados: [] }
    if (tipo === 'base') {
      acc[base].gradosBase.push(g)
    } else {
      acc[base].gradosAvanzados.push(g)
    }
    return acc
  }, {})

  const basesOrden = ['Blanca', 'Naranja', 'Amarilla', 'Verde', 'Azul', 'Roja', 'Poom', 'Negra']
  const listaBases = basesOrden
    .map((b) => gruposBase[b])
    .filter(Boolean)

  const alumnosFiltrados = (() => {
    if (!seleccionBase) return []
    const grupo = gruposBase[seleccionBase]
    if (!grupo) return []
    const nombresBase = grupo.gradosBase.map((g) => g.nombre_grado)
    const nombresAvanz = grupo.gradosAvanzados.map((g) => g.nombre_grado)
    return alumnos.filter((a) => {
      const gNombre = a.grado
      const base = gradoBase(gNombre)
      if (base !== seleccionBase) return false
      if (filtroTipo === 'base') {
        return nombresBase.includes(gNombre)
      }
      return nombresAvanz.includes(gNombre) || (!esGradoBase(gNombre) && base === seleccionBase)
    })
  })()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Grados</h2>
          <p className="text-slate-600 mt-0.5">Cintas y distribución de alumnos</p>
        </div>
        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
          <button
            type="button"
            onClick={() => setVista('resumen')}
            className={`px-3 py-1.5 text-sm rounded-md ${
              vista === 'resumen'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Resumen de grados
          </button>
          <button
            type="button"
            onClick={() => setVista('detalle')}
            className={`px-3 py-1.5 text-sm rounded-md ${
              vista === 'detalle'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Alumnos por grado
          </button>
        </div>
      </div>

      {vista === 'resumen' && (
        <>
          {cargando ? (
            <p className="text-slate-500">Cargando grados...</p>
          ) : listaBases.length === 0 ? (
            <p className="text-slate-500">No hay grados cargados. Ejecuta seed-grados.sql en pgAdmin.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {listaBases.map((grupo) => {
                const baseNombre = grupo.base
                const color = colorClase(baseNombre)
                const totalBase = alumnos.filter((a) => gradoBase(a.grado) === baseNombre).length
                return (
                  <div
                    key={baseNombre}
                    onClick={() => {
                      setSeleccionBase(baseNombre)
                      setFiltroTipo('base')
                      setVista('detalle')
                    }}
                    className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 cursor-pointer"
                  >
                    {color === 'poom' ? (
                      <div className="w-14 h-14 rounded-full shrink-0 overflow-hidden flex ring-2 ring-slate-200">
                        <div className="w-1/2 h-full bg-red-600" />
                        <div className="w-1/2 h-full bg-slate-900" />
                      </div>
                    ) : (
                      <div className={`w-14 h-14 rounded-full shrink-0 ${color} ring-2 ring-slate-200`} />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900">Cinta {baseNombre}</p>
                      <p className="text-sm text-slate-500">
                        {cargandoAlumnos ? 'Contando alumnos...' : `${totalBase} alumno${totalBase === 1 ? '' : 's'}`}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-4">Próximo examen de grados</h3>
            <p className="text-slate-600 text-sm">
              Programa exámenes en la sección Exámenes. La fecha y los grados habilitados se mostrarán aquí.
            </p>
          </div>
        </>
      )}

      {vista === 'detalle' && seleccionBase && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="font-semibold text-slate-900">
                Alumnos en {seleccionBase}
              </h3>
              <p className="text-sm text-slate-600">
                Filtra entre grado y grados avanzados.
              </p>
            </div>
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
              <button
                type="button"
                onClick={() => setFiltroTipo('base')}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  filtroTipo === 'base'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Principiantes
              </button>
              <button
                type="button"
                onClick={() => setFiltroTipo('avanzado')}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  filtroTipo === 'avanzado'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Avanzadas
              </button>
            </div>
          </div>
          {errorAlumnos && (
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              {errorAlumnos}
            </p>
          )}
          {cargandoAlumnos ? (
            <p className="text-slate-500 text-sm">Cargando alumnos...</p>
          ) : alumnosFiltrados.length === 0 ? (
            <p className="text-slate-500 text-sm">
              No hay alumnos en estos grados ({filtroTipo === 'base' ? 'principiantes' : 'avanzadas'}).
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-3 py-2 font-semibold text-slate-600">Nombre</th>
                    <th className="px-3 py-2 font-semibold text-slate-600">Grado</th>
                    <th className="px-3 py-2 font-semibold text-slate-600">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {alumnosFiltrados.map((a) => (
                    <tr key={a.id} className="border-b border-slate-100">
                      <td className="px-3 py-2 text-slate-900">{a.nombre}</td>
                      <td className="px-3 py-2 text-slate-700">{a.grado}</td>
                      <td className="px-3 py-2 text-slate-700">{a.estado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-4">Próximo examen de grados</h3>
        <p className="text-slate-600 text-sm">Programa exámenes en la sección Exámenes. La fecha y los grados habilitados se mostrarán aquí.</p>
      </div>
    </div>
  )
}
