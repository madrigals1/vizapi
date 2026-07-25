FROM ghcr.io/puppeteer/puppeteer:24.0.0

ENV IS_DOCKER true
ENV PORT 3000
ENV PUPPETEER_CACHE_DIR=/usr/src/app/.cache/puppeteer

WORKDIR /usr/src/app

ADD package.json package-lock.json ./
RUN npm ci && npm cache clean --force

COPY . .

EXPOSE ${PORT}
