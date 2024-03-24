const ChannelClass = require("./channelClass");
const channelModel = require("../models/channels");

class ChannelExtension extends ChannelClass { 
    async checkDuplicates() {
        const existingChannel = await channelModel.findOne({ channelName: this.channelName });

        if (existingChannel) {
            return true;
        } else {
            return false;
        }
    }
}

module.exports = ChannelExtension;
