import * as dotenv from 'dotenv';

dotenv.config();

const {
  STATIC_URL,
  IS_DOCKER,
  GOOGLE_RENDER_TIMEOUT,
} = process.env;

const PORT = Number(process.env.PORT);

const STATIC_FOLDER = '/var/www/static/vizapi';

export {
  PORT,
  STATIC_URL,
  STATIC_FOLDER,
  IS_DOCKER,
  GOOGLE_RENDER_TIMEOUT,
};
