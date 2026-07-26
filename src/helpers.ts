export function log(...args: unknown[]): void {
  console.log(`[${new Date().toISOString()}]`, ...args);
}

export function error(...args: unknown[]): void {
  console.error(`[${new Date().toISOString()}] ERROR:`, ...args);
}

export function debug(...args: unknown[]): void {
  if (process.env.DEBUG) {
    console.log(`[${new Date().toISOString()}] DEBUG:`, ...args);
  }
}