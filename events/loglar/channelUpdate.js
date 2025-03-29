const { EmbedBuilder } = require('discord.js');
const db = require("croxydb");
const messages = require('../../utils/constants/messages');
const embedBuilder = require("../../utils/helpers/embeds");

module.exports = async (client, oldChannel, newChannel) => {
	const logchannel = db.get(`logchannels_${oldChannel.guild.id}`)
	const kanal = oldChannel.guild.channels.cache.get(logchannel)
	if (!kanal) return;
  
	const logdurum = db.get(`logdurum_${oldChannel.guild.id}`)
	
	if (logdurum === 'açık') {
		let changes = [];
		
		if (oldChannel.name !== newChannel.name) {
			changes.push({type: 'name', embed: embedBuilder.channelUN(client, newChannel, oldChannel)});
		}

		if (oldChannel.nsfw !== newChannel.nsfw) {
			changes.push({type: 'nsfw', embed: embedBuilder.channelUNSFW(client, newChannel, oldChannel)});
		}

		if (oldChannel.parent !== newChannel.parent) {
			changes.push({type: 'parent', embed: embedBuilder.channelUP(client, newChannel, oldChannel)});
		}

		if (oldChannel.topic !== newChannel.topic) {
			changes.push({type: 'topic', embed: embedBuilder.channelUT(client, newChannel, oldChannel)});
		}

		if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
			changes.push({type: 'rateLimit', embed: embedBuilder.channelURPU(client, newChannel, oldChannel)});
		}

		if (changes.length > 0) {
			const embeds = changes.map(change => change.embed);
			await kanal.send({ embeds });
		}
	}
};
 