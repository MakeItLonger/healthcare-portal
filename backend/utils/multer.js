const multer = require('multer');

module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/png||jpg||jpeg$i/)) {
      cb(new Error('Invalid file'), false);

      return;
    }

    cb(null, true);
  },
});
