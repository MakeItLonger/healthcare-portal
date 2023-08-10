const jwt = require('jsonwebtoken');
const { JWT_KEY } = process.env;
require('dotenv').config();
const adminModel = require('../models/admin.js');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.sendStatus(401);
    }

    const token = authHeader.split(' ')[1];
    const data = jwt.verify(token, JWT_KEY);
    const user = await adminModel.findById(data.id);

    if (!user) {
      return res.sendStatus(401);
    }

    req.user = user;
    next();
  } catch (error) {
    res.sendStatus(401);
  }
};
