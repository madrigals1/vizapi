function barChart(data, options) {
  return `
  const data = google.visualization.arrayToDataTable(${JSON.stringify(data)});

  const options = ${JSON.stringify(options)};

  const chart = new google.visualization.BarChart(container);
  chart.draw(data, options)`;
}

module.exports = { barChart };
