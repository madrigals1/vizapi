const restana = require('restana');
const bodyParser = require('body-parser');

const app = restana();
const { PORT } = require('./constants');
const { log, createStaticFolder } = require('./utils');
const {
  createTable, createCompare, createPie, createBar,
} = require('./visuals');

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
    const data = {
      failure: 'Please, provide non-empty \'table\' in request body',
    };
    return res.send(data);
  }

  // Get image of png table
  const link = await createTable(table);

  // Send link or error
  const data = link ? { link } : { failure: 'Error on the server!' };

  // Send back data
  return res.send(data);
});

app.post('/compare', async (req, res) => {
  // Get compare dict from request body
  const compare = req.body;

  // Get image of png compare table
  const link = await createCompare(compare);

  // Send link or error
  const data = link ? { link } : { failure: 'Error on the server!' };

  // Send back data
  return res.send(data);
});

app.post('/pie', async (req, res) => {
  const pieData = req.body;

  // Get image of png table
  const link = await createPie(pieData);

  // Send link or error
  const data = link ? { link } : { failure: 'Error on the server!' };

  // Send back data
  return res.send(data);
});

app.post('/bar', async (req, res) => {
  const barData = req.body;

  // Get image of png table
  const link = await createBar(barData);

  // Send link or error
  const data = link ? { link } : { failure: 'Error on the server!' };

  // Send back data
  return res.send(data);
});

app.start(PORT).then(() => log(`App is running on port ${PORT}`));
