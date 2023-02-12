FROM dragonsgamers/playwright-alpine:18

WORKDIR /app

COPY --chown=node package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

CMD [ "node", "dist/index.js" ]
