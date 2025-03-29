const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "backup-info",
  description: "Yedek bilgilerini gösterir!",
  type: 1,
  options: [
    {
      name: "backup_id",
      description: "Yedek ID'si",
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

    // Yedek dosyasının mevcut olup olmadığını kontrol et
    if (!fs.existsSync(backupPath)) {
      return interaction.reply("❌ Belirtilen ID'ye ait bir yedek bulunamadı!");
    }

    let backupData;
    try {
      backupData = JSON.parse(fs.readFileSync(backupPath, "utf-8"));
    } catch (err) {
      console.error("Yedek dosyası okunamadı:", err);
      return interaction.reply("❌ Yedek dosyası okunurken bir hata oluştu.");
    }

    // Yedek verilerini kontrol et
    if (!backupData || !backupData.server) {
      return interaction.reply("❌ Yedek dosyasındaki sunucu bilgileri eksik.");
    }

    // Embed mesajı oluştur
    const embed = new EmbedBuilder()
      .setColor("#00FF00")
      .setTitle(`Yedek Bilgisi: ${backupId}`)
      .addFields(
        { name: "Sunucu Adı", value: backupData.server.name || "Bulunamadı", inline: true },
        { name: "Sunucu Bölgesi", value: backupData.server.region || "Bulunamadı", inline: true },
        { name: "Doğrulama Seviyesi", value: backupData.server.verificationLevel?.toString() || "Bulunamadı", inline: true },
        { name: "Mesaj Bildirim Seviyesi", value: backupData.server.defaultMessageNotifications?.toString() || "Bulunamadı", inline: true },
        { name: "Rol Sayısı", value: backupData.roles?.length.toString() || "0", inline: true },
        { name: "Kanal Sayısı", value: backupData.channels?.length.toString() || "0", inline: true }
      )
      .setFooter({ text: "Yedek bilgileri başarıyla yüklendi." });

    interaction.reply({ embeds: [embed] });
  },
};
