FROM dragonsgamers/playwright-alpine:bun

WORKDIR /app

# Install bun via npm to ensure compatibility on Alpine
COPY --chown=node package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY --chown=node . .
RUN bun run build

CMD [ "bun", "dist/index.js" ]
