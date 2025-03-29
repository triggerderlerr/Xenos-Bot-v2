const { Client, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "kurucu",
  description: "Sunucunun kurucusunu görürsün!",
  type: 1,
  options: [],

  run: async (client, interaction) => {
    // Sunucu sahibini alma
    const owner = interaction.guild.members.cache.get(interaction.guild.ownerId);

    // Botun kendisini alma
    const botMember = interaction.guild.members.cache.get(client.user.id);

    // Embed oluşturma
    const embed = new EmbedBuilder()
      .setTitle(`${botMember.displayName}`) // Botun görünen adı
      .setColor("Gold") // Altın rengi
      .setDescription(`👑 Sunucunun kurucusu: **${owner.user.tag}**`)
      .setThumbnail(owner.user.displayAvatarURL({ dynamic: true })) // Kurucunun avatarı
      .addFields(
        { name: "📇 Kurucu ID", value: `${owner.id}`, inline: true },
        { name: "🕒 Sunucu Oluşturulma Tarihi", value: `<t:${Math.floor(interaction.guild.createdTimestamp / 1000)}:F>`, inline: true }
      )
      .setFooter({
        text: "Bu bilgiyi istediğiniz için teşekkürler!",
        iconURL: botMember.user.displayAvatarURL({ dynamic: true }), // Botun profil fotoğrafı
      })
      .setTimestamp();

    // Yanıt olarak embed'i gönder
    interaction.reply({ embeds: [embed] });
  },
};
