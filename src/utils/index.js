const uuid4 = require('uuid4');
const fs = require('fs');
const { STATIC_FOLDER, STATIC_URL } = require('../constants');
const { log, error } = require('./helper');

const getUniquePath = (options) => {
  const { prefix, suffix, extension } = options;

  // /var/www/static
  let fileName = '';

  // /var/www/image_
  if (prefix) fileName += `${prefix}_`;

  // Generate unique ID
  const id = uuid4();

  // /var/www/image_askdu231p9u1p239312ksdlc
  fileName += id;

  // /var/www/image_askdu231p9u1p239312ksdlc_public
  if (suffix) fileName += `_${suffix}`;

  // /var/www/image_askdu231p9u1p239312ksdlc_public.png
  if (extension) fileName += `.${extension}`;

  // Create static folders
  fs.mkdirSync(STATIC_FOLDER, null);

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

module.exports = {
  getUniquePath, deleteFile, log, error,
};
