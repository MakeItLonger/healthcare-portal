const mongoose = require('mongoose');

const serviceModelSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    picture: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('services', serviceModelSchema);
