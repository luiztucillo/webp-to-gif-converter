const multer = require('multer');
const util = require("util");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(`${__dirname}/../public`));
  },
  filename: (req, file, callback) => {
    const match = ["image/png", "image/jpeg", 'image/webp'];

    if (match.indexOf(file.mimetype) === -1) {
      const message = `${file.originalname} is invalid. Only accept png/jpeg/webp.`;
      return callback(message, null);
    }

    const filename = `${Date.now()}-${file.originalname}`;
    callback(null, filename);
  }
});

const upload = multer({storage}).array('images', 10);
module.exports.uploadMiddleware = util.promisify(upload);
