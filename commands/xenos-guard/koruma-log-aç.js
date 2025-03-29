const { PermissionsBitField, ChannelType } = require("discord.js");
const db = require("croxydb");

module.exports = {
    name: "log-sistem",
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

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: "Yönetici yetkisine sahip olmalısınız!", ephemeral: true });
        }

        if (bool === "aç") {
            db.set(`logdurum_${guildId}`, 'açık');

            await interaction.reply({ content: "Log kanalları oluşturuluyor... Lütfen bekleyin.", ephemeral: true });

            const logCategoryName = "Log Kanalları";
            let logCategory = guild.channels.cache.find(c => c.name === logCategoryName && c.type === ChannelType.GuildCategory);

            if (!logCategory) {
                logCategory = await guild.channels.create({
                    name: logCategoryName,
                    type: ChannelType.GuildCategory
                });
            }

            const logChannelNames = ['destek-gecmisi', 'anti-badword', 'anti-reklam'];
            const logChannels = {};

            for (let name of logChannelNames) {
                let existingChannel = guild.channels.cache.find(c => c.name === name);
                if (existingChannel) await existingChannel.delete();
            }

            for (let name of logChannelNames) {
                let newChannel = await guild.channels.create({
                    name: name,
                    type: ChannelType.GuildText,
                    topic: `Log kanalı: ${name.replace('-', ' ').toUpperCase()}`,
                    parent: logCategory.id
                });
                logChannels[name] = newChannel.id;
            }

            db.set(`logchanneldestekgecmisi_${guildId}`, logChannels['destek-gecmisi']);
            db.set(`logchannelantibadword_${guildId}`, logChannels['anti-badword']);
            db.set(`logchannelantireklam_${guildId}`, logChannels['anti-reklam']);

            return interaction.editReply({ content: "Loglar başarıyla açıldı ve log kanalları oluşturuldu.", ephemeral: true });
        }

        if (bool === "kapat") {
            db.set(`logdurum_${guildId}`, 'kapalı');
            return interaction.reply({ content: "Loglar başarıyla kapatıldı!" });
        }
    }
};
