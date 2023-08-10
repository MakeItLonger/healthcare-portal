const express = require('express');
const upload = require('../utils/multer.js');
const serviceController = require('../controllers/services.js');

const servicesRouter = express.Router();

servicesRouter.get('/', serviceController.getAllServices);
servicesRouter.post('/', upload.single('picture'), serviceController.createService);
servicesRouter.put('/:id', upload.single('picture'), serviceController.updateService);
servicesRouter.delete('/:id', serviceController.deleteService);

module.exports = servicesRouter;
