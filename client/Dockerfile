# Builder
FROM mhart/alpine-node:latest AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm build
RUN ls -lhS

# Runtime
FROM mhart/alpine-node:latest AS runtime
WORKDIR /app
COPY --from=builder ./app/package.json .
COPY --from=builder ./dist ./dist

EXPOSE 4200

CMD ["npm", "start"]
