const puppeteer = require('puppeteer');

const { log, error, getUniquePath } = require('../../utils');
const { IS_DOCKER } = require('../../constants');
const { dictToHtml } = require('../../ejs');

const createTable = async (tableDict) => {
  // HTML version of table
  const content = await dictToHtml(tableDict);

  // Generate unique path
  const uniquePath = getUniquePath({ prefix: 'table', extension: 'png' });

  try {
    const args = [
      '--no-sandbox', '--disable-setuid-sandbox', '--enable-logging', '--v=1',
    ];
    // Set options for Puppeteer
    const options = IS_DOCKER ? { args } : {};

    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    await page.setViewport({
      width: 960,
      height: 760,
      deviceScaleFactor: 1,
    });
    await page.setContent(content);
    await page.waitForSelector('#table-container');
    const table = await page.$('#table-container');
    await table.screenshot({ path: uniquePath.absolute });
    await browser.close();
    log(`Image was created at path ${uniquePath.absolute}`);
    return uniquePath.link;
  } catch (err) {
    error(`Image was NOT created at path ${uniquePath.absolute}, error: ${err.error}`);
    return false;
  }
};

module.exports = { createTable };
