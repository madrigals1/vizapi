const dotenv = require('dotenv');

dotenv.config();

const { PORT, STATIC_FOLDER, STATIC_URL } = process.env;

module.exports = { PORT, STATIC_FOLDER, STATIC_URL };
