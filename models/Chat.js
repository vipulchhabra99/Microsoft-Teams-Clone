const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    name : {
        type: String,
        required: true
    },
    message : {
        type: String,
        required: true
    }
});

const Chat = mongoose.model('Chat', ChatSchema);

module.exports = Chat;
