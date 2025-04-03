# Stage 1: Build the SvelteKit app
FROM node:22.14-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY prisma/* ./
RUN npm i -g pnpm
RUN pnpm install
RUN npx prisma generate
COPY . .
RUN pnpm run build
RUN pnpm prune --prod

# Stage 2: Deploy the built app
FROM node:22.14-alpine AS deployer
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/package.json .
EXPOSE 3666
ENV NODE_ENV=production
CMD [ "pnpm", "start" ]