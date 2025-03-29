const { EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const db = require("croxydb");

module.exports = {
    name: "destek-sistemi",
    description: "Destek sistemini açarsınız.",
    type: 1,
    options: [],
    run: async (client, interaction) => {

        const yetki = new EmbedBuilder()
            .setAuthor({ name: "Yetkin Yetmiyor", iconURL: interaction.member.displayAvatarURL() })
            .setDescription("Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olman gerekiyor.");

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ embeds: [yetki], ephemeral: true });
        }

        const sistem = db.fetch(`desteksistem_${interaction.guild.id}`);

        const ayarlanmamis = new EmbedBuilder()
            .setAuthor({ name: "Hata", iconURL: interaction.member.displayAvatarURL() })
            .setDescription("Destek sistemi ayarlanmamış.\nAyarlamak için: `/destek-ayarla`");

        if (!sistem || !sistem.rol || !sistem.kanal || !sistem.buton) {
            return interaction.reply({ embeds: [ayarlanmamis], ephemeral: true });
        }

        // Buton oluşturma
        const button = new ButtonBuilder()
            .setCustomId("destekbuton")
            .setLabel("Ticket Oluştur")
            .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder()
            .addComponents(button);

        // Modern Embed mesajı oluşturma
        const nice = new EmbedBuilder()
            .setColor("#4CAF50")
            .setAuthor({ name: "Destek Sistemi", iconURL: interaction.guild.iconURL() })
            .setTitle("Destek Talebinizi Başlatın!")
            .setDescription("Merhaba! Yardım almak için lütfen aşağıdaki **Ticket Oluştur** butonuna tıklayın. " +
                "Sizlere en kısa sürede yardımcı olacağız.")
            .addFields(
                { name: "Nasıl Yardım Alabilirsiniz?", value: "1. **Ticket Oluştur** butonuna tıklayın.\n2. Sorununuzu açıkça yazın.\n3. Yetkili kişiler en kısa sürede size ulaşacaktır." },
                { name: "Destek Kuralları", value: "1. Küfür ve hakaret etmekten kaçının.\n2. Gereksiz spam yapmamaya özen gösterin.\n3. Yetkililere karşı lütfen saygılı olun." }
            )
            .setThumbnail(interaction.guild.iconURL())
            .setFooter({ text: "Destek Sistemi", iconURL: interaction.guild.iconURL() })
            .setTimestamp();

        // Belirlenen kanala mesaj gönderme
        const kanal = interaction.guild.channels.cache.get(sistem.kanal);

        if (!kanal) {
            return interaction.reply({ content: "Destek kanalına erişilemiyor.", ephemeral: true });
        }

        try {
            await kanal.send({ embeds: [nice], components: [row] });
            // Sadece burada reply yapılacak
            interaction.reply({ content: "Destek sistemi kuruldu ve mesaj kanala gönderildi.", ephemeral: true });
        } catch (error) {
            console.error("Mesaj gönderilirken bir hata oluştu:", error);
            interaction.reply({ content: "Mesaj gönderilirken bir hata oluştu.", ephemeral: true });
        }
    }
};
