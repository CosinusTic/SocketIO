const express = require('express');
const channelsController = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const channelModel = require('../models/channels.js');
const userModel = require('../models/users.js');
const messageModel = require("../models/messages.js");
const userController = require("../controllers/users.js");
/*const { default: duplicateCheck } = require('../utils/duplicateCheck.js');*/
const mongoose = require('mongoose');
channelsController.use(express.json());

channelsController.use(express.static(__dirname + '/public'))
    .use(express.urlencoded({extended: true}))
    .use(cors())
    .use(cookieParser());

channelsController.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

/* ----- GET requests ----- */

const getAllChannels = async (req, res) => {
    const channels = await channelModel.find();

    try {
        res.status(200).json(channels);
    } catch(err){
        res.status(400).send(err);
    }
};

const getChannelById = async (req, res) => {
    const channel = await channelModel.findById(req.params.id);
    try {
        if (channel != null) {
            res.status(200).json(channel);
        } else {
            res.status(400).json({error: "channel undefined"})
        }
    } catch (err) {
        res.status(400).send(err);
    }
};

const getChannelByName = async (req, res) => {
    const channel = await channelModel.findOne( { name : req.params.name });
    try {
        if (channel != null) {
            res.status(200).json(channel);
        } else {
            res.status(400).json({error: "channel undefined"})
        }
    } catch (err) {
        res.status(400).send(err);
    }
};

const getAllUsersOfThisChannel = async (req, res) => {
    let filter = {};
    if (req.params.channel_id) {
        try {
            const channelId = new mongoose.Types.ObjectId(req.params.channel_id);
            filter = { "channel_ids": channelId };
        } catch (err) {
            return res.status(400).send("Invalid channel ID format");
        }
    }

    try {
        const users = await userModel.find(filter);
        res.status(200).json(users);
    } catch (err) {
        res.status(400).send(err);
    }
};

/* ----- POST requests ----- */
const addChannel = async (req, res) => {
    try {
        const channel = await channelModel.create(req.body);
        res.status(201).json({ outcome: "success", channel_created: channel });
    } catch (err) {
        console.error(err); // It's good practice to log the error for debugging.
        res.status(400).json({ outcome: "error", message: err.message });
    }
};


/* ----- PUT requests ----- */
const modifyChannel = async (req, res) => {
    const channel = await channelModel.findOneAndUpdate({_id: req.params.id}, req.body);

    try {
        await channel.save();
        res.status(200).json({outcome: "success", new_channel_information: req.body});
    } catch(err){
        res.status(400).send(err);
    }
};


/* ----- DELETE requests ----- */

/* in channel deletion, loop through channel users 
and channel_ids, and pop the channel_id out of 
its channels if it's equal */
const deleteChannel = async (req, res) => {
    const channelToDelete = await channelModel.findOne({name: req.params.name});
    if(channelToDelete){
        if(channelToDelete.id === req.body.channel_id){
            res.status(404).json({
                success: false,
                error: "Error deleting channel",
                message: "You cannot delete a channel you're in"
            });
        } else{
            await messageModel.deleteMany({ channel_id: channelToDelete._id });
            const channelUsers = await userModel.find({ channel_ids: channelToDelete._id });

            try {
                await Promise.all(channelUsers.map(channelUser =>
                    userModel.findByIdAndUpdate(
                        channelUser._id,
                        { $pull: { channel_ids: channelToDelete._id } },
                        { new: true, runValidators: true }
                    )
                ));
                await channelModel.findByIdAndDelete(channelToDelete._id);
                res.status(200).json({ outcome: "channel deleted", channel_deleted: channelToDelete });
            } catch (err) {
                res.status(400).send(err);
            }
        }
    } else {
        res.status(404).json({
            success: false,
            error: "Error deleting channel",
            message: "Channel not found. Please check the channel name and try again"
        });
    }
};

const deleteChannelByName = async (req, res) => {
    const channelToDelete = await channelModel.findOneAndDelete({name: req.params.name});

    if (channelToDelete) {
        await messageModel.deleteMany({channel_id: channelToDelete._id});

        try {
            res.status(200).json({outcome: "channel deleted", channel_deleted: channelToDelete._id});
        } catch(err){
            res.status(400).send(err);
        }
    } else {
        res.status(404).send("Channel not found");
    }
};

const createPrivateChannel = async(req, res) => {
    const { channel, user } = req.body;

    const userId = user._id;
    try {
        var alreadyExists = await channelModel.findOne({ name: channel.name });
        if (alreadyExists === null) {
            const channelResponse = await channelModel.create(channel);

            const newChannelId = channelResponse._id;
            const userResponse = await userModel.findByIdAndUpdate(
                userId, // Use the userId as is if it's in the correct format; otherwise, convert as needed
                { $push: { channel_ids: newChannelId } },
                { new: true, runValidators: true }
            );

            res.status(201).json({ outcome: "success", channel_created: channelResponse, user_updated: userResponse });
        } else {
            res.status(409).send("channel already exists");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred");
    }
};

module.exports = {
    getAllChannels,
    getChannelById,
    getChannelByName,
    getAllUsersOfThisChannel,
    addChannel,
    modifyChannel,
    deleteChannel,
    deleteChannelByName,
    createPrivateChannel
}