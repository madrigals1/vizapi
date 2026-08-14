FROM node:20-slim

ENV IS_DOCKER true
ENV PORT 3122

RUN apt-get update && apt-get install -y --no-install-recommends \
    fonts-dejavu-core \
    fonts-noto-color-emoji \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

ADD package.json package-lock.json ./
RUN npm ci && npx playwright install --with-deps chromium && npm cache clean --force

COPY . .

EXPOSE ${PORT}
