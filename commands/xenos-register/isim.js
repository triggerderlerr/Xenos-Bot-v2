const { PermissionsBitField } = require("discord.js");

const Discord = require("discord.js")
const snowflake = require('../../utils/snowflake.js');

module.exports = {
  name: "isim",
  description: 'İsim değiştir!',
  type: 1,
  options: [{
      name: "kullanıcı",
      description: "Kullanıcı adı değiştirilecek kullanıcı.",
      type: 6,
      required: true
    },
    {
      name: "isim",
      description: "Kullanıcının İsmi!",
      type: 3,
      required: true
    },
    {
      name: "yaş",
      description: "Kullanıcının Yaşı!",
      type: 3,
      required: true
    },

  ],
  run: async (client, interaction) => {

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageNicknames)) return interaction.reply({content: "Bunun için yeterli yetkin yok!", ephemeral: true})

    const getUser = interaction.options.getMember('kullanıcı')
    const getName = interaction.options.getString('isim')
    const getAge = interaction.options.getString('yaş')


    if (!snowflake.isValidAge(getAge)) return interaction.reply({
      content: "Geçersiz Yaş."
    })

    let setName = getName[0].toUpperCase() + getName.slice(1);

    getUser.setNickname(`${setName} [${getAge}]`)
 /// const avatar = client.user.displayAvatarURL({dynamic: true})
 // const username = client.user.username

    const embed = new Discord.EmbedBuilder()
    .setAuthor({name: `${client.user.username}`,iconURL: `${client.user.displayAvatarURL({dynamic: true})}`,url: 'https://discord.gg/zGwFVQkX'})
      .setColor('Random')
      .setTitle("İsim Değiştirildi!")
      .setDescription(`<@${getUser.id}> isimli kullanıcının adı başarıyla ${setName} ${getAge} olarak değiştirildi.\n`)  
      .setFooter({
        text: `Komutu kullanan yetkili : ${interaction.user.tag}`,
        iconURL: `${interaction.user.displayAvatarURL({ dynamic: true})}`
      })


    interaction.reply({embeds: [embed]})

  }

};