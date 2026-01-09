# Base image with Node.js & pnpm
FROM node:23.8-alpine AS base
RUN apk update && apk add --no-cache gcompat
RUN npm install -g pnpm

# Install dependencies and build
FROM base AS installer
WORKDIR /src
COPY package.json pnpm-lock.yaml tsconfig.json ./
COPY src ./src
RUN pnpm install --frozen-lockfile
RUN pnpm run build

# Runner stage
FROM base AS runner
WORKDIR /src

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 -G nodejs hono

# Copy entrypoint script and make it executable
COPY --chown=hono:nodejs entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Copy only what's needed to run
COPY --chown=hono:nodejs --from=installer /src/node_modules ./node_modules
COPY --chown=hono:nodejs --from=installer /src/build ./build
COPY --chown=hono:nodejs --from=installer /src/package.json ./package.json
COPY --chown=hono:nodejs --from=installer /src/pnpm-lock.yaml ./pnpm-lock.yaml

ENV PORT=8001
EXPOSE 8001

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["node", "build/index.js"]
