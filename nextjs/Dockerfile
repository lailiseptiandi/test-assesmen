# ------------------------------------
# STAGE 1: Build Phase
# ------------------------------------
FROM node:20-alpine AS builder

# Set up working directory
WORKDIR /app

# Copy lockfiles and package.json first to leverage Docker cache
COPY package.json package-lock.json ./
RUN npm install

# Copy source code
COPY . .

# Build the Next.js application
# Note: Next.js reads environment variables at build time,
# but NEXT_PUBLIC_API_URL is available from docker-compose
RUN npm run build


# ------------------------------------
# STAGE 2: Production Run Phase
# ------------------------------------
FROM node:20-alpine AS runner

# Set environment
ENV NODE_ENV production
# Set working directory
WORKDIR /app

# Only copy necessary files from the build stage
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose the port
EXPOSE 3000

# Set the start command
CMD ["npm", "start"]
