const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const { handleMongooseError } = require('../helpers');

require('dotenv').config();

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const doctorModelSchema = new Schema(
  {
    first_name: { type: String, required: true },
    second_name: { type: String, required: true },
    position: { type: String, required: true },
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
      notifications: {
        type: [{
          link: String,
          msg: String
          }]
    },
      chats: {
          type: [{
              chatId: String,
              mate: String
          }] },
      description: { type: String },
      appointmentDays: { type: String },
      timeSchedule: { type: String },
      token: {
          type: String,
          default: '',
      },
    avatar: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
  },
  { timestamps: true },
);

doctorModelSchema.post('save', handleMongooseError);

const joiRegisterSchema = Joi.object({
    name: Joi.string().min(3).max(16).required(),
    password: Joi.string()
        .min(6)
        .max(12)
        .error(
            () =>
                new Error(
                    'Password must contain Latin letters: at least 1 lowercase, 1 uppercase, 1 number and be at least 6 and no more than 12 characters',
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
                    'Password must contain Latin letters: at least 1 lowercase, 1 uppercase, 1 number and be at least 6 and no more than 12 characters',
                ),
        )
        .required(),
});

doctorModelSchema.methods.setPassword = function (password) {
    this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

doctorModelSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};


const Doctor = model('doctors', doctorModelSchema);

module.exports = {
    Doctor,
    joiRegisterSchema,
    joiLoginSchema,
};