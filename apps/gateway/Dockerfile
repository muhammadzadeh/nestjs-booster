FROM node:20-alpine AS base

FROM base AS builder
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app

RUN npm install -g turbo

COPY . .

RUN turbo prune --scope=gateway --docker


FROM base AS installer
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app

COPY --from=builder /app/out/json/ .

RUN npm ci --production

COPY --from=builder /app/out/full/ .

RUN npm install turbo

RUN npx turbo build --filter=gateway...

FROM gcr.io/distroless/nodejs20-debian12 AS runner
WORKDIR /app

COPY --from=installer /app/apps/gateway/deployments/config.yml ./config.yml
COPY --from=installer /app/apps/gateway/dist/ ./dist/
COPY --from=installer /app/node_modules/ ./node_modules/

CMD ["dist/main.js"]

EXPOSE 80