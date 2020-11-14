FROM node:12-alpine

ENV FONT_DIR=/usr/share/fonts/noto
RUN mkdir -p $FONT_DIR

RUN apk update && apk add -y \
  chromium \
  wget \
  unzip \
  fontconfig \
  locales \
  gconf-service \
  libasound2 \
  libatk1.0-0 \
  libc6 \
  libcairo2 \
  libcups2 \
  libdbus-1-3 \
  libexpat1 \
  libfontconfig1 \
  libgcc1 \
  libgconf-2-4 \
  libgdk-pixbuf2.0-0 \
  libglib2.0-0 \
  libgtk-3-0 \
  libnspr4 \
  libpango-1.0-0 \
  libpangocairo-1.0-0 \
  libstdc++6 \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxi6 \
  libxrandr2 \
  libxrender1 \
  libxss1 \
  libxtst6 \
  ca-certificates \
  fonts-liberation \
  libappindicator1 \
  libnss3 \
  lsb-release \
  xdg-utils

# Install emoji's
RUN cd $FONT_DIR &&\
  wget https://github.com/emojione/emojione-assets/releases/download/3.1.2/emojione-android.ttf &&\
  fc-cache -f -v

WORKDIR /usr/src/app

COPY . .
RUN npm ci

EXPOSE 8000
