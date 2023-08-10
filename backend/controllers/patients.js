const patientService = require('../services/patients');

const { HttpError, ctrlWrapper } = require('../helpers');

const register = async (req, res) => {
  console.log(req.body);
  const { email, password, phone, name } = req.body;

  const newUser = await patientService.registerPatient(email, password, phone, name);

  res.status(201).json({
    email: newUser.email,
    name: newUser.name,
  });
};

const getData = async (req, res) => {
  const id = req.params.id;
  console.log('id is: ' + id);
  const user = await patientService.getPatientById(id);
  console.log(user);

  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  res.status(200).json({
    name: user.name,
    avatar: user.avatarURL,
    email: user.email,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const loginResponse = await patientService.loginPatient(email, password);

  res.json(loginResponse);
};

const getCurrent = async (req, res) => {
  const { email, name } = req.user;

  res.status(200).json({
    email,
    name,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await patientService.updatePatientToken(_id, '');
  res.status(200).json({
    message: 'Logout success',
  });
};

const updateAvatar = async (req, res) => {
  const { _id: id } = req.user;

  if (!req.file) {
    throw new HttpError(400, 'No file');
  }

  if (!req.user) {
    throw new HttpError(401, 'User not authenticated');
  }

  const result = await patientService.updatePatientAvatar(id, req.file.path);

  if (!result) {
    throw new HttpError(404, 'User not found');
  }

  res.status(200).json(result);
};

const deleteAccount = async (req, res) => {
  const { id } = req.params;
  const result = await patientService.deletePatient(id);
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.json({
    message: 'Delete success',
  });
};

const getChats = async (req, res) => {
  const { id } = req.params;
  const result = await patientService.getPatientById(id);
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  console.log(result);
  res.json({
    chats: result.chats,
  });
};

const updatePassword = async (req, res) => {
  console.log(req.body);

  const doctor = await patientService.getPatientById(req.body.id);

  const patient = await patientService.getPatientById(req.body.id);

  const { id, password } = req.body;

  if (!patient) {
    throw new HttpError('404', 'User not Found');
  }

  await patientService.updatePassword(id, password);

  res.status(200).json({
    msg: 'Updated successfully',
  });
};
const updatePatient = async (req, res) => {
  const patient = patientService.getPatientById(req.body.id);

  const { id, name, email, avatar } = req.body;

  if (!patient) {
    throw new HttpError('404', 'User not Found');
  }

  await patientService.updatePatient(id, name, email);

  if (avatar) {
    await patientService.updatePatientAvatar(id, avatar);
  }

  res.status(200).json({
    msg: 'Updated successfully',
  });
};

module.exports = {
  updatePatient: ctrlWrapper(updatePatient),
  updatePassword: ctrlWrapper(updatePassword),
  getData: ctrlWrapper(getData),
  chats: ctrlWrapper(getChats),
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
  deleteAccount: ctrlWrapper(deleteAccount),
};
