# backend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Копируем manifest-файлы
COPY package*.json ./

# Используем npm install вместо ci (не требует package-lock.json)
RUN npm install --omit=dev

# Копируем исходники
COPY . .

EXPOSE 3000

# Устанавливаем tini для корректной обработки сигналов
RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server.cjs"]