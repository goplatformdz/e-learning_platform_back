

const uploadFile = (req, res) => {
    res.json({ message: 'File uploaded successfully', url: req.file.path });
};

module.exports = { uploadFile }