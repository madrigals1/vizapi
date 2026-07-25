FROM ghcr.io/puppeteer/puppeteer:24.43.1

ENV IS_DOCKER true
ENV PORT 3000
ENV PUPPETEER_CACHE_DIR=/home/pptruser/.cache/puppeteer

WORKDIR /usr/src/app

ADD package.json package-lock.json ./
RUN npm ci && npm cache clean --force

COPY . .

EXPOSE ${PORT}
