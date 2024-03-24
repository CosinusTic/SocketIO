import Api from "./Api";

const isLoggedIn = () => {
    return localStorage.getItem("username") && localStorage.getItem("id");
};

const logout = (navigate) => {
    localStorage.clear();
    navigate("/login");
}

const navigateHome = (navigate) => {
    navigate("/");
}

const actualDate = () => {
    return new Date().toISOString();
}

const isSentByBot = (content, channel_id, socket) => {
    const author_username = "BOT";
    const creation_date = actualDate();
    socket.current.emit('chat message', { author_username, content , channel_id, creation_date });
}

const nick = async (value, channel_id, socket) => {
    let content;
    let remaining;
    if(value.trim().replaceAll(" ", "").length > 5){
        const req = await Api.Users.modifyUser( { username: value.trim().replaceAll(" ","").substring(5, value.trim().replaceAll(" ","").length) },  localStorage.getItem('id'));
        remaining = value.substring(6).trimStart();
        if(req.outcome === 'success'){
            content = `User ${localStorage.getItem('username')} changed his username to ${remaining}`;
            localStorage.setItem('username', remaining);
            isSentByBot(content,channel_id,socket);
        } else {
            content = "Couldn't change the username to " + remaining;
            isSentByBot(content,channel_id,socket);
        }
    } else {
        content = "Please enter a username if you want to change yours";
        isSentByBot(content,channel_id,socket);
    }
}

const list = async (value, channel_id, socket) => {
    let content;
    const req = await Api.Channels.getAllChannels();
    let temp = "";
    if (value.trim().replaceAll(" ", "").length > 5) {
        const remaining = value.trim().replaceAll(" ", "").substring(5);
        temp = req.filter(channel => channel.name.includes(remaining))
            .map(channel => channel.name)
            .join(", ");
    } else {
        temp = req.map(channel => channel.name).join(", ");
    }
    if(temp){
        content = temp;
    }else{
        content = "There is no channel containing the string you gave"
    }
    isSentByBot(content,channel_id, socket);
}

const create = async (value, channel_id, socket) => {
    let temp = "";
    let req = "";
    let reqUser = "";
    let modifyUser = "";
    let content;
    let creation_date;
    if (value.trim().replaceAll(" ", "").length > 8) {
        const remaining = value.substring(7).trimStart();
        creation_date = actualDate();
        const body = {
            admin_id: localStorage.getItem('id'),
            creation_date: creation_date,
            name: remaining
        };
        req = await Api.Channels.addChannel(body);
        reqUser = await Api.Users.getUserById(localStorage.getItem('id'));
        if (!reqUser.error){
            content = `Channel ${remaining} created by ${localStorage.getItem('username') ? localStorage.getItem('username')  : "a user" }`;
        }
    } else {
        content = "Please enter a channel name if you want to create one";
    }
    isSentByBot(content,channel_id,socket);
    window.location.reload();
}

const join = async (value, channel_id, socket) => {
    let content = "";
    if(value.trim().replaceAll(" ", "").length > 5){
        const remaining = value.substring(5).trimStart();
        try {
            const req = await Api.Channels.getChannel(remaining);
            if (req.error){
                content = "Cannot join the specified channel";
                isSentByBot(content, channel_id, socket);
            }else{
                const user = await Api.Users.getUserById(localStorage.getItem('id'));
                if (!user.error){
                    if(!user.channel_ids.includes(req._id)){
                        user.channel_ids.push(req._id);
                        const send = await Api.Users.modifyUser(user, localStorage.getItem('id'));
                        if(send.error){
                            content = "Cannot add the channel to the user info";
                            isSentByBot(content, channel_id, socket);
                        } else {
                            content = `Channel ${remaining} joined by ${localStorage.getItem('id')}`;
                            isSentByBot(content, channel_id, socket);
                            window.location.reload();
                            return req;
                        }
                    }
                } else {
                    content = "Cannot get the user info, try to log out and log back in";
                    isSentByBot(content, channel_id, socket);
                }
            }
        } catch (e) {
            alert(e);
        }
    } else {
        content = "Please enter a channel name if you want to join one";
        isSentByBot(content,channel_id,socket);
    }
}

const deletes = async (value, channel_id, socket) => {
    let temp = "";
    let req = "";
    let content;
    if (value.trim().replaceAll(" ", "").length > 8) {
        const remaining = value.substring(7).trimStart();
        req = await Api.Channels.deleteChannelByName(remaining, channel_id);
        if(req.success === false) {
            content = "Failed to delete the channel. " + req.message;
        }else{
            const user = await Api.Users.getUserById(localStorage.getItem('id'));
            if (!user.error){
                if(user.channel_ids.includes(req._id)){
                    user.channel_ids.splice(user.channel_ids.indexOf(req._id));
                    const send = await Api.Users.modifyUser(user, localStorage.getItem('id'));
                    if(send.error){
                        content = "Cannot delete the channel from the user info";
                        isSentByBot(content, channel_id, socket);
                    } else {
                        content = `Channel ${remaining} deleted by ${localStorage.getItem('username') ? localStorage.getItem('username') : "a user"}`;
                        isSentByBot(content, channel_id, socket);
                        window.location.reload();
                    }
                } else {
                    content = `Channel ${remaining} deleted by ${localStorage.getItem('username') ? localStorage.getItem('username') : "a user"}`;
                    isSentByBot(content, channel_id, socket);
                    window.location.reload();
                }
            } else {
                content = "Cannot get the user info, try to log out and log back in";
                isSentByBot(content, channel_id, socket);
            }
        }
    } else {
        content = "Please enter a channel name if you want to delete one";
    }
}

const quit = async (value, channel_id, socket) => {
    let content = "";
    if(value.trim().replaceAll(" ", "").length > 5){
        const remaining = value.substring(5).trimStart();
        try {
            const req = await Api.Channels.getChannel(remaining);
            if (req.error){
                content = "Cannot quit the specified channel";
                isSentByBot(content, channel_id, socket);
            }else{
                const user = await Api.Users.getUserById(localStorage.getItem('id'));
                if (!user.error){
                    if(user.channel_ids.includes(req._id)){
                        user.channel_ids.splice(user.channel_ids.indexOf(req._id));
                        const send = await Api.Users.modifyUser(user, localStorage.getItem('id'));
                        if(send.error){
                            content = "Cannot delete the channel from the user info";
                            isSentByBot(content, channel_id, socket);
                        } else {
                            content = `Channel ${remaining} left by ${localStorage.getItem('username') ? localStorage.getItem('username') : "a user"}`;
                            isSentByBot(content, channel_id, socket);
                            window.location.reload();
                        }
                    }
                } else {
                    content = "Cannot get the user info, try to log out and log back in";
                    isSentByBot(content, channel_id, socket);
                }
            }
        } catch (e) {
            alert(e);
        }
    } else {
        content = "Please enter a channel name if you want to quit one";
        isSentByBot(content,channel_id,socket);
    }
}

const users = async (value, channel_id, socket) => {
    const req = await Api.Channels.getAllUsersOfThisChannel(channel_id);
    let temp = "";
    let content = "";
    if (typeof req !== 'string') {
        temp = req.map(user => user.username).join(", ");
    }
    if (temp) {
        content = temp;
    } else {
        content = "There is no user in this channel";
    }
    isSentByBot(content, channel_id, socket);
}

export default {
    isLoggedIn, 
    logout,
    navigateHome,
    actualDate,
    isSentByBot,
    nick,
    list,
    create,
    deletes,
    join,
    quit,
    users
}
