const Discord = require('discord.js');
const superagent = require('superagent');

module.exports = {
  name: "nsfw",
  description: "NSFW İçerik Yollar!",
  type: 1,
  options: [
    {
      name: "çeşit",
      description: "Yapılacak işlemi seçin!",
      type: 3,
      required: true,
      choices: [
        { name: 'Pussy', value: 'pussy' },
        { name: 'Ass', value: 'ass' },
        { name: 'Porn Gif', value: 'pgif' },
        { name: 'Boobs', value: 'boobs' },
        { name: 'Thigh', value: 'thigh' },
        { name: 'Anal', value: 'anal' },
        { name: '4k', value: '4k' },
        { name: 'Blowjob', value: 'blowjob' },
        { name: 'Gonewild', value: 'gonewild' },
        { name: 'Hass', value: 'hass' },
        { name: 'Feet', value: 'feet' },
      ],
    },
  ],

  run: async (client, interaction) => {
    const işlem = interaction.options.getString('çeşit');

    // NSFW kanal kontrolü
    if (interaction.channel.nsfw) {
      try {
        const response = await superagent
          .get('https://nekobot.xyz/api/image')
          .query({ type: işlem });
        
        const pgif = new Discord.EmbedBuilder()
          .setTitle('Enjoy :smiling_imp:')
          .setImage(response.body.message)
          .setColor("Random");
        
        interaction.reply({ embeds: [pgif] });
      } catch (err) {
        console.error(err);
        interaction.reply("Bir hata oluştu! Lütfen daha sonra tekrar deneyin.");
      }
    } else {
      interaction.reply("**Bu bir NSFW kanalı değil!**");
    }
  }
};
