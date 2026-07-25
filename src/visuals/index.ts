import * as puppeteer from 'puppeteer';

import * as constants from '../constants';
import { getUniquePath, createFile } from '../utils';
import { log, error } from '../utils/helper';
import { IS_DOCKER } from '../constants';
import type {
  TableData, CompareData, PieData, BarData,
  VisualizeOptions, VisualResult,
} from '../types';

import {
  compareToHtml, pieToHtml, tableToHtml, barToHtml,
} from './handlebars';

async function visualizeHelper<T>(options: VisualizeOptions<T>): Promise<VisualResult> {
  const {
    action, data, prefix, width, height,
  } = options;

  const content = await action(data);

  const uniquePath = getUniquePath({ prefix, extension: 'png' });

  try {
    const args = [
      '--no-sandbox', '--disable-setuid-sandbox', '--enable-logging', '--v=1',
    ];
    const puppeteerOptions = IS_DOCKER ? { args } : {};

    const browser = await puppeteer.launch(puppeteerOptions);
    const page = await browser.newPage();
    page.setDefaultTimeout(constants.GOOGLE_RENDER_TIMEOUT);

    page.on('pageerror', (err) => {
      throw new Error(`Error: ${String(err)}`);
    });

    await page.setViewport({ width, height });
    await page.setContent(content);
    const container = await page.$('#container');

    const imageBase64 = await page.evaluate(() => {
      const w = window as { chart?: { getImageURI?: () => string } };
      if (!w.chart || typeof w.chart.getImageURI === 'undefined') {
        return null;
      }
      return w.chart.getImageURI();
    });
    if (imageBase64) {
      const buf = Buffer.from(
        imageBase64.slice('data:image/png;base64,'.length),
        'base64',
      );

      await createFile(uniquePath.absolute, buf);
    } else if (container) {
      await container.screenshot({ path: uniquePath.absolute });
    }

    await browser.close();
    log(`Image was created at path ${uniquePath.absolute}`);
    return uniquePath.link;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    error(`Image was NOT created at path ${uniquePath.absolute}, error: ${message}`);
    return false;
  }
}

export function createCompare(data: CompareData): Promise<VisualResult> {
  const options: VisualizeOptions<CompareData> = {
    action: compareToHtml,
    data,
    prefix: 'compare',
    width: 1400,
    height: 760,
  };
  return visualizeHelper(options);
}

export function createTable(data: TableData): Promise<VisualResult> {
  const options: VisualizeOptions<TableData> = {
    action: tableToHtml,
    data,
    prefix: 'table',
    width: 900,
    height: 760,
  };
  return visualizeHelper(options);
}

export function createPie(data: PieData): Promise<VisualResult> {
  const options: VisualizeOptions<PieData> = {
    action: pieToHtml,
    data,
    prefix: 'pie',
    width: data.width - 50,
    height: data.height,
  };
  return visualizeHelper(options);
}

export function createBar(data: BarData): Promise<VisualResult> {
  const options: VisualizeOptions<BarData> = {
    action: barToHtml,
    data,
    prefix: 'bar',
    width: data.options.width,
    height: data.options.height,
  };
  return visualizeHelper(options);
}
