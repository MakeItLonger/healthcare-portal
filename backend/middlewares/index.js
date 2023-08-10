const validateBody = require("./validateBody");
const isValidId = require("./isValidId");
const authenticate = require("./authMiddleware");
const uploadCloud = require("./uploadMiddleware");
const uploadCloudPDF = require("./uploadPdfMiddleware");
const authenticateDoctor = require('./doctorsAuthMiddleware')

module.exports = {
  authenticateDoctor,
  authenticate,
  uploadCloud,
  uploadCloudPDF,
  validateBody,
  isValidId,
};
