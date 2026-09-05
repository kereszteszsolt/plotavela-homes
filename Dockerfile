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

# Use a fresh base so the Mongo image's two implicit volumes are not inherited.
FROM ubuntu:24.04
RUN apt-get update && apt-get install -y --no-install-recommends \
      ca-certificates libcurl4t64 libgssapi-krb5-2 libldap2 libsasl2-2 \
      libssl3t64 libstdc++6 tini \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /data /app \
    && chown 10001:10001 /data
COPY --from=node /usr/local/bin/node /usr/local/bin/node
COPY --from=node /usr/local/LICENSE /usr/local/share/node-LICENSE
COPY --from=mongodb /usr/bin/mongod /usr/bin/mongod
COPY --from=mongodb /usr/share/doc/mongodb-org-server /usr/share/doc/mongodb-org-server
WORKDIR /app
COPY --from=backend-dependencies /build/node_modules ./node_modules
COPY package.json LICENSE ./
COPY backend ./backend
COPY --from=frontend-build /build/build ./frontend/build
COPY docker ./docker
RUN ln -s /data/uploads /app/uploads
ENV NODE_ENV=production PORT=5000 MONGO_URI=mongodb://127.0.0.1:27017/plotavela
USER 10001:10001
VOLUME ["/data"]
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD ["node", "docker/healthcheck.mjs"]
ENTRYPOINT ["/usr/bin/tini", "--", "node", "docker/start.mjs"]
