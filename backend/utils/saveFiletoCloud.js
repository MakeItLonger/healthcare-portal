require('dotenv').config();

const { cloudinary } = require('./cloudinary.js');

async function saveFileToCloud(path, folder) {
  const cloud = await cloudinary.uploader.upload(path, {
    folder: folder,
    resource_type: 'image',
    width: 300,
    height: 350,
    crop: 'fit',
  });

  return {
    public_id: cloud.public_id,
    url: cloud.secure_url,
  };
}

module.exports = {
  saveFileToCloud,
};
