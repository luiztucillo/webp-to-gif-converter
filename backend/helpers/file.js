const fs = require('fs');

deleteFile = async (file) => {
  return new Promise((resolve, reject) => {
    fs.unlink(file, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

module.exports = deleteFile;