const { PermissionsBitField } = require("discord.js");
const db = require("croxydb");
const config = require('../../utils/constants/config.json');
const { EmbedBuilder } = require('discord.js');
const messages = require('../../utils/constants/messages');

module.exports = {
    name: "leave",
    description: 'Bot\'u sunucudan çıkarır!',
    type: 1,
    options: [
        {
            name: "id",
            description: "Sunucu ID'si.",
            type: 3,
            required: true
        },
    ],
    run: async (client, interaction) => {
        // Yetki kontrolü
        if (!(interaction.user.id === config.owner)) {
            return interaction.reply({ content: "Bunun için gerekli yetkiniz bulunmuyor!", ephemeral: true });
        }

        const serverID = interaction.options.getString('id');

        // Geçerli bir sunucu ID kontrolü
        const guild = client.guilds.cache.get(serverID);
        if (!guild) {
            return interaction.reply({ content: "Geçersiz sunucu ID'si!", ephemeral: true });
        }

        try {
            // Davet bağlantılarını iptal et
            const invites = await guild.invites.fetch();
            invites.forEach(invite => invite.delete().catch(console.error)); // Her daveti iptal et

            // Botu sunucudan çıkar
            await guild.leave();
            interaction.reply(`Bot başarıyla **${guild.name}** (${serverID}) ID'li sunucudan ayrıldı.`);
        } catch (error) {
            console.error(error);
            interaction.reply({ content: "Bot sunucudan ayrılırken bir hata oluştu.", ephemeral: true });
        }
    }
};
