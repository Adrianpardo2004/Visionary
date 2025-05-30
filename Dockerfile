FROM node:18

WORKDIR /app

# Copiar e instalar dependencias del backend
COPY Back-end/package*.json ./Back-end/
RUN cd Back-end && npm install

# Copiar backend completo
COPY Back-end/ ./Back-end/

# Copiar frontend manteniendo la estructura que espera el server
COPY Front-end/ ./Front-end/

# Exponer el puerto del backend
EXPOSE 3000

# Ejecutar el servidor
CMD ["node", "Back-end/server.js"]
