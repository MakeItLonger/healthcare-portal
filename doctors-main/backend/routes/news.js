const express = require('express');
const upload = require('../utils/multer.js');
const newsController = require('../controllers/news.js');

const newsRouter = express.Router();

newsRouter.get('/', newsController.getAllNews);
newsRouter.post('/', upload.single('picture'), newsController.createNews);
newsRouter.put('/:id', upload.single('picture'), newsController.updateNews);
newsRouter.delete('/:id', newsController.deleteNews);

module.exports = newsRouter;
