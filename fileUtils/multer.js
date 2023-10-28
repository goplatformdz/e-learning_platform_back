// Pdf upload
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require("./cloudinary");

// Configure Multer to upload files to Cloudinary
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'pdf-uploads',
        allowed_formats: ['pdf'],
    },
});

const upload = multer({ storage });

module.exports = upload;