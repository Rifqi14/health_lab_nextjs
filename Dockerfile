# 1. Install dependencies only when needed
FROM node:16-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm config set registry http://registry.npmjs.org/
RUN npm install

# 2. Rebuild the source code only when needed
FROM node:16-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# This will do the trick, use the corresponding env file for each environment.
COPY .env .env.production
# ENV NEXT_PUBLIC_API_URL https://api-corp-hc-services.bumame.com
RUN npm run build

# 3. Production image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 housecallgroup
RUN adduser --system --uid 1001 housecall

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=housecall:housecallgroup /app/.next/standalone ./
COPY --from=builder --chown=housecall:housecallgroup /app/.next/static ./.next/static

USER housecall

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]