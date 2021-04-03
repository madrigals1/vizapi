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

const compareToHtml = (data) => (
  ejs.renderFile('./src/ejs/templates/compare.ejs', data)
);

module.exports = { tableToHtml, compareToHtml };
