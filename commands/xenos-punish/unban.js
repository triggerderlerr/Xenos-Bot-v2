const { Client, EmbedBuilder, PermissionsBitField } = require("discord.js");
const snowflake = require("../../utils/snowflake.js");
module.exports = {
  name: "unban",
  description: "Kullanıcının Yasağını Kaldırırsın!",
  type: 1,
  options: [
    {
      name: "id",
      description: "Kullanıcı ID Girin!",
      type: 3,
      required: true,
    },
  ],
  run: async(client, interaction) => {

    if(!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return interaction.reply({content: "Üyeleri Yasakla Yetkin Yok!", ephemeral: true})
    const user = interaction.options.getString('id')
    
    if (!snowflake.isValid(user)) return interaction.reply({content: "Geçersiz ID."})

      interaction.guild.members.unban(user)
    
      interaction.reply({content: "Başarıyla Üyenin Yasağını Kaldırdım."})

  
}};

