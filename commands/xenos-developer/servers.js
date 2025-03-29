const { Client, EmbedBuilder } = require("discord.js");
const config = require('../../utils/constants/config.json');
const messages = require('../../utils/constants/messages');

module.exports = {
    name: "sunucular",
    description: "Botun olduğu sunucuları gösterir.",
    type: 1,

    run: async (client, message) => {
        if (!(message.user.id === config.owner)) {
            return message.reply({ content: "Bunun için gerekli yetkiniz bulunmuyor!", ephemeral: true });
        }

        // Sunucu bilgilerini alma
        const guilds = client.guilds.cache.map(guild => ({ id: guild.id, name: guild.name }));
        const totalGuilds = guilds.length; // Toplam sunucu sayısını hesapla

        // Embed oluşturma
        const embed = new EmbedBuilder()
            .setColor('Random')
            .setTitle('🌐 Sunucu Listesi')
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setFooter({ 
                text: `Toplam Sunucu: ${totalGuilds} | Komutu Kullanan: ${message.user.username}`, 
                iconURL: message.user.displayAvatarURL({ dynamic: true }) 
            })
            .setTimestamp(); // Mesaja zaman damgası ekle

        // Sunucu bilgilerini ekle
        guilds.forEach((guild, index) => {
            embed.addFields({
                name: `Sunucu ${index + 1}: ${guild.name}`,
                value: `ID: ${guild.id}`,
                inline: false // Alanlar alt alta gelsin
            });
        });

        // Mesajı gönder
        message.reply({ embeds: [embed] });
    }
};
