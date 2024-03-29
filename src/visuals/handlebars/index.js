const { render, chartsWrapper } = require('./utils');

async function tableToHtml(data) {
  // We use first row of table to determine list of possible columns
  const firstRow = data[0];
  const columns = Object.keys(firstRow);
  const values = data.map((row) => columns.map((column) => row[column]));

  return render(
    './src/visuals/handlebars/templates/table.html',
    { columns, table: values },
  );
}

function compareToHtml(data) {
  const { left, right } = data;

  // Identify which value is bigger
  left.compare_fields.forEach(({ name, value: leftValue }) => {
    const rightValue = (
      right.compare_fields.find((field) => field.name === name).value
    );
    left.compare_fields.find((field) => field.name === name).bigger = (
      leftValue >= rightValue
    );
    right.compare_fields.find((field) => field.name === name).bigger = (
      rightValue >= leftValue
    );
  });

  return render('src/visuals/handlebars/templates/compare.html', data);
}

async function pieToHtml(data) {
  const updatedData = {
    ...data,
    chartArea: JSON.stringify(data.chartArea),
    pieHole: data.pieHole || 0,
    is3D: data.is3D || false,
  };
  const rendered = render(
    './src/visuals/handlebars/templates/pie.html',
    updatedData,
  );
  return rendered;
}

function barToHtml(barData) {
  const { data, options } = barData;

  const htmlContent = `
  const data = google.visualization.arrayToDataTable(${JSON.stringify(data)});
  const options = ${JSON.stringify(options)};
  const chart = new google.visualization.BarChart(container);
  chart.draw(data, options)`;

  const renderOptions = {
    packages: '\'corechart\',',
    mapsApiKey: '',
    width: options.width,
    height: options.height,
  };

  return chartsWrapper(htmlContent, renderOptions);
}

module.exports = {
  compareToHtml,
  pieToHtml,
  tableToHtml,
  barToHtml,
};
