const { Doctor } = require('../models/doctor.js');
;

const getAllDoctors = async (aggregationPipeline, matchStage) => {
  const [doctors, total] = await Promise.all([
    Doctor.aggregate(aggregationPipeline),
    Doctor.countDocuments(matchStage),
  ]);

  return { doctors, total };
};

const getAll = () => {
  return Doctor.find();
};

const getById = (id) => {
  return Doctor.findOne({ _id: id });
};

const getByEmail = (email) => {
  return Doctor.findOne({ email: email });
};

const updateToken = (id, token) => {
  return Doctor.findByIdAndUpdate(id, { token });
};

const deleteById = (id) => {
  return Doctor.findByIdAndRemove(id);
};
const getLimitedDoctors = async (limit) => {
  return Doctor.find({}).limit(limit);
};

const createDoctor = async (doctor) => {
  return Doctor.create(doctor);
};

const updateDoctor = async (id, doctor) => {
  return Doctor.findByIdAndUpdate(id, doctor, { new: true });
};

const updatePassword = async (id, password) => {
  return Doctor.findByIdAndUpdate(id, {$set: {password: password}}, {new: true});
};

const addChat = async(id, chatId, mate) => {
  return Doctor.updateOne({_id: id}, {
    $push: {
      chats: { chatId: chatId, mate: mate},
      notifications: { msg:"Patient need help", link: 'chat/'+ chatId }
    }
  })
}

module.exports = {
  updatePassword,
  addChat,
  getAll,
  getById,
  getByEmail,
  deleteById,
  updateToken,
  getAllDoctors,
  getLimitedDoctors,
  createDoctor,
  updateDoctor,
};
