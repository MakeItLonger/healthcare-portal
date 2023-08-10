const appointmentService = require('../services/appointments.js');
const { ctrlWrapper } = require('../helpers/index.js');

const getAllAppointments = async (req, res) => {
  const { doctorId = '', date = '', dateStart = '2023-07-17' } = req.query;
  const appointments = await appointmentService.getAllAppointments(doctorId, date, dateStart);
  return res.status(200).json(appointments);
};

const createAppointment = async (req, res) => {
  const appointment = await appointmentService.createAppointment(req.body);

  res.status(201).json(appointment);
};

const updateAppointment = async (req, res) => {
  const updatedAppointment = await appointmentService.updateAppointment(req.body, req.params.id);
  return res.status(200).json(updatedAppointment);
};

const deleteAppointment = async (req, res) => {
  const appointment = await appointmentService.deleteAppointment(req.params.id);
  return res.status(201).json(appointment);
};

module.exports = {
  getAllAppointments: ctrlWrapper(getAllAppointments),
  createAppointment: ctrlWrapper(createAppointment),
  updateAppointment: ctrlWrapper(updateAppointment),
  deleteAppointment: ctrlWrapper(deleteAppointment),
};
