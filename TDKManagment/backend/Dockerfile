FROM node:20-alpine

WORKDIR /app

# Instalar dependencias primero (mejor cache)
# Railway está usando el contexto en la raíz del repo, así que copiamos desde la ruta del backend
COPY TDKManagment/backend/package.json TDKManagment/backend/package-lock.json ./
RUN npm ci --omit=dev

# Copiar el resto del backend
COPY TDKManagment/backend ./

ENV NODE_ENV=production

# Railway inyecta PORT; tu server.js lo usa
EXPOSE 3001

CMD ["npm", "start"]

