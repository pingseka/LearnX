FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm config set registry https://registry.npmmirror.com && npm ci

COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:20-alpine

WORKDIR /app

RUN apk upgrade --no-cache libcrypto3 libssl3

RUN addgroup -g 101 -S appgroup && adduser -u 100 -S appuser -G appgroup

COPY --chown=appuser:appgroup --from=builder /app/dist ./dist
COPY --chown=appuser:appgroup --from=builder /app/node_modules ./node_modules
COPY --chown=appuser:appgroup --from=builder /app/package.json ./package.json
COPY --chown=appuser:appgroup --from=builder /app/scripts ./scripts
COPY --chown=appuser:appgroup --from=builder /app/sample-materials ./sample-materials

RUN npm uninstall -g npm

RUN mkdir -p /app/data /app/uploads \
    && chown appuser:appgroup /app/data /app/uploads

USER appuser

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD wget -qO- http://localhost:3001/health || exit 1

CMD ["node", "dist/app.js"]
