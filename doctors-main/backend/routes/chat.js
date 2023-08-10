const express = require('express');

const ctrl = require('../controllers/chat.js');

const chatRouter = express.Router();

chatRouter.post("/", ctrl.createChat);
chatRouter.delete("/:id", ctrl.delete);
chatRouter.get('/:id', ctrl.getChat);

module.exports = chatRouter