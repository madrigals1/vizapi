const restana = require('restana');
const bodyParser = require('body-parser');

const app = restana();
const { PORT } = require('./constants');

const { log } = require('./utils');
const { createTable } = require('./visuals/table');

app.use(bodyParser.json());

app.post('/table', async (req, res) => {
  // Get table dict from request body
  const { table } = req.body;

  // Get image of png table
  const tableImageLink = await createTable(table);

  // Send link or error
  const data = tableImageLink ? { link: tableImageLink } : { failure: 'Error on the server!' };

  // Send back data
  res.send(data);
});

app.start(PORT).then(() => log(`App is running on port ${PORT}`));
