# ============================================================================
# Stage 1: Builder - Build the application
# ============================================================================
FROM node:21-bookworm AS builder

WORKDIR /app

# Install system dependencies needed for build
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    pkg-config \
    libcairo2-dev \
    libjpeg-dev \
    libpango1.0-dev \
    libgif-dev \
    libpixman-1-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Bun for package management
RUN npm install -g bun

# Copy dependency files
COPY package.json bun.lock ./

# Install dependencies with bun
RUN bun install --frozen

# Copy application source code
COPY . .

# Build the application
RUN bun run build

# ============================================================================
# Stage 2: Runtime - Lightweight production image
# ============================================================================
FROM oven/bun:1.1.29-debian

WORKDIR /app

# Install only runtime dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user for security
RUN groupadd -g 1001 nodejs && \
    useradd -m -s /sbin/nologin -u 1001 -g nodejs nuxtjs

# Copy built application from builder
COPY --from=builder --chown=nuxtjs:nodejs /app/.output ./.output
COPY --from=builder --chown=nuxtjs:nodejs /app/public ./public
COPY --from=builder --chown=nuxtjs:nodejs /app/package.json ./package.json

# Switch to non-root user
USER nuxtjs

# Expose port
EXPOSE 3000

# Environment variables
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000

# Start the application
CMD ["bun", "run", "start"]
