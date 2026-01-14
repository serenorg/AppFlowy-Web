# ABOUTME: Multi-stage Dockerfile for AppFlowy Web UI
# ABOUTME: Builds static assets and serves via nginx

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Set build-time environment variables for AppFlowy
ARG APPFLOWY_BASE_URL=https://api-notes.serendb.com
ARG APPFLOWY_GOTRUE_BASE_URL=https://api-notes.serendb.com/gotrue
ENV APPFLOWY_BASE_URL=${APPFLOWY_BASE_URL}
ENV APPFLOWY_GOTRUE_BASE_URL=${APPFLOWY_GOTRUE_BASE_URL}

# Build the application
RUN pnpm build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration and entrypoint from builder
COPY --from=builder /app/docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Use entrypoint to inject runtime config into index.html
ENTRYPOINT ["/entrypoint.sh"]
