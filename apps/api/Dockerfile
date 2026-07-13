# --- Stage 1: Build stage ---
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm package manager globally
RUN npm install -g pnpm@9

# Copy lockfile and monorepo workspace configurations
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/db/package.json ./packages/db/

# Copy workspace dependencies
COPY packages/db ./packages/db
COPY apps/api ./apps/api

# Install dependencies and build Prisma Client
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @smart-cart/db exec prisma generate

# Compile TypeScript sources
RUN pnpm --filter @smart-cart/api run build

# --- Stage 2: Runtime stage ---
FROM node:20-alpine AS runner

WORKDIR /app

RUN npm install -g pnpm@9

# Set execution context environment properties
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/package.json /app/pnpm-workspace.yaml /app/pnpm-lock.yaml ./
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/packages/db ./packages/db
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

EXPOSE 3000

CMD ["node", "apps/api/dist/main"]
