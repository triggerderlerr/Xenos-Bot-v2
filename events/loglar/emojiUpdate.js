const { EmbedBuilder } = require('discord.js');
const db = require("croxydb");
const messages = require('../../utils/constants/messages');
const embedBuilder = require("../../utils/helpers/embeds");

module.exports = async (client, oldEmoji, newEmoji) => {
	const logchannel = db.get(`logchannels_${newEmoji.guild.id}`)
	const kanal = newEmoji.guild.channels.cache.get(logchannel)
	if (!kanal) return;
	const logdurum = db.get(`logdurum_${newEmoji.guild.id}`)
	if (logdurum === 'açık') {
  await kanal.send({
    embeds: [embedBuilder.emojiU(client, newEmoji, oldEmoji)],
  });
  }
};


