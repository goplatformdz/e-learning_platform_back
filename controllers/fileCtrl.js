const File = require("../models/fileModel");


// GET ONE FILE:
const getPdfById = async (req, res) => {
    const publicId = req.params.id;
    const file = await File.find({ _id: publicId });
    if (!file) {
        return res.status(400).json({ error: 'There is no file with this Id' });
    }
    res.json({ file });
}

// GET ALL FILES
const getAllPdfs = async (req, res) => {
    try {
        const files = await File.find();
        res.status(200).json(files);
    } catch (error) {
        res.status(400).json(error);
    }


}

// UPLOAD FILE:
const uploadFile = async (req, res) => {
    // Ensure a file was uploaded
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    // Extract the public ID from the file path
    const filePath = req.file.filename;
    const parts = filePath.split('/'); // Split the path by '/'
    const publicId = parts[parts.length - 1]; // Get the last part

    const newFile = new File({
        fileName: req.file.originalname,
        fileRef: publicId,
        fileUrl: req.file.path,
    })

    try {
        const savedFile = await newFile.save();
        res.json({ savedFile });
    } catch (error) {
        res.status(500).json({ error });
    }
};


// UPDATE FILE:
const updateFile = async (req, res) => {
    try {
        const updatedFile = await File.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });
        res.status(200).json(updatedFile);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Generate the acccess to the file
const grantAccess = async (req, res) => {
    const { fileId, userId } = req.body;

    try {
        // Find the PDF file by fileId
        const file = await File.findById(fileId);

        if (!file) {
            return res.status(404).json({ error: 'PDF file not found' });
        }

        // Check if the user has access to the file
        if (file.allowedUsers.includes(userId)) {
            return res.json({ message: 'Access granted', file });
        } else {
            return res.status(403).json({ error: 'Access denied' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { uploadFile, getPdfById, getAllPdfs, updateFile, grantAccess }