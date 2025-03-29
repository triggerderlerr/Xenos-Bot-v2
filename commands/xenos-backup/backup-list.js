const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "backup-list",
  description: "Mevcut yedeklerin listesini gösterir",
  type: 1,

  run: async (client, interaction) => {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: "❌ Bu komutu kullanabilmek için Yönetici yetkisine sahip olmalısın!", ephemeral: true });
    }

    const userId = interaction.user.id;
    const backupsDirectory = path.join(__dirname, "backups", userId);

    if (!fs.existsSync(backupsDirectory)) {
      return interaction.reply("❌ Yedek klasörü bulunamadı!");
    }

    const backupFiles = fs.readdirSync(backupsDirectory).filter(file => file.endsWith(".json"));

    if (backupFiles.length === 0) {
      return interaction.reply("❌ Hiç yedek bulunmamaktadır.");
    }

    const backupList = await Promise.all(
      backupFiles.map(async (file) => {
        const backupPath = path.join(backupsDirectory, file);
        let backupData;

        try {
          backupData = JSON.parse(fs.readFileSync(backupPath, "utf-8"));
        } catch (err) {
          console.error("Yedek dosyası okunamadı:", err);
          return `\`\`\`/backup-load backup_id:${file.replace(".json", "   ")}\`\`\` - Sunucu adı: Bulunamadı`;
        }

        const serverName = backupData.server?.name || "Bulunamadı";
        const channels = backupData.channels || [];
        const roles = backupData.roles || [];

        const totalChannels = channels.length;
        const totalRoles = roles.length;

        return {
          backupId: file.replace(".json", ""),
          serverName,
          totalChannels,
          totalRoles
        };
      })
    );

    const backupDescriptions = backupList.filter(backup => backup).map(backup => {
      return `\`\`\`/backup-load backup_id:${backup.backupId}\`\`\` - Sunucu adı: ${backup.serverName}\n  - Toplam Kanal: ${backup.totalChannels}\n  - Toplam Rol: ${backup.totalRoles}`;
    });

    if (backupDescriptions.length === 0) {
      return interaction.reply("❌ Yedek dosyaları okunurken bir hata oluştu.");
    }

    const itemsPerPage = 5;
    let currentPage = 0;
    const totalPages = Math.ceil(backupDescriptions.length / itemsPerPage);

    const generateEmbed = (page) => {
      const start = page * itemsPerPage;
      const end = start + itemsPerPage;
      const pageData = backupDescriptions.slice(start, end).join("\n");

      return new EmbedBuilder()
        .setColor(0x7289DA)
        .setTitle("Mevcut Yedekler")
        .setDescription(`Kullanıcıya ait mevcut yedekler:\n${pageData}`)
        .setFooter({ text: `Yedek Listesi - ${interaction.guild.name} | Sayfa ${page + 1}/${totalPages}`, iconURL: interaction.guild.iconURL() })
        .setTimestamp()
        .setThumbnail(interaction.user.avatarURL());
    };

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("back")
        .setLabel("Geri")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("⬅️")  // Geri butonuna emoji ekleniyor
        .setDisabled(currentPage === 0),
      new ButtonBuilder()
        .setCustomId("next")
        .setLabel("İleri")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("➡️")  // İleri butonuna emoji ekleniyor
        .setDisabled(currentPage === totalPages - 1)
    );

    const embed = generateEmbed(currentPage);

    const reply = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

    const filter = (i) => i.user.id === interaction.user.id;
    const collector = reply.createMessageComponentCollector({ filter, time: 60000 });

    collector.on("collect", async (i) => {
      if (i.customId === "back" && currentPage > 0) {
        currentPage--;
      } else if (i.customId === "next" && currentPage < totalPages - 1) {
        currentPage++;
      }

      // Butonları tekrar güncelle
      const updatedRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("back")
          .setLabel("Geri")
          .setStyle(ButtonStyle.Primary)
          .setEmoji("⬅️")
          .setDisabled(currentPage === 0),
        new ButtonBuilder()
          .setCustomId("next")
          .setLabel("İleri")
          .setStyle(ButtonStyle.Primary)
          .setEmoji("➡️")
          .setDisabled(currentPage === totalPages - 1)
      );

      await i.update({ embeds: [generateEmbed(currentPage)], components: [updatedRow] });
    });

    collector.on("end", () => {
      row.components.forEach(button => button.setDisabled(true));
      reply.edit({ components: [row] });
    });
  },
};
