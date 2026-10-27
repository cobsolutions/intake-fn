# Static Angular build served by nginx. Multi-arch (the staging host is arm64):
# the build stage runs wherever the image is built, the runtime stage is plain
# nginx:alpine + files. The API is NOT proxied here — the host's reverse proxy
# (Caddy on the shared staging host, Netlify _redirects in production) sends
# /intake-service/api/* to the backend on the same origin.
FROM node:16-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npx ng build --configuration production

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/intake-fn/ /usr/share/nginx/html/
EXPOSE 80
