const { ChannelType } = require("discord.js");
const schema = require("../../utils/database/join-to-create");
const VoiceManager = require("../../utils/database/VoiceManager");

module.exports = async (client, oldState, newState) => {
    if (!oldState?.channel && newState?.channel) {
        return VoiceManager.onRoomJoin(client, newState);
    }
    else if (oldState?.channel && !newState?.channel) {
        await VoiceManager.onRoomLeave(client, oldState);
        await VoiceManager.checkEmptyChannels(client, oldState);
    }
    else if (oldState?.channel !== newState.channel) {
        VoiceManager.onRoomJoin(client, newState);
        await VoiceManager.onRoomLeave(client, oldState);
        await VoiceManager.checkEmptyChannels(client, oldState);
    }
};