const puppeteer = require('puppeteer');

const constants = require('../../constants');

function getRenderCode(content, opts) {
  const packages = opts.packages.map((pkg) => `'${pkg}',`);
  return `
  <div id="chart_div" style="width: ${opts.width}; height: ${opts.height};"></div>
  <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
  <script type="text/javascript">
    const container = document.getElementById('chart_div');
    google.charts.load('current', {
      packages:[${packages}],
      mapsApiKey: '${opts.mapsApiKey}',
    });
    google.charts.setOnLoadCallback(getDrawChart());
    function getDrawChart() {
      const drawChartFn = function(window, document) {
        ${content}
        if (typeof drawChart === 'function') {
          drawChart();
        }
        if (typeof chart !== 'undefined') {
          return chart;
        }
      }
      return function() {
        window.chart = drawChartFn({}, {
          getElementById: () => { return container; },
        });
      }
    }
  </script>
  `;
}

async function renderGoogleChart(contentRaw, optsRaw) {
  let content = contentRaw;
  if (typeof contentRaw === 'function') {
    content = `const drawChart = (${contentRaw.toString()});`;
  }

  const opts = {
    packages: ['corechart'],
    mapsApiKey: '',
    width: '100%',
    height: '100%',
    ...optsRaw || {},
  };

  const args = [
    '--no-sandbox', '--disable-setuid-sandbox', '--enable-logging', '--v=1',
  ];
  // Set options for Puppeteer
  const puppeteerOptions = constants.IS_DOCKER ? { args } : {};

  const browser = await puppeteer.launch(puppeteerOptions);

  const page = await browser.newPage();
  page.setDefaultTimeout(constants.RENDER_TIMEOUT_MS);

  page.on('pageerror', (err) => {
    throw new Error(`Error: ${err.toString()}`);
  });

  const renderCode = getRenderCode(content, opts);
  await page.setContent(renderCode);

  const imageBase64 = await page.evaluate(() => {
    if (!window.chart || typeof window.chart.getImageURI === 'undefined') {
      return null;
    }
    return window.chart.getImageURI();
  });

  let buf;
  if (imageBase64) {
    // Exported the chart via Google Charts API.
    buf = Buffer.from(
      imageBase64.slice('data:image/png;base64,'.length),
      'base64',
    );
  } else {
    const elt = await page.$('#chart_div');
    // Chart doesn't support export, take a screenshot
    buf = await elt.screenshot();
  }

  await browser.close();

  return buf;
}

module.exports = { renderGoogleChart };
