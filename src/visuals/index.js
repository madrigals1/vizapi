const puppeteer = require('puppeteer');

const constants = require('../constants');
const {
  log, error, getUniquePath, createFile,
} = require('../utils');
const { IS_DOCKER } = require('../constants');

const {
  compareToHtml, pieToHtml, tableToHtml, barToHtml,
} = require('./handlebars');

async function visualizeHelper(options) {
  const {
    action, data, prefix, width, height,
  } = options;

  // HTML version of data
  const content = await action(data);

  // Generate unique path
  const uniquePath = getUniquePath({ prefix, extension: 'png' });

  try {
    const args = [
      '--no-sandbox', '--disable-setuid-sandbox', '--enable-logging', '--v=1',
    ];
    // Set options for Puppeteer
    const puppeteerOptions = IS_DOCKER ? { args } : {};

    const browser = await puppeteer.launch(puppeteerOptions);
    const page = await browser.newPage();
    page.setDefaultTimeout(constants.RENDER_TIMEOUT_MS);

    page.on('pageerror', (err) => {
      throw new Error(`Error: ${err.toString()}`);
    });

    await page.setViewport({ width, height });
    await page.setContent(content);
    const container = await page.$('#container');

    const imageBase64 = await page.evaluate(() => {
      if (!window.chart || typeof window.chart.getImageURI === 'undefined') {
        return null;
      }
      return window.chart.getImageURI();
    });
    if (imageBase64) {
      const buf = Buffer.from(
        imageBase64.slice('data:image/png;base64,'.length),
        'base64',
      );

      createFile(uniquePath.absolute, buf);
    } else {
      await container.screenshot({ path: uniquePath.absolute });
    }

    await browser.close();
    log(`Image was created at path ${uniquePath.absolute}`);
    return uniquePath.link;
  } catch (err) {
    error(`Image was NOT created at path ${uniquePath.absolute}, error: ${err.message}`);
    return false;
  }
}

function createCompare(data) {
  const options = {
    action: compareToHtml,
    data,
    prefix: 'compare',
    width: 1400,
    height: 760,
  };
  return visualizeHelper(options);
}

function createTable(data) {
  const options = {
    action: tableToHtml,
    data,
    prefix: 'table',
    width: 900,
    height: 760,
  };
  return visualizeHelper(options);
}

function createPie(data) {
  const options = {
    action: pieToHtml,
    data,
    prefix: 'pie',
    width: data.width - 50,
    height: data.height,
  };
  return visualizeHelper(options);
}

async function createBar(data) {
  const options = {
    action: barToHtml,
    data,
    prefix: 'bar',
    width: data.options.width,
    height: data.options.height,
  };
  return visualizeHelper(options);
}

module.exports = {
  createTable, createCompare, createPie, createBar,
};
