const { PermissionsBitField, ActivityType, EmbedBuilder } = require("discord.js");
const db = require("croxydb")
const config = require('../../utils/constants/config.json');
const messages = require('../../utils/constants/messages');

module.exports = {
    name:"setgif",
    description: 'Bot\'un avatarını değiştirir!',
    type:1,
    options:[
        {
            name:"banner",
            description:"Bot\'un avatarını değiştirir.",
            type:11,
            required:true
        },
      ],
  run: async(client, interaction, args) => {

    if(!(interaction.user.id === config.owner)) return interaction.reply({content: "Bunun için gerekli yetkiniz bulunmuyor!", ephemeral: true}) 
    
       const { options } = interaction;
        const banner = options.getAttachment('banner');

        if (banner.contentType !== "image/gif") {
            const embed = new EmbedBuilder().setDescription("Please use a gif for the animated banner.");
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        await interaction.deferReply({ ephemeral: true });

        try {
            await client.user.setAvatar(banner.url);
            const embed = new EmbedBuilder().setDescription("I've uploaded the banner!");
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.log(error);
            const embed = new EmbedBuilder().setDescription(`Error: \`${error.toString()}\``);
            await interaction.editReply({ embeds: [embed] });
        }
    
}};