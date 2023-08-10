const serviceService = require('../services/services.js');
const { ctrlWrapper } = require('../helpers');

const getAllServices = async (req, res) => {
  let { search = '', limit = 5, page = 0, sort = 'title', title = '' } = req.query;
  limit = parseInt(limit);

  if (page !== 0) {
    page = parseInt(page) - 1;
  }

  const services = await serviceService.getAllServices(search, limit, page, sort, title);

  return res.status(200).json(services);
};

const createService = async (req, res) => {
  const service = await serviceService.createService(req.body, req.file);
  res.status(201).json(service);
};

const updateService = async (req, res) => {
  const updatedService = await serviceService.updateService(req.body, req.params.id, req.file);
  return res.status(200).json(updatedService);
};

const deleteService = async (req, res) => {
  const service = await serviceService.deleteService(req.params.id);
  return res.status(201).json(service);
};

module.exports = {
  getAllServices: ctrlWrapper(getAllServices),
  createService: ctrlWrapper(createService),
  updateService: ctrlWrapper(updateService),
  deleteService: ctrlWrapper(deleteService),
};
