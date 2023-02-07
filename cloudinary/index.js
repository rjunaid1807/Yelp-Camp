const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

const storage = new CloudinaryStorage({             // Setting up an instance with cloudinary
    cloudinary,                                     // cloudinary object that we CONFIGURED above
    params: {
        folder: 'YelpCamp',
        allowedFormats: ['jpeg', 'jpg', 'png']
    }
})

module.exports = { cloudinary, storage }