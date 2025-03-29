const { EmbedBuilder, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require("discord.js");
const Discord = require("discord.js");
const db = require("croxydb");

module.exports = {
  name: "genel-durum",
  description: "Genel durumu gösterir.",
  type: 1,
  options: [],
  
  run: async(client, interaction) => {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return interaction.reply({ content: "Bunun için gerekli yetkin yok!", ephemeral: true });
    
    let erkek = db.get(`erkek_${interaction.guild.id}`);
    let whitelist = db.get(`erkek2_${interaction.guild.id}`);
    let kadın = db.get(`kadın_${interaction.guild.id}`);
    let whitelist2 = db.get(`kadın2_${interaction.guild.id}`);
    let regstaff = db.get(`kayityetkili_${interaction.guild.id}`);
    let kayıtsız = db.get(`otorol_${interaction.guild.id}`);
    let kayıtsızkanal = db.get(`kayitkanal_${interaction.guild.id}`);
    let kayıtgif = db.get(`kayıtgif_${interaction.guild.id}`);
    let kufur = db.get(`kufurengel_${interaction.guild.id}`);
    let antispam = db.get(`antispam_${interaction.guild.id}`);
    let reklam = db.get(`reklamengel_${interaction.guild.id}`);
    let statkanal1 = db.get(`statkanal1_${interaction.guild.id}`);
    let statkanal2 = db.get(`statkanal2_${interaction.guild.id}`);
    let statkanal3 = db.get(`statkanal3_${interaction.guild.id}`);
    let statkanal4 = db.get(`statkanal4_${interaction.guild.id}`);
    let logdurum = db.get(`logdurum_${interaction.guild.id}`);
    let logkanal = db.get(`logchannels_${interaction.guild.id}`);
    let statsdurum = db.get(`statsdurum_${interaction.guild.id}`);
    
    const embed = new EmbedBuilder()
      .setTitle(`${interaction.guild.name} - Veritabanı`)
      .setDescription(`**・Kayıt Sistemi ↷**\n
        Erkek Rolü = ${erkek ? `<@&${erkek}>` : "`Ayarlanmamış ❌`"}
        Erkek-2 Rolü = ${whitelist ? `<@&${whitelist}>` : "`Ayarlanmamış ❌`"}
        Kadın Rolü = ${kadın ? `<@&${kadın}>` : "`Ayarlanmamış ❌`"}
        Kadın-2 Rolü = ${whitelist2 ? `<@&${whitelist2}>` : "`Ayarlanmamış ❌`"}
        Kayıt-Yetkili Rolü = ${regstaff ? `<@&${regstaff}>` : "`Ayarlanmamış ❌`"}
        Kayıtsız Rolü = ${kayıtsız ? `<@&${kayıtsız}>` : "`Ayarlanmamış ❌`"}
        Kayıtsız Kanalı = ${kayıtsızkanal ? `<#${kayıtsızkanal}>` : "`Ayarlanmamış ❌`"}
        Kayıt Gif = ${kayıtgif ? `[> Link <](${kayıtgif})` : "`Ayarlanmamış ❌`"}
      `)
      .setFooter({ text: `Komutu kullanan: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setColor("Random")
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }));
    
    const embed2 = new EmbedBuilder()
      .setTitle(`${interaction.guild.name} - Veritabanı`)
      .setDescription(`**・Koruma Sistemi ↷**\n
        Küfür Engel = ${kufur === 'açık' ? "`Açık ✅`" : "`Kapalı ❌`"}
        Anti Spam = ${antispam === 'açık' ? "`Açık ✅`" : "`Kapalı ❌`"}
        Link Engel = ${reklam === 'açık' ? "`Açık ✅`" : "`Kapalı ❌`"}
      `)
      .setFooter({ text: `Komutu kullanan: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setColor("Random")
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }));
    
    const embed3 = new EmbedBuilder()
      .setTitle(`${interaction.guild.name} - Veritabanı`)
      .setDescription(`**・Stats Sistemi ↷**\n
        Stats Durum = ${statsdurum === 'açık' ? "`Açık ✅`" : "`Kapalı ❌`"}
        Toplam Üye Kanalı = ${statkanal1 ? `<#${statkanal1}>` : "`Ayarlanmamış ❌`"}
        Toplam Kullanıcı Kanalı = ${statkanal2 ? `<#${statkanal2}>` : "`Ayarlanmamış ❌`"}
        Bot Sayısı Kanalı = ${statkanal3 ? `<#${statkanal3}>` : "`Ayarlanmamış ❌`"}
        Aktiflik Kanalı = ${statkanal4 ? `<#${statkanal4}>` : "`Ayarlanmamış ❌`"}
      `)
      .setFooter({ text: `Komutu kullanan: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setColor("Random")
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }));
    
    const embed4 = new EmbedBuilder()
      .setTitle(`${interaction.guild.name} - Veritabanı`)
      .setDescription(`**・Log Sistemi ↷**\n
        Log Durum = ${logdurum === 'açık' ? "`Açık ✅`" : "`Kapalı ❌`"}
        Log Kanalı = ${logkanal ? `<#${logkanal}>` : "`Ayarlanmamış ❌`"}
      `)
      .setFooter({ text: `Komutu kullanan: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setColor("Random")
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel("Kayıt")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("gkayıt"),
        new ButtonBuilder()
          .setLabel("Koruma")
          .setStyle(ButtonStyle.Success)
          .setCustomId("gkoruma"),
        new ButtonBuilder()
          .setLabel("Stats")
          .setStyle(ButtonStyle.Primary)
          .setCustomId("gstats"),
        new ButtonBuilder()
          .setLabel("Logs")
          .setStyle(ButtonStyle.Danger)
          .setCustomId("glogs")
      );
    
    const msg = await interaction.reply({ embeds: [embed], components: [row] });

    const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

    collector.on('collect', async interaction => {
      if (interaction.customId === 'gkayıt') {
        return interaction.update({ embeds: [embed] });
      } else if (interaction.customId === 'gkoruma') {
        return interaction.update({ embeds: [embed2] });
      } else if (interaction.customId === 'gstats') {
        return interaction.update({ embeds: [embed3] });
      } else if (interaction.customId === 'glogs') {
        return interaction.update({ embeds: [embed4] });
      }
    });
    
    collector.on('end', collected => {
      collector.stop();
    });
  }
};
