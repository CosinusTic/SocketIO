const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema({
    admin_id: {
        type: String, 
        required: true
    }, 
    creation_date: {
        type: Date, 
        required: true
    }, 
    name: {
        type: String, 
        required: true
    }
});

const channelModel = mongoose.model("channels", channelSchema);
module.exports = channelModel;