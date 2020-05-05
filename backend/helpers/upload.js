const multer = require('multer');
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(`${__dirname}/../public`));
  },
  filename: (req, file, callback) => {
    const match = ['image/webp'];

    if (match.indexOf(file.mimetype) === -1) {
      const message = `${file.originalname} is invalid. Only accept webp.`;
      return callback(message, null);
    }

    const filename = `${Date.now()}-${file.originalname}`;
    callback(null, filename);
  }
});

module.exports.upload = multer({storage});
