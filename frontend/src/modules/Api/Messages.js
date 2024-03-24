const base_url = process.env.REACT_APP_API_URL;

const getAllMessages = async () => {
    const options = {
        method: 'GET', 
        headers: {'Content-Type': 'application/json'}
    };

    try {
        const response = await fetch(`${base_url}/messages/all/`, options);
        const data = await response.json();
        
        return data;
    } catch(err){
        return err;
    }
    
}

const getMessagesByChannel = async  (channelId) => {
    const options = {
        method: 'GET', 
        headers: {'Content-Type': 'application/json'}
    }; 

    try {
        const response = await fetch(`${base_url}/messages/by_channel/${channelId}/`, options);
        const data = await response.json();
        
        return data;
    } catch(err){
        return err;
    }
    


}

export default {
    getAllMessages, 
    getMessagesByChannel
}