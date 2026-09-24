# The runner with a browser, for a server or a NAS where installing Chromium
# by hand is a chore. Build it from this checkout; nothing here is pulled at
# run time.
#
#   docker build -t orla-il-banks .
#   docker run --rm orla-il-banks check-browser
#   docker run --rm --env-file ~/.orla-il-banks.env orla-il-banks run

FROM node:22-bookworm-slim AS build
WORKDIR /src
COPY package.json npm-shrinkwrap.json tsconfig.json ./
# No install scripts: the one that matters would download a second browser.
RUN npm ci --ignore-scripts --no-fund --no-audit
COPY src ./src
RUN npm run build

FROM node:22-bookworm-slim
# Debian's Chromium, from the distribution's signed archive, instead of the
# build puppeteer would fetch at install time.
RUN apt-get update \
 && apt-get install -y --no-install-recommends chromium ca-certificates \
 && rm -rf /var/lib/apt/lists/*
ENV NODE_ENV=production \
    PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    ORLA_IL_NO_SANDBOX=1 \
    ORLA_IL_EPHEMERAL=1
WORKDIR /app
COPY package.json npm-shrinkwrap.json ./
RUN npm ci --omit=dev --ignore-scripts --no-fund --no-audit
COPY --from=build /src/dist ./dist
# Not root: the process that holds bank passwords gets no more than it needs.
USER node
ENTRYPOINT ["node", "/app/dist/cli.js"]
CMD ["--help"]
