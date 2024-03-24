const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true
    }, 
    channel_ids: {
        type: Array, 
        required: true
    }
});

const userModel = mongoose.model("users", UserSchema);
module.exports = userModel;