FROM ghcr.io/puppeteer/puppeteer:latest

ENV IS_DOCKER true
ENV PORT 3000

WORKDIR /usr/src/app

ADD package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE ${PORT}
