const appointmentData = require('../data/appointments.js');
const sendEmail = require('../helpers/sendEmail.js');
const patientData = require('../data/patients.js');

const getAllAppointments = async (doctorId, date) => {
  const matchStage = {
    doctorId: { $regex: doctorId, $options: 'i' },
    $and: [{ date: { $regex: date, $options: 'i' } }],
  };

  const aggregationPipeline = [{ $match: matchStage }];

  return await appointmentData.getAllAppointments(aggregationPipeline);
};

const createAppointment = async (appointment) => {
  const patient = await patientData.getById(appointment.patientId);
  await sendAppointmentToEmail(patient.email, appointment.date, appointment.time);
  return await appointmentData.createAppointment(appointment);
};

const sendAppointmentToEmail = async (email, date, time) => {
  const data = {
    to: email,

    subject: 'Medical Center Appointment',

    html:
      '<h3><strong>Information about your appointment in Medical Center</strong></h3>' +
      '<br/>' +
      '<p><strong>Date of appointment:</strong>' +
      ' ' +
      date +
      '</p>' +
      '<br/>' +
      '<p><strong>Time of appointment:</strong>' +
      ' ' +
      time +
      '</p>',
  };
  sendEmail(data);
};

const updateAppointment = async (appointment, id) => {
  if (!id) {
    throw new Error('ID is required');
  }

  return await appointmentData.updateAppointment(id, appointment);
};

const deleteAppointment = async (id) => {
  if (!id) {
    throw new Error('ID is required');
  }

  const appointment = await appointmentData.deleteAppointment(id);

  return appointment;
};

module.exports = {
  getAllAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  sendEmail,
};
