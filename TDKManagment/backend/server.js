import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import app from './app.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '.env') })
dotenv.config({ path: path.join(__dirname, '..', '.env') })

const PORT = process.env.PORT || 3001

app.get('/', (_, res) => {
  res.json({
    message: 'API TDK Management',
    hint: 'Abre la app en http://localhost:5173 (frontend). No uses esta URL para la interfaz.',
    endpoints: { alumnos: '/api/alumnos', grados: '/api/grados' },
  })
})

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`)
})
