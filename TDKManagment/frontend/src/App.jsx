import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Alumnos from './pages/Alumnos'
import Grados from './pages/Grados'
import Cobranza from './pages/Cobranza'
import Examenes from './pages/Examenes'
import Configuracion from './pages/Configuracion'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="alumnos" element={<Alumnos />} />
        <Route path="grados" element={<Grados />} />
        <Route path="examenes" element={<Examenes />} />
        <Route path="cobranza" element={<Cobranza />} />
        <Route path="configuracion" element={<Configuracion />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
