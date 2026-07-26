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

export const PORT = intEnv('PORT', 3122);
export const STATIC_URL = requiredEnv('STATIC_URL');
export const STATIC_FOLDER = '/var/www/static/vizapi';
export const IS_DOCKER = process.env.IS_DOCKER;
export const DEBUG = process.env.DEBUG;
