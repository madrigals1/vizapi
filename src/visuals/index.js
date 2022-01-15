const puppeteer = require('puppeteer');

const {
  log, error, getUniquePath, createFile,
} = require('../utils');
const { IS_DOCKER } = require('../constants');

const { tableToHtml } = require('./ejs');
const { compareToHtml, pieToHtml } = require('./handlebars');
const { barChart } = require('./googleCharts');

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
    await page.setViewport({ width, height });
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

// Render the chart to image
async function createBar(barData) {
  const buffer = await barChart(barData.data, barData.options);

  const uniquePath = getUniquePath({ prefix: 'bar', extension: 'png' });
  createFile(uniquePath.absolute, buffer);

  return uniquePath.link;
}

module.exports = {
  createTable, createCompare, createPie, createBar,
};
