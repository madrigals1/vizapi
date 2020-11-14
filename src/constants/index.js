const dotenv = require('dotenv');

dotenv.config();

const {
  PORT, STATIC_FOLDER, STATIC_URL, CHROMIUM_PATH,
} = process.env;

module.exports = {
  PORT, STATIC_FOLDER, STATIC_URL, CHROMIUM_PATH,
};
