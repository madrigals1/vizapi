import * as dotenv from 'dotenv';

dotenv.config();

const PORT = Number(process.env.PORT);
const GOOGLE_RENDER_TIMEOUT = Number(process.env.GOOGLE_RENDER_TIMEOUT);

const {
  STATIC_URL,
  IS_DOCKER,
} = process.env;

const STATIC_FOLDER = '/var/www/static/vizapi';

export {
  PORT,
  STATIC_URL,
  STATIC_FOLDER,
  IS_DOCKER,
  GOOGLE_RENDER_TIMEOUT,
};
