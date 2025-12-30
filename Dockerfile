FROM node:lts-alpine as Build

Workdir /app

COPY package*.json ./

RUN npm ci --dev=omit

COPY src/ ./src/
COPY scripts/ ./scripts/
COPY styles/ ./styles/
COPY templates/ ./templates/
COPY skills.json index.html ./


FROM nginx:alpine
Workdir /usr/share/nginx/html

COPY --from=Build /app /usr/share/nginx/html
