const { PermissionsBitField } = require("discord.js");
const db = require("croxydb");

module.exports = {
    name: "destek-ayarla",
    description: "Destek sistemini ayarlarsınız.",
    type: 1,
    options: [
        {
            name: "yetkili-rol",
            description: "Destek sistemindeki yetkili rolünü belirler.",
            required: true,
            type: 8
        },
        {
            name: "kanal",
            description: "Destek sisteminin kurulacağı kanal.",
            required: true,
            type: 7,
            channel_types: [0]
        },
        {
            name: "ticket-kategori",
            description: "Ticket'ların oluşturulacağı kategori.",
            required: true,
            type: 7,
            channel_types: [4] // Kategori tipi (Kategori kanal türü)
        }
    ],
    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({
                content: "Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olmanız gerekiyor."
            });
        }

        const rol = interaction.options.getRole("yetkili-rol");
        const kanal = interaction.options.getChannel("kanal");
        const kategori = interaction.options.getChannel("ticket-kategori");

        db.set(`desteksistem_${interaction.guild.id}`, { 
			rol: rol.id, 
			kanal: kanal.id, 
			kategori: kategori.id, 
			embed: true,  // Embed verisi ekleniyor
			buton: true   // Buton verisi ekleniyor
		});

        interaction.reply({
            content: `Destek sistemi başarıyla ayarlandı:\n` +
                `Yetkili Rolü: ${rol}\n` +
                `Destek Kanalı: ${kanal}\n` +
                `Ticket Kategorisi: ${kategori}`
        });
    }
};
