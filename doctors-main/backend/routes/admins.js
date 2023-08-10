const express = require('express');
const adminController = require('../controllers/admin.js');
const auth = require('../middlewares/auth.js');

const adminsRouter = express.Router();

adminsRouter.post('/', adminController.createAdmin);
adminsRouter.post('/login', adminController.loginAdmin);
adminsRouter.get('/admin', auth, adminController.currentUser);

module.exports = adminsRouter;
