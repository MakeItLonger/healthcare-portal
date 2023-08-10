const newsModel = require('../models/news.js');

const getAllNews = async (aggregationPipeline, matchStage) => {
  const [news, total] = await Promise.all([
    newsModel.aggregate(aggregationPipeline),
    newsModel.countDocuments(matchStage),
  ]);

  return { news, total };
};

const getLimitedNews = async (limit) => {
  return await newsModel.find({}).limit(limit);
};

const createNews = async (news) => {
  return await newsModel.create(news);
};

const updateNews = async (id, news) => {
  return await newsModel.findByIdAndUpdate(id, news, { new: true });
};

const deleteNews = async (id) => {
  return await newsModel.findByIdAndDelete(id);
};

module.exports = {
  getAllNews,
  getLimitedNews,
  createNews,
  updateNews,
  deleteNews,
};
