const { render } = require('./utils');

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

module.exports = {
  compareToHtml,
  pieToHtml,
};
