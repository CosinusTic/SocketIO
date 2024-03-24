const base_url = process.env.REACT_APP_API_URL;

const getAllUsers = async () => {
    const options = {
        method: 'GET', 
        headers: {'Content-Type': 'application/json'}
    };
    
    try {
        const response = await fetch(`${base_url}/users/all/`, options);
        const data = await response.json();

        return data;
    } catch (err) {
        return err;
    }
    
};

const getUser = async (username) => {
    const options = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    };

    try {
        const response = await fetch(`${base_url}/users/username/${username}`, options);
        const data = await response.json();
        return data;
    } catch (err) {
        return err;
    }

};

const getUserById = async (id) => {
    const options = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    };

    try {
        const response = await fetch(`${base_url}/users/id/${id}`, options);
        const data = await response.json();
        return data;
    } catch (err) {
        return err;
    }

};

const getUserChannels = async (id) => {
    const options = {
        method: 'GET', 
        headers: {'Content-Type': 'application/json'}
    }; 

    try {
        const response = await fetch(`${base_url}/users/${id}/channels/`, options);
        const data = await response.json();

        return data;
    } catch (err){
        return err;
    }
}

const addUser = async (body) => {
    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body),
    };

    try {
        const response = await fetch(`${base_url}/users/add/`, options);
        const data = await response.json();
        return data;
    } catch (err){
        return err;
    }
}

const modifyUser = async (body, id) => {
    const options = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body),
    };

    try {
        const response = await fetch(`${base_url}/users/modify/${id}/`, options);
        const data = await response.json();
        return data;
    } catch (err) {
        return err;
    }
}

export default {
    getAllUsers,
    addUser,
    getUser,
    getUserById,
    getUserChannels,
    modifyUser
}
