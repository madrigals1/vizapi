const restana = require('restana');
const bodyParser = require('body-parser');

const app = restana();
const { PORT } = require('./constants');
const { log, createStaticFolder } = require('./utils');
const { createTable, createCompare } = require('./visuals');

app.use(bodyParser.json());

// Create static folder
createStaticFolder();

async function defaultResponse(req, res) {
  return res.send({ detail: 'Visualize API is running!' });
}

app.get('/', defaultResponse);

app.post('/table', async (req, res) => {
  // Get table dict from request body
  const { table } = req.body;

  if (!table || table.length === 0) {
    return res.send('Please, provide non-empty \'table\' in request body');
  }

  // Get image of png table
  const tableImageLink = await createTable(table);

  // Send link or error
  const data = tableImageLink
    ? { link: tableImageLink }
    : { failure: 'Error on the server!' };

  // Send back data
  return res.send(data);
});

app.post('/compare', async (req, res) => {
  // Get compare dict from request body
  const compare = req.body;

  // Get image of png compare table
  const compareImageLink = await createCompare(compare);

  // Send link or error
  const data = compareImageLink
    ? { link: compareImageLink }
    : { failure: 'Error on the server!' };

  // Send back data
  return res.send(data);
});

app.start(PORT).then(() => log(`App is running on port ${PORT}`));
