const {exec} = require("child_process");
const createGif = require('./gif');
const deleteFile = require('./file');

webpmuxGetFrame = async (inputImage, outputImage, frameNumber) => {
  const cmd = `webpmux -get frame ${frameNumber} ${inputImage} -o ${outputImage}`;

  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }

      resolve();
    });
  });
};

dwebp = async (inputImage, outputImage) => {
  const cmd = `dwebp ${inputImage} -o ${outputImage}`;
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }

      resolve();
    });
  });
};

module.exports.convert = async (filePath) => {
  let frameCount = 0;
  let frameResult = true;
  const images = [];
  while (frameResult) {
    try {
      const image = `${filePath}.${frameCount}.webp`;
      const pngImage = `${image}.png`;
      await webpmuxGetFrame(filePath, image, frameCount);
      await dwebp(image, pngImage);
      await deleteFile(image);
      images.push(pngImage);
      frameCount++;
    } catch (e) {
      frameResult = false;
    }
  }

  const newFile = await createGif(images);
  images.forEach(path => deleteFile(path));

  return newFile;
};
