const userModel = require("../models/users.js");

async function checkDuplicate(req, res, next) {
    const user = await userModel.findOne({ username: req.body.username });;

    if (user) {
        if (req.body._id && user._id == req.body._id) {
            next();
        } else {
            res.status(400).json({ error: "Username already exists" });
        }
    } else {
        next();
    }
}

async function checkDuplicateWithIdParam(req, res, next){
    const user = await userModel.findById(req.params.id);

    if(user == null){
        next();
    }
    else{
        res.status(400).json({error: "User already exits"});
    }
}

async function checkUserExistsId(req, res, next){
    const user = await userModel.findById(req.params.id);

    if(user != null){
        next();
    } else {
        res.status(400).json({error: "User not found"});
    }
}

async function checkUserExistsUsername(req, res, next){
    const user = await userModel.findOne({username: req.params.username});

    if(user != null){
        next();
    } else {
        res.status(400).json({error: "User not found"});
    }
}

module.exports = {
    checkDuplicate,
    checkDuplicateWithIdParam, 
    checkUserExistsId, 
    checkUserExistsUsername
}