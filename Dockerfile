FROM node:20-slim

ENV IS_DOCKER true
ENV PORT 3000

WORKDIR /usr/src/app

ADD package.json package-lock.json ./
RUN npm ci && npm cache clean --force

COPY . .

EXPOSE ${PORT}

CMD ["npm", "start"]
