const { renderGoogleChart } = require('./utils');

function barChart(data, options) {
  const htmlContent = `
  const data = google.visualization.arrayToDataTable(${JSON.stringify(data)});

  const options = ${JSON.stringify(options)};

  const chart = new google.visualization.BarChart(container);
  chart.draw(data, options)`;

  const renderOptions = {
    width: options.width,
    height: options.height,
  };

  return renderGoogleChart(htmlContent, renderOptions);
}

module.exports = { barChart };
