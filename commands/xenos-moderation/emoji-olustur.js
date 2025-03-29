const { PermissionsBitField } = require("discord.js");

module.exports = {
    name: "emoji-oluştur",
    description: 'Yeni bir emoji ekleyin!',
    type: 1,
    options: [
        {
            name: "url",
            description: "Emoji URL.",
            type: 3,
            required: true
        },
        {
            name: "name",
            description: "Emoji ismi",
            type: 3,
            required: true
        },
    ],
    run: async (client, interaction, args) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return interaction.reply({ content: "Rolleri Yönet Yetkin Yok!", ephemeral: true });
        }

        let URL = interaction.options.getString('url');
        const name = interaction.options.getString('name');

        // URL'nin geçerliliğini kontrol et
        if (!URL.startsWith('https')) {
            return interaction.reply({ content: "Geçersiz URL. Lütfen geçerli bir URL girin.", ephemeral: true });
        }

        // Parametreleri kaldır ve hareketlilik kontrolü yap
        const isAnimated = URL.includes('animated=true'); // Hareketli emoji kontrolü
        URL = URL.split('?')[0]; // "?" ile başlayan kısmı keser

        // Eğer .webp uzantılıysa ve animated=true içeriyorsa, uzantıyı .gif ile değiştir
        if (isAnimated && URL.endsWith('.webp')) {
            URL = URL.replace('.webp', '.gif');
        }

        // Emoji türünü belirleme
        const emojiType = isAnimated ? "Hareketli" : "Statik";

        try {
            const emoji = await interaction.guild.emojis.create({ attachment: URL, name: name });
            return interaction.reply({ 
                content: `Emoji başarıyla oluşturuldu: ${emoji}\nTür: ${emojiType}`, 
                ephemeral: false 
            });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: "Hata: Emoji oluşturulamadı.", ephemeral: true });
        }
    }
};
