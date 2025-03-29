const { PermissionsBitField, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const db = require("croxydb");
const config = require('../../utils/constants/config.json');
const messages = require('../../utils/constants/messages');

module.exports = {
    name: "kayıt",
    description: 'Kadın veya Erkek kayıt!',
    type: 1,
    options: [
        {
            name: "kullanıcı",
            description: "Rol verilecek kullanıcıyı seçin!",
            type: 6,
            required: true
        },
        {
            name: "cinsiyet",
            description: "Cinsiyet seçin!",
            type: 3,
            choices: [
                { name: "Kadın", value: "kadın" },
                { name: "Erkek", value: "erkek" }
            ],
            required: true
        },
        {
            name: "isim",
            description: "Kullanıcının İsmini Gir!",
            type: 3,
            required: true
        }
    ],
    run: async (client, interaction) => {
        const kayıtyetkili = db.get(`kayityetkili_${interaction.guild.id}`);
        
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles) && !interaction.member.roles.cache.has(kayıtyetkili)) {
            return interaction.reply({ content: "Bunun için yeterli yetkin yok!", ephemeral: true });
        }

        const getUser = interaction.options.getMember('kullanıcı');
        const getName = interaction.options.getString('isim');
        const cinsiyet = interaction.options.getString('cinsiyet');

        let rol, whitelist, kayıtsız, kayıtkanal, kayıtgif;

        if (cinsiyet === "kadın") {
            rol = db.fetch(`kadın_${interaction.guild.id}`);
            whitelist = db.fetch(`kadın2_${interaction.guild.id}`);
        } else {
            rol = db.fetch(`erkek_${interaction.guild.id}`);
            whitelist = db.fetch(`erkek2_${interaction.guild.id}`);
        }

        kayıtsız = db.fetch(`otorol_${interaction.guild.id}`);
        kayıtkanal = db.get(`kayitkanal_${interaction.guild.id}`);
        kayıtgif = db.get(`kayıtgif_${interaction.guild.id}`);
        
        if (!rol) return interaction.reply(`${cinsiyet === "kadın" ? "Kadın" : "Erkek"} rolü ayarlanmamış!`);
        if (!whitelist) return interaction.reply("Whitelist rolü ayarlanmamış!");
        if (!kayıtsız) return interaction.reply("Kayıtsız rolü ayarlanmamış!");
        if (!kayıtkanal) return interaction.reply("Kayıt kanalı ayarlanmamış!");

        if (getUser.roles.highest.position >= interaction.member.roles.highest.position) {
            return interaction.reply({ content: "Kendini ya da kendinden üst yetkilileri kayıt edemezsin!" });
        }

        let setName = getName[0].toUpperCase() + getName.slice(1);

        setTimeout(() => {
            getUser.setNickname(setName);
        }, 500);
        
        setTimeout(() => {
            interaction.guild.members.cache.get(getUser.id).roles.add([rol, whitelist]);
        }, 1500);
        
        setTimeout(() => {
            interaction.guild.members.cache.get(getUser.id).roles.remove(kayıtsız);
        }, 2500);

        const sonsuz = client.emojis.cache.find(emoji => emoji.name === config.infinity);
        
        const embed = new EmbedBuilder()
            .setColor('Random')
            .setThumbnail(cinsiyet === "kadın" ? 
                "https://cdn.discordapp.com/attachments/1188118049887367168/1242067305362358302/Custom-Icon-Design-Flatastic-7-Female.512.png?ex=664c7cd2&is=664b2b52&hm=0bf5486b1664455a5b285ca35804458763bd0b92b89d255b19c3d39b45589114&" : 
                "https://cdn.discordapp.com/attachments/1188118049887367168/1242065418621947975/male-symbol-blue-icon.png?ex=664c7b10&is=664b2990&hm=305860cea743814cda8dd232942cece77d54d5bd4008b21fef90bce43b77a98a&")
            .setDescription(`${sonsuz} ‍ **${interaction.guild.name}** ‍ ${sonsuz}
   
   • Kayıt edilen **kullanıcı**: <@${getUser.id}>\n     
   • Kayıt işleminde **verilen isim**: ${setName}\n
   • Kayıt işleminde **verilen rol**: <@&${rol}> **-** <@&${whitelist}>\n
   • Kayıt işleminde **alınan rol**: <@&${kayıtsız}>
   `)
            .setFooter({ text: `Komutu kullanan yetkili : ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
            .setImage(`${kayıtgif}`);

        interaction.reply({ embeds: [embed] });
    }
};
