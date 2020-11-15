FROM node:12-alpine

RUN apk add chromium

WORKDIR /usr/src/app

COPY . .
RUN npm ci

EXPOSE 8000
