FROM oven/bun:1-alpine AS base
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

ENV CI=true

# Sentry token needed only during build for source map upload
RUN --mount=type=secret,id=sentry_auth_token,env=SENTRY_AUTH_TOKEN bun run build

FROM oven/bun:1-alpine AS release
WORKDIR /app

USER bun

COPY --from=base --chown=bun:bun /app/.next/standalone ./
COPY --from=base --chown=bun:bun /app/.next/static ./.next/static
COPY --from=base --chown=bun:bun /app/public ./public
COPY --from=base --chown=bun:bun /app/package.json ./package.json

EXPOSE 3000

CMD ["bun", "server.js"]
