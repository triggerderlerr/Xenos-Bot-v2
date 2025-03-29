const { PermissionsBitField } = require("discord.js");
const db = require("croxydb");

module.exports = {
  name: "db-sıfırla",
  description: "Sunucuya ait tüm verileri sıfırlar!",
  type: 1,
  options: [],

  run: async (client, interaction) => {
    if (interaction.user.id !== interaction.guild.ownerId)
      return interaction.reply({
        content: "Bu komutu kullanabilmek için sunucu sahibi olmalısın.",
        ephemeral: true,
      });

    const keys = db.all().filter(entry => entry.id.endsWith(`_${interaction.guild.id}`));
    keys.forEach(entry => db.delete(entry.id));

    interaction.reply({ content: "Veritabanı başarıyla sıfırlandı." });
  },
};
