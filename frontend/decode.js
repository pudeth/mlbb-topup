const { Jimp } = require("jimp");
const jsQR = require("jsqr");

const imagePath = "C:/Users/dethp/.gemini/antigravity/brain/51813e9a-93e3-458e-b3e7-fa7917f0320f/.user_uploaded/media_1788195828761.png";

Jimp.read(imagePath).then(image => {
  const width = image.bitmap.width;
  const height = image.bitmap.height;
  const data = new Uint8ClampedArray(image.bitmap.data);
  let code = jsQR(data, width, height);
  if (code) {
    console.log("=== EXACT ABA KHQR DECODED ===");
    console.log(code.data);
  } else {
    // Crop around QR box
    image.crop({ x: Math.floor(width * 0.2), y: Math.floor(height * 0.3), w: Math.floor(width * 0.6), h: Math.floor(height * 0.4) });
    const cropData = new Uint8ClampedArray(image.bitmap.data);
    code = jsQR(cropData, image.bitmap.width, image.bitmap.height);
    if (code) {
      console.log("=== EXACT ABA KHQR DECODED FROM CROP ===");
      console.log(code.data);
    } else {
      console.log("Not found in crop");
    }
  }
}).catch(err => console.error("Error:", err));
