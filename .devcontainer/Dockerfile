FROM mcr.microsoft.com/devcontainers/typescript-node:1-22-bookworm

# Install system dependencies for sharp and chromium for chrome-devtools MCP
RUN apt-get update && apt-get install -y \
    libvips-dev \
    chromium \
    chromium-driver \
    && rm -rf /var/lib/apt/lists/*

# Create chrome wrapper for chrome-devtools MCP with --no-sandbox flag
RUN mkdir -p /opt/google/chrome && \
    printf '#!/bin/bash\nexec /usr/bin/chromium --no-sandbox "$@"\n' > /opt/google/chrome/chrome-wrapper

# Set permissions and create symlink
RUN chmod +x /opt/google/chrome/chrome-wrapper && \
    ln -sf /opt/google/chrome/chrome-wrapper /opt/google/chrome/chrome

# Install Claude CLI globally
RUN npm install -g @anthropic-ai/claude-code
