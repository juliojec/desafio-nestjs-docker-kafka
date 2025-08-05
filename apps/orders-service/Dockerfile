FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./

RUN npm install

COPY . .

RUN rm -f .env

RUN npx nx build orders-service

EXPOSE 3001

CMD ["node", "dist/apps/orders-service/main.js"]
