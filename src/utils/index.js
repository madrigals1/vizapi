const fs = require('fs');

const uuid4 = require('uuid4');
const Entities = require('html-entities').XmlEntities;

const { STATIC_FOLDER, STATIC_URL } = require('../constants');

const { log, error } = require('./helper');

const entities = new Entities();

const getUniquePath = (options) => {
  const { prefix, suffix, extension } = options;

  // /var/www/static
  let fileName = '';

  // /var/www/static/image_
  if (prefix) fileName += `${prefix}_`;

  // Generate unique ID
  const id = uuid4();

  // /var/www/static/image_askdu231p9u1p239312ksdlc
  fileName += id;

  // /var/www/static/image_askdu231p9u1p239312ksdlc_public
  if (suffix) fileName += `_${suffix}`;

  // /var/www/static/image_askdu231p9u1p239312ksdlc_public.png
  if (extension) fileName += `.${extension}`;

  return {
    absolute: `${STATIC_FOLDER}/${fileName}`,
    relative: fileName,
    link: `${STATIC_URL}/${fileName}`,
  };
};

const deleteFile = (path) => {
  fs.unlink(path, (err) => {
    if (err) error(err);
    log('Image was deleted');
  });
};

const htmlEscape = (html) => entities.encodeNonUTF(html);

const createStaticFolder = () => {
  if (!fs.existsSync(STATIC_FOLDER)) fs.mkdirSync(STATIC_FOLDER, null);
};

module.exports = {
  getUniquePath, deleteFile, log, error, htmlEscape, createStaticFolder,
};
