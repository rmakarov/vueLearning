# frontend/Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Vite в dev-режиме слушает все интерфейсы
EXPOSE 5173

# Важно: --host позволяет доступ извне контейнера
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]