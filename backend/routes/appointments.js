const express = require('express');
const upload = require('../utils/multer.js');
const appointmentController = require('../controllers/appointments.js');

const appointmentsRouter = express.Router();

appointmentsRouter.post('/', upload.single('avatar'), appointmentController.createAppointment);
appointmentsRouter.get('/', appointmentController.getAllAppointments);
appointmentsRouter.put('/:id', appointmentController.updateAppointment);
appointmentsRouter.delete('/:id', appointmentController.deleteAppointment);

module.exports = appointmentsRouter;
