const { EmbedBuilder } = require('discord.js');
const db = require("croxydb");
const messages = require('../../utils/constants/messages');
const embedBuilder = require("../../utils/helpers/embeds");

module.exports = async (client, emoji) => {
	const logchannel = db.get(`logchannels_${emoji.guild.id}`)
	const kanal = emoji.guild.channels.cache.get(logchannel)
	if (!kanal) return;
	const logdurum = db.get(`logdurum_${emoji.guild.id}`)
	if (logdurum === 'açık') {
  await kanal.send({
    embeds: [embedBuilder.emojiC(client, emoji)],
  });
  }
};


