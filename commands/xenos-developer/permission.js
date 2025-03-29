const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const config = require('../../utils/constants/config.json');
const messages = require('../../utils/constants/messages');

module.exports = {
  name: "pcalculate",
  description: "Belirtilen bot client ID ve izinlerle bir Discord davet bağlantısı oluşturur!",
  type: 1,
  options: [
    {
      name: "botclientid",
      description: "Botun client ID'sini girin.",
      type: 3,
      required: true
    },
    {
      name: "permissions",
      description: "Seçmek istediğiniz izinleri belirtin.",
      type: 3,
      required: true,
      choices: [
        { name: "Manage Channels", value: "16" },
        { name: "Manage Roles", value: "268435456" },
        { name: "Change Nickname", value: "67108864" },
        { name: "Manage Nicknames", value: "134217728" },
        { name: "Kick Members", value: "2" },
        { name: "Ban Members", value: "4" },
        { name: "Administrator", value: "8" }
      ]
    }
  ],
  
  run: async(client, interaction) => {

    if(!(interaction.user.id === config.owner)) return interaction.reply({content: "Bunun için gerekli yetkiniz bulunmuyor!", ephemeral: true});

    const botClientId = interaction.options.getString("botclientid");
    const izinKodu = interaction.options.getString("permissions");

    // Discord davet linkini oluştur
    const davetLinki = `https://discord.com/oauth2/authorize?client_id=${botClientId}&permissions=${izinKodu}&scope=bot`;

    // Kullanıcıya yanıt gönder
    interaction.reply({ content: `İşte izinlerinizle oluşturulan davet linki: ${davetLinki}`, ephemeral: true });
  },
};
