const { JWT_KEY } = process.env;
require('dotenv').config();
const jwt = require('jsonwebtoken');

const generateAdminWithToken = (admin) => {
  const token = jwt.sign({ id: admin._id, email: admin.email }, JWT_KEY, { expiresIn: '24h' });
  return {
    email: admin.email,
    username: admin.username,
    id: admin._id,
    token: `Bearer ${token}`,
  };
};

module.exports = generateAdminWithToken;
