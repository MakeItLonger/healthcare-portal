const appointmentModel = require('../models/appointment.js');

const getAllAppointments = async (aggregationPipeline) => {
  return appointmentModel.aggregate(aggregationPipeline);
};

const getAllAppointmentsByDoctorId = async (id) => {
  return await appointmentModel.find({ doctorId: id });
};

const createAppointment = async (appointment) => {
  return await appointmentModel.create(appointment);
};

const updateAppointment = async (id, appointment) => {
  return await appointmentModel.findByIdAndUpdate(id, appointment, { new: true });
};

const deleteAppointment = async (id) => {
  return await appointmentModel.findByIdAndDelete(id);
};

module.exports = {
  getAllAppointments,
  getAllAppointmentsByDoctorId,
  createAppointment,
  updateAppointment,
  deleteAppointment,
};
