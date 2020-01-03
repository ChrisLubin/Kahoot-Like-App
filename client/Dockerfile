# Builder
FROM mhart/alpine-node:latest AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
# RUN ls -lhS

# Runtime
# FROM mhart/alpine-node:latest AS runtime
# WORKDIR /app
# COPY --from=builder /app/package.json .
# COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/node_modules ./node_modules

EXPOSE 4200

CMD ["npm", "run", "start"]
