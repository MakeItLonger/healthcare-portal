const express = require('express');
const upload = require('../utils/multer.js');

const ctrl = require('../controllers/doctors.js');
const { validateBody, authenticateDoctor, uploadCloud, isValidId } = require("../middlewares");
const {registerSchema} = require("../models/schemas");

const doctorsRouter = express.Router();

doctorsRouter.post("/register", validateBody(registerSchema), ctrl.createDoctor);
doctorsRouter.post("/login", ctrl.login);
doctorsRouter.get('/', ctrl.getAllDoctors);
doctorsRouter.get('/chats/:id', ctrl.getChats);
doctorsRouter.get('/data/:id', ctrl.getData);
doctorsRouter.get('/profile/:id', ctrl.getProfileData);
doctorsRouter.post('/profile/:id',upload.single('avatar'), ctrl.updateProfileData);
doctorsRouter.post('/receipt', ctrl.createReceipt);
doctorsRouter.post('/password', ctrl.updatePassword);
doctorsRouter.post('/:id', upload.single('avatar'), ctrl.updateDoctor);
doctorsRouter.delete('/:id', ctrl.deleteDoctor);
doctorsRouter.get("/current", authenticateDoctor, ctrl.getCurrent);
doctorsRouter.post("/logout", authenticateDoctor, ctrl.logout);


module.exports = doctorsRouter;
