import * as dotenv from 'dotenv';

dotenv.config();

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function intEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw === '') {
    return fallback;
  }
  const value = Number(raw);
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`Environment variable ${name} must be a positive integer, got: ${raw}`);
  }
  return value;
}

const PORT = intEnv('PORT', 3122);
const GOOGLE_RENDER_TIMEOUT = intEnv('GOOGLE_RENDER_TIMEOUT', 5000);
const STATIC_URL = requiredEnv('STATIC_URL');
const IS_DOCKER = process.env.IS_DOCKER;
const STATIC_FOLDER = '/var/www/static/vizapi';

export {
  PORT,
  STATIC_URL,
  STATIC_FOLDER,
  IS_DOCKER,
  GOOGLE_RENDER_TIMEOUT,
};
