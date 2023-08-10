const { Schema, model } = require("mongoose");

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const registrationPendingSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: [3, "Must be at least 3, got {VALUE}"],
        trim: true,
        default: null,
    },
    email: {
        type: String,
        match: emailRegexp,
        unique: true,
        required: true,
    },
    token: {
        type: String,
        unique: true,
        required: true
    }
})

// registrationPendingSchema.post("save", handleMongooseError)

const RegistrationPending = model("pendingRegistration", registrationPendingSchema);

module.exports = RegistrationPending;