# Используем Node.js для сборки React
FROM node:20-alpine AS build

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package.json package-lock.json ./
RUN npm install

# Копируем остальные файлы и собираем React
COPY . .
RUN npm run
