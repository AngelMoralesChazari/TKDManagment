FROM node:20-alpine

WORKDIR /app

# Instalar dependencias primero (mejor cache)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copiar el resto del backend
COPY . .

ENV NODE_ENV=production

# Railway inyecta PORT; tu server.js lo usa
EXPOSE 3001

CMD ["npm", "start"]

