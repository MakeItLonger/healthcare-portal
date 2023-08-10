const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    patient: { type: String, required: true },
    doctor: { type: String, required: true },
    messages: { type: [{ sender: String, msg: String}] },
})

module.exports = mongoose.model('chat', chatSchema)