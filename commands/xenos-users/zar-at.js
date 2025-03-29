module.exports = {
    name: "zar",
    description: "Senin için bir zar fırlatır.",
    type: 1,
    options: [],


  run: async(client, interaction, data) => {

    const reply = await interaction.reply({
      embeds: [
        {
          color: 0xEB1C5A,
          author: {
            name: `${(interaction.type === 2 ? interaction.user : interaction.author).username} bir zar attı!`,
            icon_url: (interaction.type === 2 ? interaction.user : interaction.author).avatarURL(),
          },
          image: {
            url: 'https://cdn.discordapp.com/attachments/614117053699457053/777122364566798336/zar.gif',
          },
        }
      ]
    });

    const zarImages = {
      "1": "https://cdn.discordapp.com/attachments/614117053699457053/777135783290208286/1.png",
      "2": "https://cdn.discordapp.com/attachments/614117053699457053/777135771014135838/2.png",
      "3": "https://cdn.discordapp.com/attachments/614117053699457053/777135761873960990/3.png",
      "4": "https://cdn.discordapp.com/attachments/614117053699457053/777135751816544256/4.png",
      "5": "https://cdn.discordapp.com/attachments/614117053699457053/777135336592637992/5.png",
      "6": "https://cdn.discordapp.com/attachments/614117053699457053/777135174814662677/6.png"
    };
    const zarlar = ["1", "2", "3", "4", "5", "6"];

    let zar = zarlar[Math.floor(Math.random() * zarlar.length)];
    let zarImage = zarImages[zar];

    let messageContent = {
      embeds: [
        {
          color: 0xEB1C5A,
          author: {
            name: `${(interaction.type === 2 ? interaction.user : interaction.author).username} bir zar attı!`,
            icon_url: (interaction.type === 2 ? interaction.user : interaction.author).avatarURL(),
          },
          title: `**»** ${zar} geldi!`,
          image: {
            url: zarImage,
          },
        }
      ]
    };

    setTimeout(() => {
      if (interaction.type === 2)
        interaction.editReply(messageContent).catch(() => { });
      else reply.edit(messageContent).catch(() => { });
    }, 2400);

  }
};