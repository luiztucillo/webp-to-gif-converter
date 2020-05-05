const express = require("express");
const router = express.Router();
const path = require('path');
const deleteFile = require('../helpers/file');
const {convert} = require('../helpers/webp');
const {upload} = require('../helpers/upload');
let converting = false;

router.post('/', upload.array('images'), async (req, res) => {

  // if (converting) {
  //   return res.status(400).send('Already converting. Try again later');
  // }

  converting = true;

  try {
    if (req.files.length <= 0) {
      throw Error(`You must select at least 1 file.`);
    }

    const files = [];
    for (let i = 0; i < req.files.length; i ++) {
      const result = await convert(req.files[i].path);
      files.push(`/public/${path.basename(result)}`);
      await deleteFile(req.files[i].path);
    }

    converting = false;

    return res.status(200).send(files);
  } catch (error) {
    converting = false;

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).send("Too many files to upload.");
    }

    return res.status(400).send(`${error}`);
  }
});

module.exports = router;
