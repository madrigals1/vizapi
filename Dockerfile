FROM ghcr.io/puppeteer/puppeteer:latest

ENV IS_DOCKER true
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/google-chrome-stable

WORKDIR /usr/src/app

ADD package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE ${PORT}
