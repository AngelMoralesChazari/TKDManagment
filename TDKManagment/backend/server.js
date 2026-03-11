import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import alumnosRouter from './routes/alumnos.js'
import gradosRouter from './routes/grados.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '.env') })
dotenv.config({ path: path.join(__dirname, '..', '.env') })

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/api/alumnos', alumnosRouter)
app.use('/api/grados', gradosRouter)

// Para no ver "Cannot GET /" al abrir http://localhost:3001 en el navegador
app.get('/', (_, res) => {
  res.json({
    message: 'API TDK Management',
    hint: 'Abre la app en http://localhost:5173 (frontend). No uses esta URL para la interfaz.',
    endpoints: { alumnos: '/api/alumnos', grados: '/api/grados' },
  })
})

app.get('/api/health', (_, res) => {
  res.json({ ok: true, message: 'API TDK Management' })
})

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`)
})
