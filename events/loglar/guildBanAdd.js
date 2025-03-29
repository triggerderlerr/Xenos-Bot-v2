const { EmbedBuilder } = require('discord.js');
const db = require("croxydb");
const messages = require('../../utils/constants/messages');
const embedBuilder = require("../../utils/helpers/embeds");

module.exports = async (client, member, reason) => {
	const logchannel = db.get(`logchannels_${member.guild.id}`)
	const kanal = member.guild.channels.cache.get(logchannel)
	if (!kanal) return;
	const logdurum = db.get(`logdurum_${member.guild.id}`)
	if (logdurum === 'açık') {
  await kanal.send({
    embeds: [embedBuilder.guildBA(client, member, reason)],
  });
  }
};
