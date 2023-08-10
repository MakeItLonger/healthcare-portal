require('dotenv').config();
const doctorData = require('../data/doctors.js');
const { saveFileToCloud } = require('../utils/saveFiletoCloud.js');
const { HttpError } = require('../helpers');
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const tokenGenerate = require('../helpers/tokenGenerate');

const { SECRET_KEY } = process.env;

const getAllDoctors = async (search, limit, page, sort, position) => {
  const matchStage = {
    $or: [
      { first_name: { $regex: search, $options: 'i' } },
      { second_name: { $regex: search, $options: 'i' } },
      { position: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ],
    position: { $regex: position, $options: 'i' },
  };

  const sortStage = {};
  if (sort.includes(',')) {
    const [sortField, sortOrder] = sort.split(',');
    sortStage[sortField] = sortOrder === 'desc' ? -1 : 1;
  } else {
    sortStage[sort] = 1;
  }

  const skipStage = { $skip: page * limit };
  const limitStage = { $limit: limit };

  const aggregationPipeline = [{ $match: matchStage }, { $sort: sortStage }, skipStage, limitStage];

  return await doctorData.getAllDoctors(aggregationPipeline, matchStage, sortStage);
};

const createDoctor = async (doctor) => {
  return await doctorData.createDoctor({ ...doctor });
};

const getDoctorsList = async () => {
  return doctorData.getAll();
};

const getDoctorById = async (id) => {
  return doctorData.getById(id);
};
const getDoctorByEmail = async (param) => {
  return doctorData.getByEmail(param);
};
const updateDoctorToken = async (id, token) => {
  return doctorData.updateToken(id, token);
};

const registerDoctor = async (email, name, position, password) => {
  const user = await getDoctorByEmail(email);
  console.log('user: ' + user);
  if (user) {
    throw HttpError(409, 'Email already in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const first_name = name.split(' ')[0];
  const last_name = name.split(' ')[1];

  const newUser = await createDoctor({
    email: email,
    password: hashPassword,
    first_name: first_name,
    second_name: last_name,
    position: position,
  });

  return {
    email: newUser.email,
    name: newUser.first_name + newUser.last_name,
    password: password,
  };
};

const loginDoctor = async (email, password) => {
  const user = await getDoctorByEmail(email);
  if (!user) {
    throw new HttpError(401, 'Email or password invalid');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw new HttpError(401, 'Email or password invalid');
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });
  await updateDoctorToken(user._id, token);

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

const updateDoctor = async (doctor, id, picture) => {
  if (!id) {
    throw new Error('ID is required');
  }

  if (picture) {
    const pictureInfo = await saveFileToCloud(picture.path, 'doctors');
    return await doctorData.updateDoctor(id, { ...doctor, avatar: pictureInfo });
  }

  return await doctorData.updateDoctor(id, doctor);
};

const updatePassword = async (id, password) => {
  if (!id) {
    throw new Error('ID is required');
  }
  const hashPassword = await bcrypt.hash(password, 10);

  return await doctorData.updatePassword(id, hashPassword);
};

const deleteDoctor = async (id) => {
  if (!id) {
    throw new Error('ID is required');
  }

  return doctorData.deleteById(id);
};

const updateDoctorsToken = async (id, token) => {
  return doctorData.updateToken(id, token);
};

const addChat = async (id, chatId, mate) => {
  return doctorData.addChat(id, chatId, mate);
};

module.exports = {
  updatePassword,
  addChat,
  getDoctorById,
  loginDoctor,
  registerDoctor,
  updateDoctorsToken,
  getAllDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};
