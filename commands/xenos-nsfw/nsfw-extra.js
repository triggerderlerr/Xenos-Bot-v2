const Discord = require('discord.js');
const superagent = require('superagent');

module.exports = {
  name: "nsfw-a",
  description: "NSFW Anime İçerik Yollar!",
  type: 1,
  options: [
    {
      name: "çeşit",
      description: "Yapılacak işlemi seçin!",
      type: 3,
      required: true,
      choices: [
        { name: 'Paizuri', value: 'paizuri' },
        { name: 'Lewdneko', value: 'lewdneko' },
        { name: 'Hthigh', value: 'hthigh' },
        { name: 'Hmidriff', value: 'hmidriff' },
        { name: 'Hkitsune', value: 'hkitsune' },
        { name: 'Hentai Anal', value: 'hentai_anal' },
        { name: 'Futa', value: 'futa' },
        { name: 'Hentai Gif', value: 'hentai' },
        { name: 'Hyuri', value: 'hyuri' },
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
