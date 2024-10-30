FROM node:22-alpine AS base

FROM base AS builder
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app

RUN npm install -g turbo

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN turbo prune --scope=gateway --docker


FROM base AS installer
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app

COPY --from=builder /app/out/json/ .

RUN npm ci

COPY --from=builder /app/out/full/ .

RUN npm install -g turbo

ENV NEXT_TELEMETRY_DISABLED=1

RUN turbo build --filter=gateway...

RUN npm prune --production

FROM gcr.io/distroless/nodejs22-debian12 AS runner
WORKDIR /app

COPY --from=installer /app/apps/gateway/config.vault.yml ./apps/gateway/config.yml
COPY --from=installer /app/apps/gateway/dist/ ./apps/gateway/dist/
COPY --from=installer /app/packages ./packages/
COPY --from=installer /app/node_modules/ ./node_modules/

CMD ["apps/gateway/dist/main.js"]

EXPOSE 80