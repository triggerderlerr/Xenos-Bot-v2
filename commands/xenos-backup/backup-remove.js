const { PermissionsBitField } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "backup-delete",
  description: "Yedek siler!",
  type: 1,
  options: [
    {
      name: "backup_id",
      description: "Silinecek yedek ID'si",
      type: 3, // STRING
      required: true,
    },
  ],

  run: async (client, interaction) => {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: "❌ Bu komutu kullanmak için Yönetici yetkisine sahip olmalısın!", ephemeral: true });
    }

    const backupId = interaction.options.getString("backup_id");
    const backupsDir = path.join(__dirname, "backups", interaction.user.id); // Kullanıcı bazlı yedekleme
    const backupPath = path.join(backupsDir, `${backupId}.json`);

    if (!fs.existsSync(backupPath)) {
      return interaction.reply("❌ Belirtilen ID'ye ait bir yedek bulunamadı!");
    }

    fs.unlinkSync(backupPath);
    interaction.reply(`✅ Yedek başarıyla silindi! Yedek ID: \`${backupId}\``);
  },
};
