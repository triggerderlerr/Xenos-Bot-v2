const { Client, EmbedBuilder, PermissionsBitField, ChannelType } = require("discord.js");
const db = require("croxydb");

module.exports = {
  name: "stats-ayarla",
  description: "Stats sistemini açıp kapatıp kanalları ayarlarsınız.",
  type: 1,
  options: [
    {
      name: "işlem",
      description: "Stats açılsın mı?",
      choices: [
        { name: "Aç", value: "aç" },
        { name: "Kapat", value: "kapat" }
      ],
      type: 3,
      required: true
    },
    {
      name: "kanal1",
      description: "Toplam üye sayısı",
      type: 7,
      required: true
    },
    {
      name: "kanal2",
      description: "Sunucuda bulunan toplam kullanıcı",
      type: 7,
      required: true
    },
    {
      name: "kanal3",
      description: "Bot sayısı",
      type: 7,
      required: true
    },
    {
      name: "kanal4",
      description: "Sunucu aktiflik durumu",
      type: 7,
      required: true
    },
  ],
  run: async (client, interaction) => {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) 
      return interaction.reply({ content: "Rolleri Yönet Yetkin Yok!", ephemeral: true });

    const işlem = interaction.options.getString('işlem');

    const embedKapalı = new EmbedBuilder()
      .setColor("Red")
      .setDescription("✅ **Sistem Kapatıldı** \n Stats Durumu Kapalı Hale Getirildi.");
    const embedAçık = new EmbedBuilder()
      .setColor("Green")
      .setDescription("✅ **Sistem Açıldı** \n Stats Durumu Açık Hale Getirildi.");

    if (işlem === 'kapat') {
      db.set(`statsdurum_${interaction.guild.id}`, 'kapalı');
      interaction.reply({embeds: [embedKapalı], allowedMentions: { repliedUser: false }});
      return;
    }

    if (işlem === 'aç') {
      db.set(`statsdurum_${interaction.guild.id}`, 'açık');
      interaction.reply({embeds: [embedAçık], allowedMentions: { repliedUser: false }});
    }

    const check = db.get(`statsdurum_${interaction.guild.id}`);
    if (check === 'kapalı') 
      return interaction.reply("Stats sistemini aktif etmeden bu komutu kullanamazsın! /stats aç/kapat");

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) 
      return interaction.reply({ content: "Kanalları Yönet Yetkin Yok!", ephemeral: true });

    const kanal1 = interaction.options.getChannel('kanal1');
    db.set(`statkanal1_${interaction.guild.id}`, kanal1.id);
    const kanal2 = interaction.options.getChannel('kanal2');
    db.set(`statkanal2_${interaction.guild.id}`, kanal2.id);
    const kanal3 = interaction.options.getChannel('kanal3');
    db.set(`statkanal3_${interaction.guild.id}`, kanal3.id);
    const kanal4 = interaction.options.getChannel('kanal4');
    db.set(`statkanal4_${interaction.guild.id}`, kanal4.id);

    const toplam = db.get(`statkanal1_${interaction.guild.id}`);
    const uye = db.get(`statkanal2_${interaction.guild.id}`);
    const bot = db.get(`statkanal3_${interaction.guild.id}`);
    const stats = db.get(`statkanal4_${interaction.guild.id}`);

    interaction.guild.channels.cache.get(stats).setName(
      `🟢 ${interaction.guild.members.cache.filter(m => m.presence?.status == 'online').size} ⛔ ${interaction.guild.members.cache.filter(m => m.presence?.status == 'dnd').size} 🌙 ${interaction.guild.members.cache.filter(m => m.presence?.status == 'idle').size} ⚫ ${interaction.guild.members.cache.filter(m => m.presence?.status == 'offline' || !m.presence).size}`
    );
    interaction.guild.channels.cache.get(toplam).setName(`💜 Toplam ${interaction.guild.memberCount}`);
    interaction.guild.channels.cache.get(uye).setName(`💜 Uye ${interaction.guild.members.cache.filter((m) => !m.user.bot).size}`);
    interaction.guild.channels.cache.get(bot).setName(`🤖 Bot - ${interaction.guild.members.cache.filter(m => m.user.bot).size}`);

    interaction.reply(`Stats Kanalları Başarıyla <#${kanal1.id}> - <#${kanal2.id}> - <#${kanal3.id}> - <#${kanal4.id}> Olarak Ayarlandı!`);
  }
};
