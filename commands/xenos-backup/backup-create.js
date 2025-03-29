const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const fs = require("fs").promises;
const path = require("path");

module.exports = {
  name: "backup-create",
  description: "Sunucunun yedeğini oluşturur!",
  type: 1,
  options: [
    {
      name: "isim",
      description: "Yedeğe verilecek isim",
      type: 3, // STRING
      required: false
    }
  ],

  run: async (client, interaction) => {
    // Yetki kontrolü
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({
        content: "❌ Bu komutu kullanmak için Yönetici yetkisine sahip olmalısın!",
        ephemeral: true,
      });
    }

    try {
      const guild = interaction.guild;
      const userId = interaction.user.id;
      const backupName = interaction.options.getString("isim") || `Yedek-${Date.now()}`;

      // İlk mesajı gönder
      const initialEmbed = new EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("🔄 Yedekleme İşlemi Başlatılıyor")
        .setDescription(`Yedek İsmi: \`${backupName}\`\nSunucu verileri yedekleniyor...`)
        .addFields(
          { name: "Sunucu Bilgileri", value: "⏳ Bekliyor...", inline: true },
          { name: "Roller", value: "⏳ Bekliyor...", inline: true },
          { name: "Kanallar", value: "⏳ Bekliyor...", inline: true }
        );

      const progressMessage = await interaction.reply({ embeds: [initialEmbed], fetchReply: true });

      // Yedek verilerinin hazırlanması
      const backupData = {
        name: backupName,
        createdAt: Date.now(),
        server: {
          name: guild.name,
          icon: guild.iconURL(),
          verificationLevel: guild.verificationLevel,
          defaultMessageNotifications: guild.defaultMessageNotifications,
        },
        roles: [],
        channels: [],
      };

      // Sunucu bilgileri güncellendi
      const serverEmbed = new EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("🔄 Yedekleme İşlemi Devam Ediyor")
        .setDescription(`Yedek İsmi: \`${backupName}\`\nSunucu verileri yedekleniyor...`)
        .addFields(
          { name: "Sunucu Bilgileri", value: "✅ Tamamlandı", inline: true },
          { name: "Roller", value: "⏳ Bekliyor...", inline: true },
          { name: "Kanallar", value: "⏳ Bekliyor...", inline: true }
        );
      await progressMessage.edit({ embeds: [serverEmbed] });

      // Roller yedekleniyor (@everyone hariç)
      const roles = guild.roles.cache.filter((role) => role.name !== "@everyone");
      const totalRoles = roles.size;
      let processedRoles = 0;

      for (const role of roles.sort((a, b) => a.position - b.position)) {
        try {
          backupData.roles.push({
            name: role.name,
            color: role.color,
            hoisted: role.hoist,
            mentionable: role.mentionable,
            permissions: role.permissions?.bitfield?.toString() || "0",
          });
        } catch (error) {
          console.error(`Rol yedeklenirken hata: ${role.name}`, error);
          backupData.roles.push({
            name: role.name,
            color: role.color,
            hoisted: role.hoist,
            mentionable: role.mentionable,
            permissions: "0",
          });
        }
        processedRoles++;

        // Her 5 rolde bir progress güncelle
        if (processedRoles % 5 === 0 || processedRoles === totalRoles) {
          try {
            const progressEmbed = new EmbedBuilder()
              .setColor("#0099ff")
              .setTitle("🔄 Yedekleme İşlemi Devam Ediyor")
              .setDescription(`Yedek İsmi: \`${backupName}\`\nSunucu verileri yedekleniyor...`)
              .addFields(
                { name: "Sunucu Bilgileri", value: "✅ Tamamlandı", inline: true },
                { name: "Roller", value: `🔄 İşleniyor (${processedRoles}/${totalRoles})`, inline: true },
                { name: "Kanallar", value: "⏳ Bekliyor...", inline: true }
              );
            await progressMessage.edit({ embeds: [progressEmbed] });
          } catch (error) {
            console.error("Progress mesajı güncellenirken hata:", error);
          }
        }
      }

      // Roller tamamlandı
      try {
        const rolesCompleteEmbed = new EmbedBuilder()
          .setColor("#0099ff")
          .setTitle("🔄 Yedekleme İşlemi Devam Ediyor")
          .setDescription(`Yedek İsmi: \`${backupName}\`\nSunucu verileri yedekleniyor...`)
          .addFields(
            { name: "Sunucu Bilgileri", value: "✅ Tamamlandı", inline: true },
            { name: "Roller", value: "✅ Tamamlandı", inline: true },
            { name: "Kanallar", value: "⏳ Bekliyor...", inline: true }
          );
        await progressMessage.edit({ embeds: [rolesCompleteEmbed] });
      } catch (error) {
        console.error("Roller tamamlandı mesajı güncellenirken hata:", error);
      }

      // Kanallar yedekleniyor
      const channels = guild.channels.cache;
      const totalChannels = channels.size;
      let processedChannels = 0;

      for (const channel of channels) {
        try {
          const permissionOverwrites = channel.permissionOverwrites.cache.map((overwrite) => ({
            roleName: guild.roles.cache.get(overwrite.id)?.name || overwrite.id,
            allow: overwrite.allow?.bitfield?.toString() || "0",
            deny: overwrite.deny?.bitfield?.toString() || "0",
          }));

          backupData.channels.push({
            id: channel.id,
            name: channel.name,
            type: channel.type,
            position: channel.position,
            parentId: channel.parentId,
            nsfw: channel.nsfw || false,
            userLimit: channel.userLimit || null,
            bitrate: channel.bitrate || null,
            permissionOverwrites,
          });
        } catch (error) {
          console.error(`Kanal yedeklenirken hata: ${channel.name}`, error);
          backupData.channels.push({
            id: channel.id,
            name: channel.name,
            type: channel.type,
            position: channel.position,
            parentId: channel.parentId,
            nsfw: channel.nsfw || false,
            userLimit: channel.userLimit || null,
            bitrate: channel.bitrate || null,
            permissionOverwrites: [],
          });
        }
        processedChannels++;

        // Her 5 kanalda bir progress güncelle
        if (processedChannels % 5 === 0 || processedChannels === totalChannels) {
          try {
            const progressEmbed = new EmbedBuilder()
              .setColor("#0099ff")
              .setTitle("🔄 Yedekleme İşlemi Devam Ediyor")
              .setDescription(`Yedek İsmi: \`${backupName}\`\nSunucu verileri yedekleniyor...`)
              .addFields(
                { name: "Sunucu Bilgileri", value: "✅ Tamamlandı", inline: true },
                { name: "Roller", value: "✅ Tamamlandı", inline: true },
                { name: "Kanallar", value: `🔄 İşleniyor (${processedChannels}/${totalChannels})`, inline: true }
              );
            await progressMessage.edit({ embeds: [progressEmbed] });
          } catch (error) {
            console.error("Progress mesajı güncellenirken hata:", error);
          }
        }
      }

      // Yedeklerin kaydedileceği klasör oluşturuluyor
      const backupsDir = path.join(__dirname, "backups", userId);
      await fs.mkdir(backupsDir, { recursive: true });

      // Yedek dosyası oluşturuluyor
      const backupId = Date.now();
      const backupPath = path.join(backupsDir, `${backupId}.json`);
      await fs.writeFile(backupPath, JSON.stringify(backupData, null, 2));

      // Tamamlandı mesajı
      const completeEmbed = new EmbedBuilder()
        .setColor("#00ff00")
        .setTitle("✅ Yedekleme İşlemi Tamamlandı")
        .setDescription(`Sunucunun yedeği başarıyla oluşturuldu!`)
        .addFields(
          { name: "Yedek İsmi", value: `\`${backupName}\``, inline: true },
          { name: "Yedek ID", value: `\`${backupId}\``, inline: true },
          { name: "Sunucu Bilgileri", value: "✅ Tamamlandı", inline: true },
          { name: "Roller", value: "✅ Tamamlandı", inline: true },
          { name: "Kanallar", value: "✅ Tamamlandı", inline: true }
        );

      return progressMessage.edit({ embeds: [completeEmbed] });
    } catch (error) {
      console.error("Yedek oluşturulurken hata meydana geldi:", error);
      try {
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: "❌ Yedek oluşturulurken bir hata meydana geldi!",
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: "❌ Yedek oluşturulurken bir hata meydana geldi!",
            ephemeral: true,
          });
        }
      } catch (e) {
        console.error("Hata mesajı gönderilirken hata:", e);
      }
    }
  },
};
