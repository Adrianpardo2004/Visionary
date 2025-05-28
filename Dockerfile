FROM node:18

WORKDIR /app

COPY Back-end/package*.json ./
RUN npm install

COPY Back-end/ .
COPY Front-end/ ./Front-end/


EXPOSE 3000
CMD ["node", "server.js"]
