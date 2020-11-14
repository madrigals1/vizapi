const dotenv = require('dotenv');

dotenv.config();

const { PORT } = process.env;

module.exports = { PORT };
