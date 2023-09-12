const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    chatroom_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chatroom',
        required: true
    },
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;