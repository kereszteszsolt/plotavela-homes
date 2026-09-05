FROM node:24.20.0-bookworm-slim AS node

FROM node AS frontend-build
WORKDIR /build
COPY frontend/package*.json ./
RUN npm ci --no-audit --no-fund
COPY frontend/public ./public
COPY frontend/src ./src
RUN npm run build

FROM node AS backend-dependencies
WORKDIR /build
COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund

FROM mongo:8.0.29-noble AS mongodb
RUN chown 10001:10001 /data/db /data/configdb
USER 10001:10001
CMD ["sh", "-c", "mkdir -p /data/db/mongo && exec mongod --dbpath /data/db/mongo --bind_ip_all --nounixsocket --wiredTigerCacheSizeGB 0.25"]
HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=6 \
  CMD mongosh --quiet --eval 'quit(db.adminCommand({ping:1}).ok ? 0 : 1)'

FROM node AS be
WORKDIR /app
COPY --from=backend-dependencies /build/node_modules ./node_modules
COPY package.json LICENSE ./
COPY backend ./backend
COPY docker/start.mjs docker/healthcheck.mjs ./docker/
RUN mkdir -p /data && chown 10001:10001 /data && ln -s /data/uploads /app/uploads
ENV NODE_ENV=production PORT=5000 MONGO_URI=mongodb://mongodb:27017/plotavela SERVE_FRONTEND=false
USER 10001:10001
EXPOSE 5000
HEALTHCHECK --interval=10s --timeout=10s --start-period=30s --retries=6 \
  CMD ["node", "docker/healthcheck.mjs"]
CMD ["node", "docker/start.mjs"]

FROM nginx:1.30.4-alpine AS fe
COPY --from=frontend-build /build/build /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=6 \
  CMD wget -q -O /dev/null http://127.0.0.1/ && wget -q -O /dev/null http://127.0.0.1/api/properties
