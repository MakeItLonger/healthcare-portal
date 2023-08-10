const adminService = require('../services/admins.js');
const { ctrlWrapper } = require('../helpers');
const generateAdminWithToken = require('../helpers/generateAdminWithToken.js');

const createAdmin = async (req, res) => {
  const adminReg = {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  };
  const admin = await adminService.createAdmin(adminReg);
  res.status(201).json(admin);
};

const loginAdmin = async (req, res) => {
  const adminLog = {
    email: req.body.email,
    password: req.body.password,
  };
  const admin = await adminService.loginAdmin(adminLog);
  const errors = { emailOrPassword: 'Incorrect email or password' };

  if (!admin) {
    return res.status(422).json(errors);
  }

  res.status(201).json(admin);
};

const currentUser = async (req, res) => {
  res.send(generateAdminWithToken(req.user));
};

module.exports = {
  createAdmin: ctrlWrapper(createAdmin),
  loginAdmin: ctrlWrapper(loginAdmin),
  currentUser: ctrlWrapper(currentUser),
};
