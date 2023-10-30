const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
    fileName: { type: String, required: true, unique: false },
    fileRef: { type: String, required: true, unique: true },
    fileUrl: { type: String, required: true, unique: true },
    allowedUsers: { type: Array, default: ["adminId"] }
}, { timestamps: true }
);

module.exports = mongoose.model("File", FileSchema);