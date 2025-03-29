const { Client, EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    name: "sil",
    description: 'Belirtilen sayıda mesajı sohbetten siler.',
    type: 1,
    options: [
        {
            name: "sayı",
            description: "Silinecek mesaj sayısını girin (1-100 arası).",
            type: 4, // INTEGER type for number input
            required: true
        },
    ],
    run: async (client, interaction) => {
        // Yetki kontrolü
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.reply({ content: "❌ Bu komutu kullanmak için 'Mesajları Yönet' yetkisine sahip olmalısınız!", ephemeral: true });
        }

        const sayi = interaction.options.getInteger('sayı');

        // Geçerli bir sayı aralığı kontrolü
        if (sayi < 1 || sayi > 100) {
            return interaction.reply({ content: "❌ Silinecek mesaj sayısı 1 ile 100 arasında olmalıdır!", ephemeral: true });
        }

        try {
            // Mesajları silme işlemi
            const deletedMessages = await interaction.channel.bulkDelete(sayi, true);
            await interaction.reply({ content: `✅ Başarıyla ${deletedMessages.size} adet mesaj silindi.`, ephemeral: true });

            // Yanıtı 10 saniye sonra sil
            setTimeout(() => interaction.deleteReply().catch(console.error), 10000);
        } catch (error) {
            console.error("Mesaj silinirken bir hata oluştu:", error);
            await interaction.reply({ content: "❌ Mesajlar silinirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.", ephemeral: true });
        }
    }
};