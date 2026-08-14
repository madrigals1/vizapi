import { chromium, type Browser, type Page } from 'playwright';

import { RENDER_TIMEOUT_MS } from './constants';

const CHROMIUM_PATH = process.env.CHROMIUM_PATH || undefined;

let browser: Browser | null = null;
let launchPromise: Promise<Browser> | null = null;

async function getBrowser(): Promise<Browser> {
  if (browser && browser.isConnected()) {
    return browser;
  }
  if (!launchPromise) {
    launchPromise = chromium
      .launch({
        executablePath: CHROMIUM_PATH,
        args: ['--no-sandbox', '--disable-dev-shm-usage'],
      })
      .then((instance) => {
        browser = instance;
        launchPromise = null;
        return instance;
      })
      .catch((err) => {
        launchPromise = null;
        throw err;
      });
  }
  return launchPromise;
}

export function jsString(value: unknown): string {
  return JSON.stringify(value === undefined ? null : value).replace(/</g, '\\u003c');
}

async function screenshot(page: Page, width: number, height: number): Promise<Buffer> {
  return page.screenshot({ type: 'png', clip: { x: 0, y: 0, width, height } });
}

export async function renderHtml(
  html: string,
  options: { width: number; height?: number; waitRaf?: boolean },
): Promise<Buffer> {
  const page = await (await getBrowser()).newPage();
  try {
    await page.setViewportSize({ width: options.width, height: options.height ?? 800 });
    await page.setContent(html, { waitUntil: 'load', timeout: RENDER_TIMEOUT_MS });
    await page.evaluate(() => document.fonts.ready);
    if (options.waitRaf) {
      await page.evaluate(() => new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }));
    }
    if (options.height !== undefined) {
      return await screenshot(page, options.width, options.height);
    }
    const contentHeight = await page.evaluate(() => {
      const first = document.body.firstElementChild as HTMLElement | null;
      return first ? Math.ceil(first.getBoundingClientRect().bottom) : 0;
    });
    await page.setViewportSize({ width: options.width, height: contentHeight });
    return await page.screenshot({ type: 'png' });
  } finally {
    await page.close();
  }
}

export async function closeBrowser(): Promise<void> {
  if (browser) {
    const instance = browser;
    browser = null;
    launchPromise = null;
    await instance.close().catch(() => {});
  }
}
