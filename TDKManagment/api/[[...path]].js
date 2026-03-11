// Catch-all: todas las peticiones a /api/* pasan por aquí y las atiende Express (tu backend).
import app from '../backend/app.js'

export default function handler(req, res) {
  return app(req, res)
}
