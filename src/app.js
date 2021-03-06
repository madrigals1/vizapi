const restana = require('restana');
const bodyParser = require('body-parser');

const app = restana();
const { PORT } = require('./constants');
const { log, createStaticFolder } = require('./utils');
const { createTable, createCompare } = require('./visuals');

app.use(bodyParser.json());

// Create static folder
createStaticFolder();

app.get('/', async (req, res) => {
  // Send back data
  res.send({ detail: 'Visualize API is running!' });
});

app.post('/table', async (req, res) => {
  // Get table dict from request body
  const { table } = req.body;

  if (!table) res.send('Please, provide \'table\' in request body');

  // Get image of png table
  const tableImageLink = await createTable(table);

  // Send link or error
  const data = tableImageLink
    ? { link: tableImageLink }
    : { failure: 'Error on the server!' };

  // Send back data
  res.send(data);
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
  res.send(data);
});

app.start(PORT).then(() => log(`App is running on port ${PORT}`));
