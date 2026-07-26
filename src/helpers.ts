export function log(...args: unknown[]): void {
  console.log(`[${new Date().toISOString()}]`, ...args);
}

export function error(...args: unknown[]): void {
  console.error(`[${new Date().toISOString()}] ERROR:`, ...args);
}
