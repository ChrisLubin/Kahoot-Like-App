# Builder
FROM mhart/alpine-node:latest AS builder
WORKDIR /app
COPY . .
RUN yarn install
# RUN yarn build
RUN ls -lhS

# Runner
# FROM mhart/alpine-node:latest AS runtime
# WORKDIR /app
# COPY --from=builder ./app/package.json .
# COPY --from=builder ./app/node_modules ./node_modules

EXPOSE 8080

CMD ["npm", "run", "start"]
