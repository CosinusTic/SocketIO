const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const messagesRoutes = express();
const messagesController = require("../controllers/messages.js");
const validRequest = require("../middleware/validRequest.js");
const message = require('../models/messages.js');
const messages = require("../models/messages.js");
const messageSchema = message.schema.obj;
const utils = require("../utils/utils.js");

messagesRoutes.use(express.json());

messagesRoutes.use(express.static(__dirname + '/public'))
    .use(express.urlencoded({extended: true}))
    .use(cors())
    .use(cookieParser());

messagesRoutes.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

messagesRoutes.get("/messages/all/", async (req, res) => await messagesController.getAllMessages(req, res));
messagesRoutes.get("/messages/by_channel/:channel_id", utils.channelsUtil.checkChannelIdExistsAlt, messagesController.getMessagesByChannel);

messagesRoutes.post("/messages/add/", validRequest.check(messageSchema), messagesController.addMessage);

messagesRoutes.post("/messages/all/add/", messagesController.addMessages);

messagesRoutes.put("/messages/modify/:messageId/", messagesController.modifyMessage);

messagesRoutes.delete("/messages/delete/:messageId/", utils.messageUtils.checkMessageIdExists, messagesController.deleteMessage);
messagesRoutes.delete("/messages/delete_all/", messagesController.deleteAllMessages);

module.exports = messagesRoutes;