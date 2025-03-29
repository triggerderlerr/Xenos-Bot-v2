const { EmbedBuilder } = require('discord.js');
const db = require("croxydb");
const messages = require('../../utils/constants/messages');
const embedBuilder = require("../../utils/helpers/embeds");

module.exports = async (client, channel) => {
	const logchannel = db.get(`logchannels_${channel.guild.id}`)
	const kanal = channel.guild.channels.cache.get(logchannel)
	if (!kanal) return;
	const logdurum = db.get(`logdurum_${channel.guild.id}`)
	if (logdurum === 'açık') {
  await kanal.send({
    embeds: [embedBuilder.channelD(client, channel)],
  });
	}
};
