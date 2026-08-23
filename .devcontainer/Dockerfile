FROM mcr.microsoft.com/devcontainers/javascript-node:24-trixie

ARG TZ
ENV TZ="$TZ"

ARG CLAUDE_CODE_VERSION=latest

# Keep in sync with the `playwright` devDependency in package.json — Playwright
# pins a browser build per release, so a drifting version re-downloads at runtime.
ARG PLAYWRIGHT_VERSION=1.62.0

# Install basic development tools.
# `chromium` also pulls in the shared libs Playwright's own browser build needs,
# which is why `playwright install-deps` is not required below.
RUN apt update && apt install -y less man-db sudo chromium libvips-dev

# Ensure default `node` user has access to `sudo`
ARG USERNAME=node
RUN echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

# Set `DEVCONTAINER` environment variable to help with orientation
ENV DEVCONTAINER=true

# Persist bash history.
RUN SNIPPET="export PROMPT_COMMAND='history -a' && export HISTFILE=/commandhistory/.bash_history" \
  && mkdir /commandhistory \
  && touch /commandhistory/.bash_history \
  && chown -R $USERNAME /commandhistory

# Create workspace and config directories and set permissions
RUN mkdir -p /workspace /home/node/.claude && \
  chown -R node:node /workspace /home/node/.claude

WORKDIR /workspace

# Set up non-root user
USER node

# Download Playwright's Chromium so Vitest browser mode (Storybook component
# tests) works on a fresh container. Must run as `node` so the browsers land in
# /home/node/.cache/ms-playwright, which is not a mounted volume.
RUN npx --yes playwright@${PLAYWRIGHT_VERSION} install chromium

# Set the default shell to zsh rather than sh
ENV SHELL=/bin/zsh
