const restana = require('restana');

const app = restana({});
const { PORT } = require('./utils/constants');

const { log } = require('./utils/helper');

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.start(PORT).then(() => log(`App is running on port ${PORT}`));
