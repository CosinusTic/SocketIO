const express = require('express');
const messagesController = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const messageModel = require('../models/messages.js');
messagesController.use(express.json());

messagesController.use(express.static(__dirname + '/public'))
    .use(express.urlencoded({extended: true}))
    .use(cors())
    .use(cookieParser());

messagesController.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});


/* ----- GET requests ----- */
const getAllMessages = async (req, res) => {
    try {
        const messages = await messageModel.find();
        res.status(200).json(messages);
    } catch(err) {
        res.status(400).send(err);

    }
}

const getMessagesByChannel = async (req, res) => {
    const messages = await messageModel.find({channel_id: req.params.channel_id})

    try {
        res.status(200).json(messages);
    } catch(err){
        res.status(400).send(err);
    }
}


/* ----- POST requests ----- */
const addMessage = async (req, res) => {
    const message = await messageModel.create(req.body);

    try {
        await message.save();
        res.status(201).json({outcome: "success", message_created: req.body})
    } catch(err){
        res.status(400).send(err);
    }
}

const addMessages = async (buffer) => {
    buffer.forEach(async (message) => {
        const messageToCreate = await messageModel.create(message);
        await messageToCreate.save();
        return messageToCreate;
    })
}



/* ----- PUT requests ----- */
const modifyMessage = async (req, res) => {
    await messageModel.findOneAndUpdate({messageId: req.params.messageId}, req.body);

    try {
        res.status(200).json({outcome: "success", new_message: req.body});
    } catch(err){
        res.status(400).send(err);
    }
}


/* ----- DELETE requests ----- */
const deleteMessage = async (req, res) => {
    await messageModel.findOneAndDelete({messageId: req.params.messageId});

    try {
        res.status(200).json({outcome: "message deleted", message_deleted: req.params.messageId});
    } catch(err){
        res.status(400).send(err);
    }
    
}

// admin functions
const deleteAllMessages = async (req, res) => {
    await messageModel.deleteMany({});
    try {
        res.status(200).json({"success": "deleted all messages"});
    } catch(err){
        console.log(err);
    }
}

module.exports = {
    getAllMessages, 
    getMessagesByChannel,
    addMessage, 
    addMessages,
    modifyMessage, 
    deleteMessage, 
    deleteAllMessages
};
