FROM node:18

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia solo los archivos necesarios del backend
COPY back-end/package*.json ./ 

# Instala dependencias
RUN npm install

# Copia todo el backend
COPY back-end/ .

# Expone el puerto
EXPOSE 3000

# Comando para iniciar tu servidor
CMD ["node", "server.js"]
