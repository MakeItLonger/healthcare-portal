const serviceModel = require('../models/service.js');

const getAllServices = async (aggregationPipeline, matchStage) => {
  const [services, total] = await Promise.all([
    serviceModel.aggregate(aggregationPipeline),
    serviceModel.countDocuments(matchStage),
  ]);

  return { services, total };
};

const getLimitedServices = async (limit) => {
  return await serviceModel.find({}).limit(limit);
};

const createService = async (service) => {
  return await serviceModel.create(service);
};

const updateService = async (id, service) => {
  return await serviceModel.findByIdAndUpdate(id, service, { new: true });
};

const deleteService = async (id) => {
  return await serviceModel.findByIdAndDelete(id);
};

module.exports = {
  getAllServices,
  getLimitedServices,
  createService,
  updateService,
  deleteService,
};
