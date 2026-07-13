FROM node:20-bookworm-slim

# System deps: Python + toolchain for native modules (better-sqlite3, pyswisseph)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-venv python3-dev build-essential ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Python engine deps into an isolated venv. PYTHON_BIN points the Node bridges
# (services/astrology_kerykeion_bridge.js, services/varshaphal.js) at this venv.
COPY requirements.txt ./
RUN python3 -m venv /opt/venv \
    && /opt/venv/bin/pip install --no-cache-dir -r requirements.txt
ENV PYTHON_BIN=/opt/venv/bin/python

# Node deps (production only; jest is dev-only)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# App source (respects .dockerignore)
COPY . .

ENV NODE_ENV=production
ENV ASTROLOGY_ENGINE=kerykeion
# PORT is provided by the host (Render injects it); server.js reads process.env.PORT.
EXPOSE 3000
CMD ["node", "server.js"]
