FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./

RUN npm install

COPY . .

RUN rm -f .env

RUN npx nx build payments-service

EXPOSE 3003

CMD ["node", "dist/apps/payments-service/main.js"]
