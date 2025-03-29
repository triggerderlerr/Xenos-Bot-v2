const { PermissionsBitField } = require("discord.js");
const db = require("croxydb");

module.exports = {
    name: "join-leave-log",
    description: "Sunucuda gelen ve giden üyeler için kanal ayarını yapar.",
    type: 1,
    options: [
        {
            name: "kanal",
            description: "Gelen ve giden üyeleri bildirecek kanalı seçin.",
            type: 7, // Kanal type
            required: true
        }
    ],
    run: async (client, interaction) => {
        // Kullanıcının Yönetici yetkisine sahip olup olmadığını kontrol et
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: "Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olmalısın.", ephemeral: true });
        }

        // Kanalı al
        const kanal = interaction.options.getChannel("kanal");

        // Eğer kanal bir sohbet kanalı değilse hata mesajı
        if (kanal.type !== 0) {
            return interaction.reply({ content: "Lütfen bir sohbet kanalı seçin.", ephemeral: true });
        }

        // Veritabanına kanal bilgisi kaydedilir
        db.set(`gelenGidenKanal_${interaction.guild.id}`, kanal.id);

        interaction.reply({ content: `Gelen ve giden üyeler için kanal başarıyla ${kanal.name} olarak ayarlandı.`, ephemeral: true });
    }
};
