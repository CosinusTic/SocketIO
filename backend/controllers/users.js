const express = require('express');
const usersController = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userModel = require("../models/users.js");
const channelModel = require("../models/channels.js");
const {Types} = require("mongoose");

usersController.use(express.json());

usersController.use(express.static(__dirname + '/public'))
    .use(express.urlencoded({extended: true}))
    .use(cors())
    .use(cookieParser());

usersController.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

/* ----- GET requests ----- */
const getAllUsers = async (req, res) => {
    const users = await userModel.find({});

    try {
        res.status(200).json(users);
    } catch(err){
        res.status(400).send(err);
    }
}
const getUserById = async (req, res) => {
    if (!Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send("Invalid ID format");
    }

    try {
        const user = await userModel.findById(req.params.id);
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).send(err);
    }
};


const getUserByUsername = async (req, res) => {
    const user = await userModel.findOne({username: req.params.username})

    try {
        res.status(200).json(user);
    } catch (err){
        res.status(400).send(err);
    }
}

const getUserChannels = async (req, res) => {
    const user = await userModel.findById(req.params.id);

    let channels = [];
    const channel_ids = user.channel_ids;
    if(channel_ids){
        for(const channel_id of channel_ids){
            channels.push(await channelModel.findOne({_id: channel_id}));
        }

        try {
            res.status(200).json(channels)
        } catch(err){
            console.log(err);
        }
    } else {
        try {
            res.status(200).json([])
        } catch(err){
            console.log(err);
        }
    }

}

/* ----- POST requests ----- */
const addUser = async (req, res) => {
    let user = await userModel.create(req.body);
    const channelFields = {
        admin_id: "65afcd68254f18580b747c16",
        creation_date: "2024-01-23T12:34:56.000+00:00",
        name: `${user.id}_default`
    };
    const defaultChannel = await channelModel.create(channelFields);
    user = await userModel.findByIdAndUpdate(user.id, {$push: {channel_ids: defaultChannel._id}});
    
    try {
        await user.save();
        await defaultChannel.save();
        res.status(201).json({outcome: "success", user_created: user, default_channel: defaultChannel})
    } catch(err){
        res.status(400).send(err);
    }
}


/* ----- PUT requests ----- */
const modifyUser = async (req, res) => {
    const user = await userModel.findOneAndUpdate({_id: req.params.id}, req.body);

    try {
        await user.save();
        res.status(200).json({outcome: "success", new_user_information: req.body});
    } catch(err){
        res.status(400).send(err);
    }
}

/* ----- DELETE requests ----- */
const deleteUser = async (req, res) => {
    await userModel.findOneAndDelete({username: req.params.username});

    try {
        res.status(200).json({outcome: "user deleted", user_deleted: req.params.username});
    } catch(err){
        res.status(400).send(err);
    }
    
}

module.exports = {
    getUserByUsername,
    getAllUsers, 
    getUserById,
    getUserChannels,
    addUser, 
    modifyUser, 
    deleteUser
};