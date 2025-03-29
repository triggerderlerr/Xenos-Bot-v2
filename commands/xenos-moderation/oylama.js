const { Client, EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  name: "oylama",
  description: "Oylama Yaparsın!",
  type: 1,
  options: [
    {
        name: "içerik",
        description: "Oylama Seçeneğini Gir!",
        type: 3,
        required: true,
    },
  ],

  run: async (client, interaction) => {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
      return interaction.reply({ content: "İsimleri Yönet Yetkin Yok!", ephemeral: true });
    }

    const oylama = interaction.options.getString("içerik");
    const embed = new EmbedBuilder()
      .setTitle(`${interaction.guild.name} - Oylama Sistemi!`)
      .setDescription(`Oylama: **${oylama}**`)
      .setColor("Green");

    interaction.channel.send({ embeds: [embed] }).then((mesaj) => {
      interaction.reply({ content: "Oylama Başarıyla Oluşturuldu.", ephemeral: true });
      mesaj.react("✅");
      mesaj.react("❌");
    });
  },
};
