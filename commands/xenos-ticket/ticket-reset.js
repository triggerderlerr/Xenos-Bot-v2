const { PermissionsBitField } = require("discord.js");
const db = require("croxydb");

module.exports = {
    name: "destek-sıfırla",
    description: 'Destek sistemini sıfırlarsınız.',
    type: 1,
    options: [],
    run: async (client, interaction) => {

        // Yetki kontrolü
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({
                content: "Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olmanız gerekiyor."
            });
        }

        // Destek sistemini veritabanından al
        const sistem = db.fetch(`desteksistem_${interaction.guild.id}`);

        // Eğer destek sistemi ayarlanmamışsa
        if (!sistem) {
            return interaction.reply({
                content: "Destek sistemi kurulmamış. Önce ayarlamalısınız."
            });
        }

        // Destek sistemini sıfırla
        db.delete(`desteksistem_${interaction.guild.id}`);

        interaction.reply({
            content: "Destek sistemi başarıyla sıfırlandı."
        });
    }
};
