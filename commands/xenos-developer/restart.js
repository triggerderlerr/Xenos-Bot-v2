const { Client, EmbedBuilder } = require("discord.js");
const config = require('../../utils/constants/config.json');
const messages = require('../../utils/constants/messages');

module.exports = {
    name: "restart",
    description: "Botu yeniden başlatır.",
    type: 1,

    run: async (client, interaction) => {
        // Kullanıcının gerekli yetkiye sahip olup olmadığını kontrol et
        if (!(interaction.user.id === config.owner)) {
            return interaction.reply({ content: "Bunun için gerekli yetkiniz bulunmuyor!", ephemeral: true });
        }

        // Yeniden başlatma mesajı
const embed = new EmbedBuilder()
    .setColor('Random')
    .setTitle('🔄 Bot Yeniden Başlatılıyor!')
    .setDescription('Bot, yeniden başlatılma sürecindedir. Lütfen bekleyin...')
    .setThumbnail(`${client.user.displayAvatarURL({ dynamic: true})}`)
    .addFields(
        { name: 'Durum', value: 'Yeniden başlatma işlemi başlatıldı.', inline: true },
        { name: 'Tahmini Süre', value: '5 saniye', inline: true } // Tahmini süre 5 saniye olarak güncellendi
    )
    .setFooter({ 
        text: 'Sabırlı olduğunuz için teşekkür ederiz!', 
        iconURL: interaction.user.displayAvatarURL() // Kullanıcı avatarı burada
    }) 
    .setTimestamp() // Mesajın zaman damgası
    .setAuthor({ 
        name: client.user.username, // Botun adı otomatik olarak çekiliyor
        iconURL: client.user.displayAvatarURL() // Botun avatarı otomatik olarak çekiliyor
    });




        // Kullanıcıya yanıt ver ve botu kapat
        interaction.reply({ embeds: [embed] }).then(() => {
            console.log(`BOT: Bot yeniden başlatılıyor...`);
            process.exit(0);
        });
    }
};
