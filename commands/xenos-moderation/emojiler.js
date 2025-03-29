const { Client, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "emojiler",
  description: "Sunucudaki emojileri görürsün!",
  type: 1,
  options: [],

  run: async (client, interaction) => {
    let animEmotes = [], staticEmotes = [];

    interaction.guild.emojis.cache.forEach((emoji) => {
      const emojiFields = [
        {
          name: 'Emoji Adı',
          value: emoji.name,
          inline: true, // Yan yana gösterim
        },
        {
          name: 'Emoji ID',
          value: `\`${emoji.id}\``,
          inline: true, // Yan yana gösterim
        },
        {
          name: 'Görsel',
          value: emoji.toString(),
          inline: true, // Yan yana gösterim
        }
      ];

      if (emoji.animated) {
        animEmotes.push(...emojiFields); // Animasyonlu emojiler
      } else {
        staticEmotes.push(...emojiFields); // Statik emojiler
      }
    });

    const embed = new EmbedBuilder()
      .setColor('#3498db') // Modern bir mavi renk
      .setTitle(`${interaction.guild.name} - Emoji Listesi`)
      .setThumbnail(`${client.user.displayAvatarURL({ dynamic: true })}`) // Botun avatarı
      .setTimestamp()
      .setFooter({ text: `Toplam Emojiler: ${interaction.guild.emojis.cache.size}`, iconURL: `${client.user.displayAvatarURL({ dynamic: true })}` })
      .setAuthor({ name: `${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) }); // Komutu kullanan kullanıcı

    // Animasyonlu emojiler alanı
    if (animEmotes.length) {
      embed.addFields({ name: 'Animasyonlu Emojiler', value: '\u200B' }); // Başlık
      animEmotes.forEach((field) => embed.addFields(field));
    } else {
      embed.addFields({ name: 'Animasyonlu Emojiler', value: 'Hiç animasyonlu emoji yok.' });
    }

    // Statik emojiler alanı
    if (staticEmotes.length) {
      embed.addFields({ name: 'Statik Emojiler', value: '\u200B' }); // Başlık
      staticEmotes.forEach((field) => embed.addFields(field));
    } else {
      embed.addFields({ name: 'Statik Emojiler', value: 'Hiç statik emoji yok.' });
    }

    await interaction.reply({ embeds: [embed] });
  }
};
