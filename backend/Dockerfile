FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --silent || yarn install --silent || true

COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

EXPOSE 4000

CMD ["sh", "-c", "npx prisma generate && npm run dev"]


