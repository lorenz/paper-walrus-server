const multer = require('multer'),
  uuid = require('uuid').v4,
  mime = require('mime'),
  mkdirp = require('mkdirp');

module.exports = function (destination, allowedMimeTypes) {
  mkdirp(destination, err => {if(err) throw err});

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destination);
    },
    filename: (req, file, cb) => {
      cb(null, uuid() + '.' + mime.extension(file.mimetype));
    },
  });

  const fileFilter = (req, file, cb) => {
    cb(null, allowedMimeTypes.includes(file.mimetype));
  };

  return multer({storage, fileFilter});
}
