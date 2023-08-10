const adminData = require('../data/admins.js');

const createAdmin = async (adminReg) => {
  return await adminData.createAdmin(adminReg);
};

const loginAdmin = async (adminLog) => {
  return await adminData.loginAdmin(adminLog);
};

module.exports = {
  createAdmin,
  loginAdmin,
};
