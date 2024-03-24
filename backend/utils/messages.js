const messageModel = require("../models/messages.js");

async function checkMessageIdExists(req, res, next){
    const message = await messageModel.findById(req.params.messageId);

    if(message != null){
        next();
    } else {
        res.status(400).json({error: "Message not found"});
    }
}

module.exports = {
    checkMessageIdExists
}