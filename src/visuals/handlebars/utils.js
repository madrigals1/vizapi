const fs = require('fs');

const Handlebars = require('handlebars');

function render(filename, data) {
  return new Promise((resolve, reject) => {
    try {
      const source = fs.readFileSync(filename, 'utf8').toString();
      const template = Handlebars.compile(source);
      const output = template(data);
      resolve(output);
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = { render };
