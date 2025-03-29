const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const db = require("croxydb");

module.exports = {
    name: "kayıt-ayarla",
    description: 'Kayıt sisteminin ayarlarını yaparsınız!',
    type: 1,
    options: [
        {
            name: "erkek-rol",
            description: "Lütfen erkek rolü etiketleyin!",
            type: 8,
            required: true
        },
        {
            name: "kadın-rol",
            description: "Lütfen kadın rolü etiketleyin!",
            type: 8,
            required: true
        },
        {
            name: "kayıtsız-kanal",
            description: "Kayıtsız mesajlarının gönderileceği kanalı ayarlayın!",
            type: 7,
            required: true,
            channel_types: [0] // Text channel
        },
        {
            name: "kayıtsız-rol",
            description: "Sunucuya gelenlere belirlediğin rolü otomatik verir!",
            type: 8,
            required: true
        },
        {
            name: "kayıt-yetkili",
            description: "Kayıt yetkilisi ayarlarsınız!",
            type: 8,
            required: true
        },
        {
            name: "kayıt-gif",
            description: "Bir hoşgeldin gif'i ekle!",
            type: 3,
            required: true
        },
        {
            name: "erkek-rol2",
            description: "Lütfen ikinci erkek rolü etiketleyin!",
            type: 8,
            required: false
        },
        {
            name: "kadın-rol2",
            description: "Lütfen ikinci kadın rolü etiketleyin!",
            type: 8,
            required: false
        },
        {
            name: "kayıt-emojiler",
            description: 'Kayıt sisteminin emojilerini kurar!',
            type: 3,
            required: false
        }
    ],
    run: async(client, interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles) && !interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.reply({ content: "Rolleri veya Kanalları Yönet Yetkin Yok!", ephemeral: true });
        }

        // Erkek rol ayarları
        const erkekRol = interaction.options.getRole('erkek-rol');
        const erkekRol2 = interaction.options.getRole('erkek-rol2') || erkekRol;
        db.set(`erkek_${interaction.guild.id}`, erkekRol.id);
        db.set(`erkek2_${interaction.guild.id}`, erkekRol2.id);

        // Kadın rol ayarları
        const kadınRol = interaction.options.getRole('kadın-rol');
        const kadınRol2 = interaction.options.getRole('kadın-rol2') || kadınRol;
        db.set(`kadın_${interaction.guild.id}`, kadınRol.id);
        db.set(`kadın2_${interaction.guild.id}`, kadınRol2.id);

        // Kayıtsız kanal ayarları
        const kanal2 = interaction.options.getChannel('kayıtsız-kanal');
        db.set(`kayitkanal_${interaction.guild.id}`, kanal2.id);

        // Kayıtsız rol ayarları
        const kayitsizRol = interaction.options.getRole('kayıtsız-rol');
        db.set(`otorol_${interaction.guild.id}`, kayitsizRol.id);

        // Kayıt yetkili rolü ayarları
        const kayitYetkiliRol = interaction.options.getRole('kayıt-yetkili');
        db.set(`kayityetkili_${interaction.guild.id}`, kayitYetkiliRol.id);

        // Kayıt gif URL ayarları
        const kayıtGifURL = interaction.options.getString('kayıt-gif');
        if (kayıtGifURL.startsWith('https')) {
            db.set(`kayıtgif_${interaction.guild.id}`, kayıtGifURL);
        } else {
            return interaction.reply({ content: "Geçersiz URL." });
        }

        // Kayıt emojilerini kurma
        const emojiNames = ['rightarrow1', 'verify1', 'infinity1', 'account1'];
        const emojiUrls = [
            "https://emoji.discadia.com/emojis/a6d81569-eb5c-4290-b4bf-d5fe9a75cd9e.gif",
            "https://emoji.discadia.com/emojis/33517d29-1da3-4a23-8536-374ce6664388.gif",
            "https://emoji.discadia.com/emojis/bbeb9f99-d22d-4706-b824-4e11794c09d8.GIF",
            "https://cdn.discordapp.com/emojis/1251222509811007568.webp?size=96&quality=lossless"
        ];

        for (let i = 0; i < emojiNames.length; i++) {
            let emoji = client.emojis.cache.find(e => e.name === emojiNames[i]);
            if (!emoji) {
                await interaction.guild.emojis.create({ attachment: emojiUrls[i], name: emojiNames[i] });
            }
        }

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('Kayıt Ayarları')
            .setDescription('Kayıt sisteminiz başarıyla ayarlandı!')
            .setThumbnail(interaction.guild.iconURL())  // Sunucu thumbnail'ı eklendi
            .addFields(
                { name: 'Erkek Rolü', value: `<@&${erkekRol.id}>`, inline: true },
                { name: 'İkinci Erkek Rolü', value: `<@&${erkekRol2.id}>`, inline: true },
                { name: 'Kadın Rolü', value: `<@&${kadınRol.id}>`, inline: true },
                { name: 'İkinci Kadın Rolü', value: `<@&${kadınRol2.id}>`, inline: true },
                { name: 'Kayıtsız Kanal', value: `<#${kanal2.id}>`, inline: true },
                { name: 'Kayıtsız Rolü', value: `<@&${kayitsizRol.id}>`, inline: true },
                { name: 'Kayıt Yetkilisi Rolü', value: `<@&${kayitYetkiliRol.id}>`, inline: true },
                { name: 'Kayıt GIF\'i', value: `[Hoşgeldin GIF](${kayıtGifURL})`, inline: true }
            )
            .setFooter({ text: `Sunucu: ${interaction.guild.name}` });

        interaction.reply({ embeds: [embed] });
    }
};
