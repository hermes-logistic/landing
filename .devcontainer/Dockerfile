FROM mcr.microsoft.com/devcontainers/typescript-node:1-22-bookworm

# Install system dependencies for sharp, chromium, and xvfb for chrome-devtools MCP
RUN apt-get update && apt-get install -y \
    libvips-dev \
    chromium \
    chromium-driver \
    xvfb \
    x11-utils \
    && rm -rf /var/lib/apt/lists/*

# Create chrome wrapper for chrome-devtools MCP with --no-sandbox flag
RUN mkdir -p /opt/google/chrome && \
    printf '#!/bin/bash\nexec /usr/bin/chromium --no-sandbox "$@"\n' > /opt/google/chrome/chrome-wrapper

# Set permissions and create symlink
RUN chmod +x /opt/google/chrome/chrome-wrapper && \
    ln -sf /opt/google/chrome/chrome-wrapper /opt/google/chrome/chrome

# Install Claude CLI globally
RUN npm install -g @anthropic-ai/claude-code

# Create startup script for xvfb
RUN mkdir -p /etc/profile.d && \
    printf '#!/bin/bash\nif [ -z "$DISPLAY" ]; then\n  export DISPLAY=:99\n  Xvfb :99 -screen 0 1024x768x24 > /dev/null 2>&1 &\n  sleep 2\nfi\n' > /etc/profile.d/xvfb.sh && \
    chmod +x /etc/profile.d/xvfb.sh
