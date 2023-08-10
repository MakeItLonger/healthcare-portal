const express = require('express');
const registrationPendingController = require('../controllers/registrationPending.js');

const registrationPendingRouter = express.Router();

registrationPendingRouter.get('/', registrationPendingController.getAllPendingRegistration);

registrationPendingRouter.get('/check', registrationPendingController.checkForToken);

registrationPendingRouter.post('/', registrationPendingController.createNewPendingRegistration)

registrationPendingRouter.delete("/:id", registrationPendingController.delete)

module.exports = registrationPendingRouter;
