const { EmbedBuilder } = require('discord.js');
const db = require("croxydb");
const messages = require('../../utils/constants/messages');
const embedBuilder = require("../../utils/helpers/embeds");

module.exports = async (client, message) => {
  // Eğer mesaj bir DM mesajıysa çık
  if (message.channel.type === "DM") return;

  // Eğer mesaj bir bot mesajıysa çık
  if (message.author.bot) return;

  // Guild kontrolü yap
  if (!message.guild) return;

  const logchannel = db.get(`logchannels_${message.guild.id}`);
  const kanal = message.guild.channels.cache.get(logchannel);

  // Log kanalı yoksa çık
  if (!kanal) return;

  const logdurum = db.get(`logdurum_${message.guild.id}`);

  // Log durumu açıksa mesajı gönder
  if (logdurum === "açık") {
    await kanal.send({
      embeds: [embedBuilder.messageD(client, message)],
    });
  }
};
