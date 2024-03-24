const base_url = process.env.REACT_APP_API_URL;

const getAllChannels = async () => {
    const options = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    };

    try {
        const response = await fetch(`${base_url}/channels/all/`, options);
        const data = await response.json();
        // Filter out channels with '_default' in their name
        const filteredData = data.filter(channel => !channel.name.includes('_default'));
        return filteredData;
    } catch(err){
        return err;
    }
}


const getUserChannels = async (userID) => {
    const options = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    };

    try {
        const response = await fetch(`${base_url}/channels/all/${userID}`, options);
        const data = await response.json();
        return data;
    } catch(err){
        return err;
    }
}

const getAllUsersOfThisChannel = async (channel_id) => {
    const options = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    };

    try {
        const response = await fetch(`${base_url}/channels/allUsers/${channel_id}`, options);
        const data = await response.json();
        return data;
    } catch(err){
        return err;
    }
}

const getChannel = async (name) => {
    const options = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    };

    try {
        const response = await fetch(`${base_url}/channels/name/${name}`, options);
        const data = await response.json();
        return data;
    } catch(err){
        return err;
    }
}

const getChannelByID = async (id) => {
    const options = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    };

    try {
        const response = await fetch(`${base_url}/channels/${id}`, options);
        const data = await response.json();
        return data;
    } catch(err){
        return err;
    }
}

const getChannelById = async (id) => {
    const options = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    };

    try {
        const response = await fetch(`${base_url}/channels/${id}`, options);
        const data = await response.json();
        return data;
    } catch(err){
        return err;
    }
}

const addChannel = async (body) => {
    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    };

    try {
        const response = await fetch(`${base_url}/channels/add/`, options);
        const data = await response.json();
        return data;
    } catch (err){
        return err;
    }
}

const addPrivateChannel = async (body) => {
    const options = {
        method : 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    };

    try {
        const response = await fetch(`${base_url}/channels/createnew/`, options);
        const data = await response.json();
        return data;
    } catch (err){
        return err;
    }


}

const deleteChannel = async (id) => {
    const options = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'}
    };

    try {
        const response = await fetch(`${base_url}/channels/delete/${id}`, options);
        const data = await response.json();
        return data;
    } catch (err){
        return err;
    }
}

const deleteChannelByName = async (name, channel_id) => {
    const options = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ channel_id: channel_id })
    };

    try {
        const response = await fetch(`${base_url}/channels/delete/${name}`, options);
        const data = await response.json();
        return data;
    } catch (err) {
        return err;
    }
}

export default {
    getAllChannels,
    getChannelByID,
    getAllUsersOfThisChannel,
    getChannel,
    getChannelById,
    addChannel,
    deleteChannel,
    deleteChannelByName,
    addPrivateChannel,
}