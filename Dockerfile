# Etapa 1: Construcción del frontend
FROM node:18 AS build-frontend

WORKDIR /frontend
COPY Front-end/package*.json ./
RUN npm install
COPY Front-end/ ./
RUN npm run build

# Etapa 2: Backend con frontend ya construido
FROM node:18

WORKDIR /app

# Copiar solo el backend
COPY Back-end/package*.json ./
RUN npm install
COPY Back-end/ ./

# Copiar el frontend compilado al directorio público del backend
COPY --from=build-frontend /frontend/build ./public

EXPOSE 3000
CMD ["node", "server.js"]
