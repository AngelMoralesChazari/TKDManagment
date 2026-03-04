import { useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', label: 'Inicio', icon: '⌂' },
  { to: '/alumnos', label: 'Alumnos', icon: '👥' },
  { to: '/grados', label: 'Grados', icon: '🥋' },
  { to: '/cobranza', label: 'Cobranza', icon: '💰' },
  { to: '/configuracion', label: 'Configuración', icon: '⚙' },
]

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex">
      {/* Overlay móvil */}
      <div
        className={`fixed inset-0 bg-black/40 z-30 lg:hidden transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white flex flex-col transform transition-transform duration-200 ease-out lg:transform-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <span className="font-bold text-lg tracking-tight">TDK Management</span>
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg hover:bg-slate-800"
            onClick={() => setSidebarOpen(false)}
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 transition-colors ${isActive ? 'bg-primary-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`
              }
            >
              <span className="text-xl" aria-hidden>{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-700 text-slate-500 text-sm">
          SUMBAE · v0.1
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-200 px-4 py-3 flex items-center gap-4">
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menú"
          >
            ☰
          </button>
          <h1 className="text-slate-800 font-semibold truncate">Panel de administración</h1>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
