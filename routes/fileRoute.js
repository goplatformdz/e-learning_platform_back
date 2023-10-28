const express = require('express');
const router = express.Router();
const { uploadFile } = require("../controllers/fileCtrl");

const upload = require('../fileUtils/multer');

// Define a route for file upload
router.post('/upload', upload.single('pdf'), uploadFile);


module.exports = router;