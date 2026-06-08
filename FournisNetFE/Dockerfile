# ── Build stage ──────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --quiet
COPY . .
RUN npx ng build --configuration production

# ── Serve with nginx ──────────────────────────────────────
FROM nginx:alpine
COPY --from=builder /app/dist/fournisnet-front /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
