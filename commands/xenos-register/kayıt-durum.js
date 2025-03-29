const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const db = require("croxydb");

module.exports = {
    name: "kayıt-durum",
    description: "Kayıt durumunu gösterir.",
    type: 1,
    options: [],
    
    run: async(client, interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) 
            return interaction.reply({ content: "Bunun için gerekli yetkin yok!", ephemeral: true });
        
        const roles = [
            { key: 'erkek', label: 'Erkek Rolü', description: 'Erkek kullanıcıların sahip olduğu rol.' },
            { key: 'erkek2', label: 'Erkek-2 Rolü', description: 'Alternatif erkek rolü.' },
            { key: 'kadın', label: 'Kadın Rolü', description: 'Kadın kullanıcıların sahip olduğu rol.' },
            { key: 'kadın2', label: 'Kadın-2 Rolü', description: 'Alternatif kadın rolü.' },
            { key: 'kayityetkili', label: 'Kayıt-Yetkili Rolü', description: 'Kayıt işlemleriyle ilgilenen yetkili rolü.' },
            { key: 'otorol', label: 'Kayıtsız Rolü', description: 'Kayıtsız kullanıcıların rolü.' },
            { key: 'kayitkanal', label: 'Kayıtsız Kanalı', description: 'Kayıtsız kullanıcıların yazabileceği kanal.' },
            { key: 'kayıtgif', label: 'Kayıt Gif', description: 'Kayıt işlemi sırasında gösterilen GIF.' },
        ];
        
        let embedDescription = "";

        for (let role of roles) {
            const roleData = db.get(`${role.key}_${interaction.guild.id}`);
            const roleText = roleData === undefined ? "`Ayarlanmamış ❌`" : role.key === 'kayitkanal' ? `<#${roleData}>` : role.key === 'kayıtgif' ? `[${"> Link <"}](${roleData})` : `<@&${roleData}>`;
            embedDescription += `**${role.label}**: ${roleText} - ${role.description}\n\n`;
        }
        
        const embed = new EmbedBuilder()
            .setTitle(`${interaction.guild.name} - Kayıt Durumu`)
            .setDescription(embedDescription)
            .setThumbnail(interaction.guild.iconURL())  // Sunucu thumbnail'ı eklendi
            .setFooter({ text: `Komutu kullanan: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setColor("#7289DA") // Renk sabit
            .setTimestamp(); // Mesajın zamanını ekle

        await interaction.reply({ embeds: [embed] });
    },
};
