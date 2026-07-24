
const multer = require('multer');

const uploadImage = multer({
  storage: multer.memoryStorage(), 
  limits: {
    fileSize: 1024 * 1024 * 20,
  },
  fileFilter: (req, file, callback) => {
    const typeFile = file.mimetype.split('/')[0];
    if (typeFile === 'image') {
      callback(null, true);
    } else {
      const err = new Error('Invalid image type');
      err.status = 401; // Unauthorized
      callback(err, false);
    }
  },
});


module.exports = uploadImage;
