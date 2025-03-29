const { PermissionsBitField, ChannelType } = require("discord.js");
const db = require("croxydb");

module.exports = {
    name: "ticket-log",
    description: 'Logları açar-kapatır ve gerekli log kanallarını oluşturur.',
    type: 1,
    options: [
        {
            name: "işlem",
            description: "Logları Aç-Kapat",
            choices: [
                { name: "Aç", value: "aç" },
                { name: "Kapat", value: "kapat" }
            ],
            type: 3,
            required: true
        },
    ],
  
    run: async(client, interaction) => {
        const guild = interaction.guild;
        const guildId = guild.id;
        const bool = interaction.options.getString('işlem');
        
        // Yönetici Yetkisi Kontrolü
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: "Yönetici yetkisine sahip olmalısınız!", ephemeral: true });
        }

        // Staff rolünü al
        const staffRoleId = db.get(`desteksistem_${interaction.guild.id}`)?.rol;
        if (!staffRoleId) {
            return interaction.reply({ content: "Staff rolü ayarlanmamış. Lütfen önce staff rolünü ayarlayın!", ephemeral: true });
        }
        
        const staffRole = guild.roles.cache.get(staffRoleId);
        if (!staffRole) {
            return interaction.reply({ content: "Geçersiz staff rolü. Lütfen doğru bir staff rolü ayarlayın!", ephemeral: true });
        }

        // Log Durumunu Kontrol Etme ve Kanalları Oluşturma
        if (bool === "aç") {
            // Logları aç
            db.set(`logdurum_${guildId}`, 'açık');

            // Kanalları oluştur
            await interaction.reply({ content: "Log kanalları oluşturuluyor... Lütfen bekleyin.", ephemeral: true });

            const logCategoryName = "Log Kanalları";
            let logCategory = guild.channels.cache.find(c => c.name === logCategoryName && c.type === ChannelType.GuildCategory);

            if (!logCategory) {
                logCategory = await guild.channels.create({
                    name: logCategoryName,
                    type: ChannelType.GuildCategory
                });
            }

            const logChannelNames = [
                'destek-gecmisi' // Yalnızca bu kanal kaydedilecek
            ];

            const logChannels = {};

            for (let name of logChannelNames) {
                let existingChannel = guild.channels.cache.find(c => c.name === name);
                if (existingChannel) {
                    await existingChannel.delete();
                    db.delete(`logchanneldestekgecmisi_${guildId}`);
                }
            }

            for (let name of logChannelNames) {
                let newChannel = await guild.channels.create({
                    name: name,
                    type: ChannelType.GuildText,
                    topic: `Log kanalı: ${name.replace('-', ' ').toUpperCase()}`,
                    parent: logCategory.id,
                    permissionOverwrites: [
                        {
                            id: guild.id,
                            deny: ['ViewChannel'], // Sunucu üyelerine engelleme
                        },
                        {
                            id: staffRole.id,
                            allow: ['ViewChannel'], // Sadece staff rolüne görünürlük izni ver
                        }
                    ]
                });
                logChannels[name] = newChannel.id;
            }

            db.set(`logchanneldestekgecmisi_${guildId}`, logChannels['destek-gecmisi']);

            return interaction.editReply({ content: "Loglar başarıyla açıldı ve log kanalları oluşturuldu.", ephemeral: true });
        }

        if (bool === "kapat") {
            db.set(`logdurum_${guildId}`, 'kapalı');
            return interaction.reply({ content: "Loglar başarıyla kapatıldı!" });
        }
    }
};
