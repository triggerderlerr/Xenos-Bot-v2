const { PermissionsBitField, ChannelType } = require("discord.js");
const db = require("croxydb");
const config = require('../../utils/constants/config.json');
const { EmbedBuilder } = require('discord.js');
const messages = require('../../utils/constants/messages');

module.exports = {
    name: "create-invite",
    description: "Bir sunucu daveti oluşturur.",
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
        const guild = client.guilds.cache.get(serverID);
        
        if (!guild) {
            return interaction.reply({ content: "Geçersiz sunucu ID'si!", ephemeral: true });
        }

        // İlk metin kanalını bul
        const channel = guild.channels.cache.find((ch) => ch.type === ChannelType.GuildText);
        
        if (!channel) {
            return interaction.reply({ content: "Bu sunucuda metin kanalı bulunamadı.", ephemeral: true });
        }

        try {
            const invite = await channel.createInvite({ maxAge: 0, maxUses: 0 });
            const inviteLink = `${guild.name} - ${invite.url}`;
            
            // Davet bağlantısını veritabanına kaydet
            await db.set(`invite_${guild.id}`, inviteLink); 

            interaction.reply({ content: `Davet bağlantısı oluşturuldu: ${inviteLink}`, ephemeral: true });
        } catch (error) {
            console.error(error);
            if (error.code === 50013) {
                // Gerekli izinlerin olmaması durumu
                interaction.reply({ content: "Botun gerekli izinleri bulunmuyor. Lütfen botun kanalda `Davet Oluştur` iznine sahip olduğundan emin olun.", ephemeral: true });
            } else {
                interaction.reply({ content: "Davet bağlantısı oluşturulurken bir hata oluştu.", ephemeral: true });
            }
        }
    }
};
