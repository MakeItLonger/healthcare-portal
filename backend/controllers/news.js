const newsService = require('../services/news.js');
const { ctrlWrapper } = require('../helpers');

const getAllNews = async (req, res) => {
  let { search = '', limit = 5, page = 0, sort = 'createdAt' } = req.query;
  limit = parseInt(limit);

  if (page !== 0) {
    page = parseInt(page) - 1;
  }

  const news = await newsService.getAllNews(search, limit, page, sort);

  return res.status(200).json(news);
};

const createNews = async (req, res) => {
  const news = await newsService.createNews(req.body, req.file);
  res.status(201).json(news);
};

const updateNews = async (req, res) => {
  const updatedNews = await newsService.updateNews(req.body, req.params.id, req.file);
  return res.status(200).json(updatedNews);
};

const deleteNews = async (req, res) => {
  const news = await newsService.deleteNews(req.params.id);
  return res.status(201).json(news);
};

module.exports = {
  getAllNews: ctrlWrapper(getAllNews),
  createNews: ctrlWrapper(createNews),
  updateNews: ctrlWrapper(updateNews),
  deleteNews: ctrlWrapper(deleteNews),
};
