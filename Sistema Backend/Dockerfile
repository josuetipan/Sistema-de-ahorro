# ---- Base ----
FROM node:22-bookworm-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN corepack enable
WORKDIR /app

# ---- Build (instala todo + compila) ----
FROM base AS build
COPY package.json pnpm-lock.yaml prisma.config.ts ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# ---- Producción ----
FROM base AS production
ENV NODE_ENV=production
# Reutiliza node_modules del build (incluye prisma CLI para migrate deploy)
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json pnpm-lock.yaml prisma.config.ts ./
COPY prisma ./prisma

EXPOSE 3000
# Aplica migraciones y arranca la API
CMD ["pnpm", "start:prod:migrate"]
