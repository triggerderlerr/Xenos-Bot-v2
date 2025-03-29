const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const db = require("croxydb");

module.exports = {
    name: "sunucu-koruma",
    description: "Sunucu ayarlarını koruma sistemini açar/kapatır.",
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
            db.set(`serverGuard_${guildId}`, true);
            
            const embed = new EmbedBuilder()
                .setColor("Green")
                .setTitle("Sunucu Koruma Sistemi Aktif")
                .setDescription("Sunucu ayarları koruma sistemi başarıyla aktif edildi.\n\nKorunan İşlemler:\n• Sunucu Ayarları Değişikliği\n• Sunucu İsmi Değişikliği\n• Sunucu Resmi Değişikliği")
                .setTimestamp();
            
            return interaction.reply({ embeds: [embed] });
        } else {
            db.delete(`serverGuard_${guildId}`);
            
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("Sunucu Koruma Sistemi Devre Dışı")
                .setDescription("Sunucu ayarları koruma sistemi devre dışı bırakıldı.")
                .setTimestamp();
            
            return interaction.reply({ embeds: [embed] });
        }
    }
}; 