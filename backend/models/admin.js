const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const adminModelSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      validate: [validator.isEmail, 'Email is invalid'],
      unique: true,
      createIndexes: { unique: true },
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
  },
  { timestamps: true },
);

adminModelSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error) {
    return next(error);
  }
});

adminModelSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('admins', adminModelSchema);
