FROM node:18

WORKDIR /app

# Copiar e instalar dependencias del backend
COPY Back-end/package*.json ./Back-end/
RUN cd Back-end && npm install

# Copiar backend y frontend
COPY Back-end/ ./Back-end/
COPY Front-end/public/ ./Front-end/public/

# Exponer el puerto del backend
EXPOSE 3000

# Ejecutar el servidor
CMD ["node", "Back-end/server.js"]
