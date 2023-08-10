const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const { handleMongooseError } = require('../helpers');

require('dotenv').config();

/* eslint-disable-next-line */
const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const patientSchema = new Schema(
  {
    name: {
      type: String,
      minlength: [3, 'Must be at least 3, got {VALUE}'],
      trim: true,
      default: null,
    },
      chats: {
        type: [{
            chatId: String,
            mate: String
          }] },
    email: {
      type: String,
      match: emailRegexp,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      trim: true,
      default: null,
    },
    token: {
      type: String,
      default: '',
    },
    avatarURL: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

patientSchema.post('save', handleMongooseError);

const joiRegisterSchema = Joi.object({
  name: Joi.string().min(3).max(16),
  password: Joi.string()
    .min(6)
    .max(12)
    .error(
      () =>
        new Error(
          'the passport must contain Latin letters: at least 1 lowercase, 1 uppercase, 1 number and be at least 6 and no more than 12 characters',
        ),
    )
    .required(),
});

const joiLoginSchema = Joi.object({
  password: Joi.string()
    .min(6)
    .max(12)
    .error(
      () =>
        new Error(
          'the passport must contain Latin letters: at least 1 lowercase, 1 uppercase, 1 number and be at least 6 and no more than 12 characters',
        ),
    )
    .required(),
});

patientSchema.methods.setPassword = function (password) {
  this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

patientSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const Patient = model('patient', patientSchema);

module.exports = {
  Patient,
  joiRegisterSchema,
  joiLoginSchema,
};
