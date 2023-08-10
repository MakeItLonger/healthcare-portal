require('dotenv').config();
const newsData = require('../data/news.js');
const { saveFileToCloud } = require('../utils/saveFiletoCloud.js');

const getAllNews = async (search, limit, page, sort) => {
  const matchStage = {
    $or: [{ title: { $regex: search, $options: 'i' } }, { content: { $regex: search, $options: 'i' } }],
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

  return await newsData.getAllNews(aggregationPipeline, matchStage, sortStage);
};

const createNews = async (news, picture) => {
  const pictureInfo = await saveFileToCloud(picture.path, 'news');

  return await newsData.createNews({ ...news, picture: pictureInfo });
};

const updateNews = async (news, id, picture) => {
  if (!id) {
    throw new Error('ID is required');
  }

  if (picture) {
    const pictureInfo = await saveFileToCloud(picture.path, 'news');
    return await newsData.updateNews(id, { ...news, picture: pictureInfo });
  }

  return await newsData.updateNews(id, news);
};

const deleteNews = async (id) => {
  if (!id) {
    throw new Error('ID is required');
  }

  const news = await newsData.deleteNews(id);

  return news;
};

module.exports = {
  getAllNews,
  createNews,
  updateNews,
  deleteNews,
};
