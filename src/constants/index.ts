const dotenv = require('dotenv');

dotenv.config();

export const {
  PORT, STATIC_URL, IS_DOCKER, GOOGLE_RENDER_TIMEOUT,
} = process.env;

export const STATIC_FOLDER = '/var/www/static/vizapi';
