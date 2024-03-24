const ChannelExtension = require('./ChannelExtension'); // Adjust the import path

// Define a middleware function
const checkChannelDuplicates = async (req, res, next) => {
    // Assuming you have a request body with the channel name
    const { channelName } = req.body;

    // Create an instance of ChannelExtension
    const channel = new ChannelExtension();
    channel.channelName = channelName; // Set the channel name

    try {
        const isDuplicate = await channel.checkDuplicates();
        if (isDuplicate) {
            // Handle the case where a duplicate channel was found
            return res.status(400).json({ error: 'Duplicate channel name' });
        } else {
            // If no duplicate is found, proceed to the next middleware or route handler
            next();
        }
    } catch (error) {
        // Handle any errors that occur during the database query
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = checkChannelDuplicates;
