const { PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "herkese-rol-ayarla",
    description: "Herkese rol verme veya herkesten rol alma işlemi yapar.",
    type: 1,
    options: [
        {
            name: "işlem",
            description: "Yapılacak işlemi seçin.",
            type: 3, // 3 corresponds to STRING type
            required: true,
            choices: [
                { name: "Ver", value: "ver" },
                { name: "Al", value: "al" },
            ],
        },
        {
            name: "rol",
            description: "Lütfen bir rol etiketle!",
            type: 8, // 8 corresponds to the ROLE type
            required: true,
        },
    ],

    run: async (client, interaction) => {
        // Kullanıcının gerekli yetkiye sahip olup olmadığını kontrol et
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: "Bunun için gerekli yetkin yok!", ephemeral: true });
        }

        const işlem = interaction.options.getString("işlem");
        const rol = interaction.options.getRole('rol');

        let successCount = 0;
        let failureCount = 0;

        // Roller dağıtılıyor veya alınıyor mesajı gönder
        await interaction.reply(`${işlem === 'ver' ? "Roller dağıtılıyor..." : "Roller alınıyor..."}`);

        // Her üye için işlem yap
        const members = await interaction.guild.members.fetch(); // Tüm üyeleri al

        for (const member of members.values()) {
            try {
                if (işlem === 'ver') {
                    await member.roles.add(rol); // Roller veriliyor
                } else {
                    await member.roles.remove(rol); // Roller alınıyor
                }
                successCount++; // Başarı sayısını artır
            } catch (error) {
                failureCount++; // Hata sayısını artır
                console.error(`Üyeden rol alınırken/sızılırken hata: ${error}`);
            }
        }

        // Embed mesajı oluştur
        const embed = new EmbedBuilder()
            .setColor("#0099ff")
            .setTitle("Rol İşlemi Tamamlandı")
            .setDescription(`${işlem === 'ver' ? "Roller başarıyla verildi!" : "Roller başarıyla alındı!"}`)
            .addFields(
                { name: "Başarıyla Yapılan İşlem Sayısı", value: `${successCount}`, inline: true },
                { name: "Hata Sayısı", value: `${failureCount}`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `Komutu kullanan: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

        // Onay mesajını gönder
        await interaction.followUp({ embeds: [embed] });
    },
};
