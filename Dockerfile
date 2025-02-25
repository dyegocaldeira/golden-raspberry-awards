FROM node:22.14-alpine AS builder

WORKDIR /app

COPY package*.json /app

RUN npm ci

COPY . .

RUN npm run build

FROM builder AS runner

WORKDIR /app

COPY --from=builder /app/dist /app/dist

CMD ["npm", "run", "start:prod"]