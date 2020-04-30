const express = require("express");
const router = express.Router();
const path = require('path');
const deleteFile = require('../helpers/file');
const {convert} = require('../helpers/webp');
const {uploadMiddleware} = require('../helpers/upload');

router.post('/', async (req, res) => {
  try {
    await uploadMiddleware(req, res);
    path.dirname('./public');

    if (req.files.length <= 0) {
      return res.status(400).send(`You must select at least 1 file.`);
    }

    const files = [];
    for (let i = 0; i < req.files.length; i ++) {
      const result = await convert(req.files[i].path);
      files.push(`/public/${path.basename(result)}`);
      await deleteFile(req.files[i].path);
    }

    return res.status(200).send(files);
  } catch (error) {
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).send("Too many files to upload.");
    }

    return res.status(400).send(`Error when trying upload many files: ${error}`);
  }
});

module.exports = router;
