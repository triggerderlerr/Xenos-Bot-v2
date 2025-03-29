const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const db = require("croxydb");

module.exports = {
    name: "kanal-koruma",
    description: "Kanal silme/oluşturma koruma sistemini açar/kapatır.",
    type: 1,
    options: [
        {
            name: "işlem",
            description: "Koruma sistemini açmak/kapatmak için seçim yapın.",
            type: 3,
            required: true,
            choices: [
                { name: "Aç", value: "aç" },
                { name: "Kapat", value: "kapat" }
            ]
        }
    ],

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({
                content: "Bu komutu kullanmak için Yönetici yetkisine sahip olmalısın!",
                ephemeral: true
            });
        }

        const işlem = interaction.options.getString("işlem");
        const guildId = interaction.guild.id;

        if (işlem === "aç") {
            db.set(`channelGuard_${guildId}`, true);
            
            const embed = new EmbedBuilder()
                .setColor("Green")
                .setTitle("Kanal Koruma Sistemi Aktif")
                .setDescription("Kanal koruma sistemi başarıyla aktif edildi.\n\nKorunan İşlemler:\n• Kanal Silme\n• Kanal Oluşturma\n• Kanal Düzenleme\n• Kanal İzinleri Değiştirme")
                .setTimestamp();
            
            return interaction.reply({ embeds: [embed] });
        } else {
            db.delete(`channelGuard_${guildId}`);
            
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("Kanal Koruma Sistemi Devre Dışı")
                .setDescription("Kanal koruma sistemi devre dışı bırakıldı.")
                .setTimestamp();
            
            return interaction.reply({ embeds: [embed] });
        }
    }
}; 