const puppeteer = require('puppeteer');

const { compareToHtml, tableToHtml } = require('../ejs');
const { log, error, getUniquePath } = require('../utils');
const { IS_DOCKER } = require('../constants');

const visualizeHelper = async (options) => {
  const {
    action, data, prefix, width,
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
    await page.setViewport({
      width,
      height: 760,
    });
    await page.setContent(content);
    await page.waitForSelector('#container');
    const table = await page.$('#container');
    await table.screenshot({ path: uniquePath.absolute });
    await browser.close();
    log(`Image was created at path ${uniquePath.absolute}`);
    return uniquePath.link;
  } catch (err) {
    error(`Image was NOT created at path ${uniquePath.absolute}, error: ${err.message}`);
    return false;
  }
};

const createCompare = (data) => {
  const options = {
    action: compareToHtml,
    data,
    prefix: 'compare',
    width: 1400,
  };
  return visualizeHelper(options);
};

const createTable = (data) => {
  const options = {
    action: tableToHtml,
    data,
    prefix: 'table',
    width: 900,
  };
  return visualizeHelper(options);
};

module.exports = { createTable, createCompare };
