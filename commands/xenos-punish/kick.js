const { PermissionsBitField } = require("discord.js");
module.exports = {
    name:"kick",
    description: 'Kullanıcıyı Sunucudan Atarsın.',
    type:1,
    options: [
        {
            name:"user",
            description:"Atılacak Kullanıcıyı Seçin.",
            type:6,
            required:true
        },
       
    ],
  run: async(client, interaction) => {

    if(!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return interaction.reply({content: "Üyeleri At Yetkin Yok!", ephemeral: true})
    const user = interaction.options.getMember('user')
    if (interaction.member.roles.highest.position <= user.roles.highest.position) return interaction.reply({ content: `Kendinden üst yetkilileri sunucudan atamazsın!`})

try {

    user.kick();
    interaction.reply({content: "Kullanıcı başarıyla sunucudan atıldı!"})
} catch (e) {} /*Ignore error*/
}};
