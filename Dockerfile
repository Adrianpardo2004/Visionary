FROM node:18
WORKDIR /app
COPY package*.json ./
RUN node server.js
COPY . .
EXPOSE 3000
CMD ["node", "start"]
