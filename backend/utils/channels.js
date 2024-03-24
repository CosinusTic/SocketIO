const channelModel = require("../models/channels.js");

async function checkDuplicate(req, res, next){
    const channel = await channelModel.findOne({name: req.body.name});

    if(channel != null){
        next();
    } else{
        res.status(400).json({error: "Channel already exits"});
    }
}

async function checkChannelIdExists(req, res, next){
    const channel = await channelModel.findById(req.params.id);

    if(channel != null){
        next();
    } else {
        res.status(400).json({error: "Channel not found"});
    }
}

async function checkChannelIdExistsAlt(req, res, next){
    const channel = await channelModel.findById(req.params.channel_id);

    if(channel != null){
        next();
    } else {
        res.status(400).json({error: "Channel not found"});
    }
}

async function checkChannelNameExists(req, res, next){
    const channel = await channelModel.findOne({name: req.params.name});

    if(channel != null){
        next();
    } else {
        res.status(400).json({error: "Channel not found"})
    }
}

module.exports = {
    checkDuplicate, 
    checkChannelIdExists,
    checkChannelIdExistsAlt,
    checkChannelNameExists
}