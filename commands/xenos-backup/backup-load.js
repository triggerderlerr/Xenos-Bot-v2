const { PermissionsBitField, ChannelType } = require("discord.js");
const fs = require("fs").promises;
const path = require("path");

module.exports = {
  name: "backup-load",
  description: "Sunucu yedeğini geri yükler!",
  type: 1,
  options: [
    {
      name: "backup_id",
      description: "Yüklenecek yedek ID'si",
      type: 3, // STRING
      required: true,
    },
  ],

  run: async (client, interaction) => {
    // Sunucu sahibi kontrolü
    if (interaction.user.id !== interaction.guild.ownerId) {
      return interaction.reply({
        content: "❌ Bu komutu kullanabilmek için sunucu sahibi olmalısın.",
        ephemeral: true,
      });
    }

    await interaction.deferReply();

    try {
      const userId = interaction.user.id;
      const backupId = interaction.options.getString("backup_id");
      const backupPath = path.join(__dirname, "backups", userId, `${backupId}.json`);

      // Yedek dosyasının varlığını kontrol et
      try {
        await fs.access(backupPath);
      } catch {
        return interaction.followUp("❌ Belirtilen ID'ye ait bir yedek bulunamadı!");
      }

      const backupRaw = await fs.readFile(backupPath, "utf8");
      const backupData = JSON.parse(backupRaw);
      const guild = interaction.guild;

      // Botun rolünü al
      const botMember = await guild.members.fetch(client.user.id);
      const botRole = botMember.roles.highest;

      // Mevcut rollerin silinmesi (@everyone ve bot rolü hariç)
      const roles = await guild.roles.fetch();
      for (const role of roles.values()) {
        if (role.name !== "@everyone" && role.id !== botRole.id) {
          await role.delete().catch(err => console.error(`Rol silinemedi (${role.name}):`, err));
        }
      }

      // Tüm kanalların silinmesi
      const channels = await guild.channels.fetch();
      for (const channel of channels.values()) {
        await channel.delete().catch(err => console.error(`Kanal silinemedi (${channel.name}):`, err));
      }

      // Sunucu ayarlarının geri yüklenmesi
      await guild.setName(backupData.server.name);
      if (backupData.server.icon) await guild.setIcon(backupData.server.icon);
      await guild.setVerificationLevel(backupData.server.verificationLevel);
      await guild.setDefaultMessageNotifications(backupData.server.defaultMessageNotifications);

      // Rolleri ters sırayla oluştur (pozisyonların korunması için)
      const createdRoles = {};
      for (const roleData of backupData.roles.reverse()) {
        const newRole = await guild.roles.create({
          name: roleData.name,
          color: roleData.color,
          hoist: roleData.hoisted,
          mentionable: roleData.mentionable,
          // İzinleri BigInt olarak ayarla
          permissions: BigInt(roleData.permissions),
        });
        createdRoles[roleData.name] = newRole.id;
      }

      // Kategorileri oluştur ve ID eşleştirmesini tut
      const categoryMap = {};
      const categories = backupData.channels.filter(channel => channel.type === ChannelType.GuildCategory);
      for (const categoryData of categories) {
        const category = await guild.channels.create({
          name: categoryData.name,
          type: ChannelType.GuildCategory,
          position: categoryData.position,
        });
        categoryMap[categoryData.id] = category.id;
      }

      // Diğer kanalları oluştur
      const nonCategories = backupData.channels.filter(channel => channel.type !== ChannelType.GuildCategory);
      for (const channelData of nonCategories) {
        const newChannel = await guild.channels.create({
          name: channelData.name,
          type: channelData.type,
          parent: channelData.parentId ? categoryMap[channelData.parentId] : null,
          position: channelData.position,
          nsfw: channelData.nsfw,
          userLimit: channelData.userLimit || null,
          bitrate: channelData.bitrate || null,
        });

        // Kanal izinlerini geri yükle
        if (Array.isArray(channelData.permissionOverwrites)) {
          const overwrites = channelData.permissionOverwrites
            .map(permission => {
              const role = guild.roles.cache.find(r => r.name === permission.roleName);
              if (!role) {
                console.warn(`Rol bulunamadı: ${permission.roleName}`);
                return null;
              }
              return {
                id: role.id,
                allow: BigInt(permission.allow),
                deny: BigInt(permission.deny),
              };
            })
            .filter(Boolean);
          
          await newChannel.permissionOverwrites.set(overwrites).catch(err =>
            console.error(`İzinler yüklenemedi (${newChannel.name}):`, err)
          );
        }
      }

      const owner = await guild.fetchOwner();
      await owner.send(`✅ Yedek başarıyla yüklendi! Yedek ID: \`${backupId}\``);
    } catch (error) {
      console.error(error);
    }
  },
};
