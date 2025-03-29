const { Client, EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  name: "ban-list",
  description: "Banlı Olan Kullanıcıları Görürsün!",
  type: 1,
  options: [],

  run: async(client, interaction) => {
    if(!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return interaction.reply({content: "Üyeleri Yasakla Yetkin Yok!", ephemeral: true})
    var userlist = interaction.guild.bans.fetch()
    userlist.then(collection => {
    if(collection.first() == null){
      
    const embed = new EmbedBuilder()
    .setDescription("Sunucunuzda Banlanan Kimse Yok!")      
    .setColor("Red")
    .setTitle(`${interaction.guild.name} - Ban Listesi`)
    interaction.reply({embeds: [embed]})
      
    } else {
    const data = collection.map(mr => "`"+mr.user.username+" - "+mr.user.id+"`").slice(0, 60).join(", ")
    const embed2 = new EmbedBuilder()
    .setTitle(`${interaction.guild.name} - Ban Listesi`)
    .setColor("#ff0000")
    .setDescription(data)
    interaction.reply({embeds: [embed2]})
}

  })

}};
