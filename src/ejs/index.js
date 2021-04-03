const ejs = require('ejs');

const dictToHtml = (tableDict) => {
  // We use first row of table to determine list of possible columns
  const firstRow = tableDict[0];
  const columns = Object.keys(firstRow);

  return ejs.renderFile('./src/ejs/templates/table.ejs', {
    columns,
    table: tableDict,
  });
};

module.exports = { dictToHtml };
