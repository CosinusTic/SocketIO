const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const channelsRoutes = express();
const channelController = require("../controllers/channels.js");
const validRequest = require("../middleware/validRequest");
const channel = require("../models/channels.js");
const channelSchema = channel.schema.obj;
const utils = require("../utils/utils.js");

channelsRoutes.use(express.json());

channelsRoutes.use(express.static(__dirname + '/public'))
    .use(express.urlencoded({extended: true}))
    .use(cors())
    .use(cookieParser());

channelsRoutes.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

channelsRoutes.get("/channels/all/", channelController.getAllChannels);
channelsRoutes.get("/channels/:id/", utils.channelsUtil.checkChannelIdExists, channelController.getChannelById);
channelsRoutes.get("/channels/name/:name/", utils.channelsUtil.checkChannelNameExists, channelController.getChannelByName);

channelsRoutes.post("/channels/add/", validRequest.check(channelSchema) /*utils.channelsUtil.checkDuplicate*/, channelController.addChannel);
channelsRoutes.post("/channels/createnew/", channelController.createPrivateChannel);

channelsRoutes.get("/channels/allUsers/:channel_id", utils.channelsUtil.checkChannelIdExistsAlt, channelController.getAllUsersOfThisChannel);

channelsRoutes.post("/channels/add/", validRequest.check(channelSchema), channelController.addChannel);

channelsRoutes.put("/channels/modify/:id/", utils.channelsUtil.checkChannelIdExists, channelController.modifyChannel);

channelsRoutes.delete("/channels/delete/:name/",utils.channelsUtil.checkChannelNameExists, channelController.deleteChannel);


channelsRoutes.delete("/channels/deleteName/:name/", utils.channelsUtil.checkChannelNameExists, channelController.deleteChannelByName);

channelsRoutes.post("/channels/createnew/", channelController.createPrivateChannel);


module.exports = channelsRoutes;