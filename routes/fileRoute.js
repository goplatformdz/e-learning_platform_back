const express = require('express');
const router = express.Router();
const { uploadFile, getPdfById, getAllPdfs, updateFile, grantAccess, uploadMultFile } = require("../controllers/fileCtrl");

const upload = require('../fileUtils/multer');

// Define a route for file upload
router.get('/find/:id', getPdfById);
router.get('/findAll', getAllPdfs);
router.post('/upload', upload.single('pdf'), uploadFile);
router.post('/uploadMult', upload.array('pdf'), uploadMultFile);
router.put('/update/:id', updateFile);
router.post('/grant-access', grantAccess);


module.exports = router;