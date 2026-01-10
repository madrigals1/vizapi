FROM ghcr.io/puppeteer/puppeteer:latest

ENV IS_DOCKER true

WORKDIR /usr/src/app

ADD package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 3000
