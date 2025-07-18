// cloudconfig.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'wanderlust_DEV',
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
      transformation: [{ width: 800, height: 600, crop: "limit" }],
      resource_type: 'image', // Optional but recommended
    };
  },
});

module.exports = { cloudinary, storage };
