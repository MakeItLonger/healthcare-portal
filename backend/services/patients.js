const patientsDataService = require('../data/patients');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');

const { HttpError } = require('../helpers');

const { SECRET_KEY } = process.env;

const getPatientsList = async () => {
  return patientsDataService.getAll();
};

const getPatientById = async (id) => {
  return patientsDataService.getById(id);
};
const getPatientByEmail = async (param) => {
  return patientsDataService.getByEmail(param);
};

const createPatient = async (patient) => {
  return await patientsDataService.create(patient);
};
const updatePatientToken = async (id, token) => {
  return patientsDataService.updateToken(id, token);
};

const deletePatient = async (id) => {
  return patientsDataService.deleteById(id);
};

const registerPatient = async (email, password, phone, name) => {
  const user = await getPatientByEmail(email);
  if (user) {
    throw HttpError(409, 'Email already in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);

  const newUser = await createPatient({
    email,
    password: hashPassword,
    avatarURL,
    phone,
    name,
  });

  return {
    email: newUser.email,
    name: newUser.name,
  };
};

const loginPatient = async (email, password) => {
  const user = await getPatientByEmail(email);
  if (!user) {
    throw HttpError(401, 'Email or password invalid');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, 'Email or password invalid');
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });
  await updatePatientToken(user._id, token);

  return {
    token,
    userId: user._id,
    expiresIn: 82800,
    user: {
      name: user.name,
      email: user.email,
    },
  };
};

const updatePatientAvatar = async (id, avatarPath) => {
  const updatedPatient = await patientsDataService.updatePatientAvatar(id, avatarPath);

  return {
    _id: updatedPatient._id,
    name: updatedPatient.name,
    email: updatedPatient.email,
  };
};

const addChat = async (id, chatId, mate) => {
  return patientsDataService.addChat(id, chatId, mate);
};

const updatePassword = async (id, password) => {
  const hashPassword = await bcrypt.hash(password, 10);
  return patientsDataService.updatePassword(id, hashPassword);
};

const updatePatient = async (id, name, email) => {
  return patientsDataService.updatePatient(id, name, email);
};

module.exports = {
  updatePatient,
  updatePassword,
  addChat,
  getPatientsList,
  getPatientById,
  getPatientByEmail,
  createPatient,
  updatePatientToken,
  deletePatient,
  registerPatient,
  loginPatient,
  updatePatientAvatar,
};
