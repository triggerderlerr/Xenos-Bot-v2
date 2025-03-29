const { PermissionsBitField } = require("discord.js");
const db = require("croxydb");

module.exports = {
    name: "otorol-ayarla",
    description: "Sunucuya katılanlara otomatik rol verir.",
    type: 1,
    options: [
        {
            name: "rol",
            description: "Verilecek rolü seçin.",
            type: 8, // Role type
            required: true
        }
    ],
    run: async (client, interaction) => {
        // Kullanıcının Yönetici yetkisine sahip olup olmadığını kontrol et
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: "Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olmalısın.", ephemeral: true });
        }

        // Rolü al
        const rol = interaction.options.getRole("rol");

        // Veritabanına rolü kaydet
        db.set(`otorol_${interaction.guild.id}`, rol.id);

        interaction.reply({ content: `Otomatik rol başarıyla ${rol.name} olarak ayarlandı.`, ephemeral: true });
    }
};
