const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    }, 
    author_username: {
        type: String, 
        required: true
    },
    creation_date: {
        type: String, 
        required: true
    },
    channel_id: {
        type: String, 
        required: true
    }
});

const messageModel = mongoose.model("messages", messageSchema);
module.exports = messageModel;