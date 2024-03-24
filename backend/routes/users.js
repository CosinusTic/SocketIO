const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const usersRoutes = express();
const usersController = require("../controllers/users.js");
const validRequest = require("../middleware/validRequest.js");
const user = require('../models/users.js');
const userSchema = user.schema.obj;
const utils = require("../utils/utils.js");

usersRoutes.use(express.json());

usersRoutes.use(express.static(__dirname + '/public'))
    .use(express.urlencoded({extended: true}))
    .use(cors())
    .use(cookieParser());

usersRoutes.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

usersRoutes.get("/users/all/", usersController.getAllUsers);
usersRoutes.get("/users/username/:username/", usersController.getUserByUsername);
usersRoutes.get("/users/id/:id/", utils.usersUtil.checkUserExistsId, usersController.getUserById);
usersRoutes.get("/users/:id/channels"/*, utils.usersUtil.checkUserExistsId*/, usersController.getUserChannels);

usersRoutes.post("/users/add/", validRequest.check(userSchema), utils.usersUtil.checkDuplicate, usersController.addUser);

usersRoutes.put("/users/modify/:id/", utils.usersUtil.checkUserExistsId, utils.usersUtil.checkDuplicate,     usersController.modifyUser);

usersRoutes.delete("/users/delete/:username/", utils.usersUtil.checkUserExistsUsername, usersController.deleteUser);

module.exports = usersRoutes;