const GIFEncoder = require('gif-encoder-2');
const {createCanvas, loadImage} = require('canvas');
const {writeFile} = require('fs');
const PNG = require('png-js');

const createGif = async (imagesArray) => {
  const file = PNG.load(imagesArray[0]);

  const canvas = createCanvas(file.width, file.height);
  const ctx = canvas.getContext('2d');

  const encoder = new GIFEncoder(file.width, file.height, 'octree', true);
  encoder.start();

  for (let i = 0; i < imagesArray.length; i++) {
    const image = await loadImage(imagesArray[i]);
    ctx.beginPath();
    ctx.drawImage(image, 0, 0, file.width, file.height);
    encoder.addFrame(ctx);
  }

  encoder.finish();

  const newFile = `${imagesArray[0]}.gif`;
  const buffer = encoder.out.getData()
  writeFile(newFile, buffer, error => {
    // gif drawn or error
  });

  return newFile;
};

module.exports = createGif;
