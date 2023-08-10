const adminModel = require('../models/admin.js');
const generateAdminWithToken = require('../helpers/generateAdminWithToken.js');

const createAdmin = async (regData) => {
  const savedAdmin = await adminModel.create(regData);
  return generateAdminWithToken(savedAdmin);
};

const loginAdmin = async (logData) => {
  const loggedAdmin = await adminModel.findOne({ email: logData.email }).select('+password');

  let isSamePassword;

  if (loggedAdmin) {
    isSamePassword = await loggedAdmin.validatePassword(logData.password);
  }

  if (!loggedAdmin || !isSamePassword) {
    return null;
  }

  return generateAdminWithToken(loggedAdmin);
};
module.exports = {
  createAdmin,
  loginAdmin,
};
