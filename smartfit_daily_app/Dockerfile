FROM node:20-alpine
WORKDIR /app

# Copy just the manifests first so `npm ci` is cached in its own Docker layer
# — only re-runs when a package.json/lockfile actually changes, not on every
# source edit.
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json
COPY apps/mobile/package.json apps/mobile/package.json
COPY packages/shared-types/package.json packages/shared-types/package.json
RUN npm ci

COPY . .
RUN npm run build --workspace apps/web

ENV NODE_ENV=production
WORKDIR /app/apps/web
CMD ["node", "dist-server/index.js"]
