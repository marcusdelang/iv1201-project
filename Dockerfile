FROM node:10

WORKDIR /docker-app

COPY backend/package*.json backend/
COPY frontend/package*.json frontend/

RUN npm ci --prefix backend
RUN npm ci --prefix frontend

COPY . .

RUN npm run build --prefix frontend

EXPOSE 3000

CMD ["node", "backend/src/bin/www.js"]