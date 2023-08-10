require('dotenv').config();
const serviceData = require('../data/services.js');
const { saveFileToCloud } = require('../utils/saveFiletoCloud.js');

const getAllServices = async (search, limit, page, sort, title) => {
  const matchStage = {
    title: { $regex: title, $options: 'i' },
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

  return await serviceData.getAllServices(aggregationPipeline, matchStage, sortStage);
};

const createService = async (service, picture) => {
  const pictureInfo = await saveFileToCloud(picture.path, 'services');

  return await serviceData.createService({ ...service, picture: pictureInfo });
};

const updateService = async (service, id, picture) => {
  if (!id) {
    throw new Error('ID is required');
  }

  if (picture) {
    const pictureInfo = await saveFileToCloud(picture.path, 'services');
    return await serviceData.updateService(id, { ...service, picture: pictureInfo });
  }

  return await serviceData.updateService(id, service);
};

const deleteService = async (id) => {
  if (!id) {
    throw new Error('ID is required');
  }

  const service = await serviceData.deleteService(id);

  return service;
};

module.exports = {
  getAllServices,
  createService,
  updateService,
  deleteService,
};
