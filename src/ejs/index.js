const ejs = require('ejs');

const tableToHtml = (data) => {
  // We use first row of table to determine list of possible columns
  const firstRow = data[0];
  const columns = Object.keys(firstRow);

  return ejs.renderFile('./src/ejs/templates/table.ejs', {
    columns,
    table: data,
  });
};

const compareToHtml = (data) => {
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

  return ejs.renderFile('./src/ejs/templates/compare.ejs', { left, right });
};

async function pieToHtml(data) {
  const updatedData = {
    ...data,
    chartArea: JSON.stringify(data.chartArea),
    pieHole: data.pieHole || 0,
    is3D: data.is3D || false,
  };
  const rendered = ejs.renderFile('./src/ejs/templates/pie.ejs', updatedData);
  return rendered;
}

module.exports = { tableToHtml, compareToHtml, pieToHtml };
