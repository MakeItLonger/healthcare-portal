const { Patient } = require("../models/patient.js");
const getAll = () => {
  return Patient.find();
};

const getById = (id) => {
  return Patient.findOne({ _id: id });
};

const getByEmail = (email) => {
  return Patient.findOne({ email: email });
};

const create = (patient) => {
  return new Patient(patient).save();
};

const updateToken = (id, token) => {
  return Patient.findByIdAndUpdate(id, { token });
};

const deleteById = (id) => {
  return Patient.findByIdAndRemove(id);
};

const addChat = async(id, chatId, mate) => {
  return Patient.updateOne({_id: id}, {
    $push: {
      chats: { chatId: chatId, mate: mate},
    }
  })
}

const updatePatientAvatar = async (id, avatarPath) => {
  const patient = await getById(id);

  if (!patient) {
    throw new HttpError(404, "User not found");
  }

  const updatedPatient = await Patient.findByIdAndUpdate(
    id,
    { $set: { avatarURL: avatarPath } },
    { new: true }
  );

  return updatedPatient;
};

const updatePatient = async (id, name, email) => {
  const patient = await getById(id);

  if (!patient) {
    throw new HttpError(404, "User not found");
  }

  return Patient.findByIdAndUpdate(
      id,
      {$set: {name: name, email: email}},
      {new: true}
  );
};

const updatePassword = async (id, password) => {
  const patient = await getById(id);

  if (!patient) {
    throw new HttpError(404, "User not found");
  }

  return Patient.findByIdAndUpdate(
      id,
      {$set: {password: password}},
      {new: true}
  );
};


module.exports = {
  updatePatient,
  updatePassword,
  addChat,
  getAll,
  getById,
  getByEmail,
  create,
  updateToken,
  deleteById,
  updatePatientAvatar
};
