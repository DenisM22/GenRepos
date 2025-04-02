# 1. Используем Node.js для сборки
FROM node:20-alpine AS builder

# 2. Устанавливаем рабочую директорию
WORKDIR /app

# 3. Копируем package.json и package-lock.json для установки зависимостей
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# 4. Копируем остальные файлы проекта
COPY . .

# 5. Собираем Next.js проект
RUN npm run build

# 6. Используем более легкий образ для продакшена
FROM node:20-alpine AS runner
WORKDIR /app

# 7. Копируем файлы из builder-образа
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next .next
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/public public

# 8. Запускаем Next.js в продакшен-режиме
CMD ["npm", "run", "start"]