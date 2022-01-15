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

module.exports = {
  compareToHtml,
};
