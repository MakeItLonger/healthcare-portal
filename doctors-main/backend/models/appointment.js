const mongoose = require('mongoose');

const appointmentModelSchema = new mongoose.Schema(
  {
    doctorId: { type: String, required: true },
    patientId: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('appointments', appointmentModelSchema);
