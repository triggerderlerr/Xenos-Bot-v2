const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const db = require("croxydb");

module.exports = {
    name: "rol-koruma",
    description: "Rol silme/oluşturma koruma sistemini açar/kapatır.",
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
            db.set(`roleGuard_${guildId}`, true);
            
            const embed = new EmbedBuilder()
                .setColor("Green")
                .setTitle("Rol Koruma Sistemi Aktif")
                .setDescription("Rol koruma sistemi başarıyla aktif edildi.\n\nKorunan İşlemler:\n• Rol Silme\n• Rol Oluşturma\n• Rol Düzenleme\n• Toplu Rol Verme/Alma")
                .setTimestamp();
            
            return interaction.reply({ embeds: [embed] });
        } else {
            db.delete(`roleGuard_${guildId}`);
            
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("Rol Koruma Sistemi Devre Dışı")
                .setDescription("Rol koruma sistemi devre dışı bırakıldı.")
                .setTimestamp();
            
            return interaction.reply({ embeds: [embed] });
        }
    }
}; 