FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./

RUN npm install

COPY . .

RUN npx nx build expedition-service

CMD ["node", "dist/apps/expedition-service/main.js"]