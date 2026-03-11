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
  res.json({
    ok: true,
    message: 'API TDK Management',
    // Para verificar rápidamente que Railway redeployó el último build
    version:
      process.env.RAILWAY_GIT_COMMIT_SHA ||
      process.env.VERCEL_GIT_COMMIT_SHA ||
      process.env.GIT_COMMIT ||
      new Date().toISOString(),
    dbHost: (() => {
      try {
        const u = new URL(process.env.DATABASE_URL || '')
        return u.host
      } catch {
        return null
      }
    })(),
  })
})

export default app
