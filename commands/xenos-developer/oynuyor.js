const { PermissionsBitField, ActivityType, EmbedBuilder } = require("discord.js");
const db = require("croxydb")
const config = require('../../utils/constants/config.json');
const messages = require('../../utils/constants/messages');

module.exports = {
    name:"oynuyor",
    description: 'Bot\'un aktiflik durumunu değiştirir!',
    type:1,
    options:[
        {
            name:"yazı",
            description:"Bot\'un aktiflik durumunu değiştirir.",
            type:3,
            required:true
        },
      ],
  run: async(client, interaction, args) => {

    if(!(interaction.user.id === config.owner)) return interaction.reply({content: "Bunun için gerekli yetkiniz bulunmuyor!", ephemeral: true}) 
    
    let URL = interaction.options.getString('yazı')

client.user.setPresence({
  activities: [{ name: URL, type: ActivityType.Playing }],
  status: 'online',
});
    interaction.reply(`Botun Aktifliği Başarıyla ${URL} Olarak Ayarlandı.`)
    
}};