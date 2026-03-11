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

app.use(cors())
app.use(express.json())

app.use('/api/alumnos', alumnosRouter)
app.use('/api/grados', gradosRouter)

app.get('/api/health', (_, res) => {
  res.json({ ok: true, message: 'API TDK Management' })
})

export default app
