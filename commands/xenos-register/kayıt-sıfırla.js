const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const db = require("croxydb")
const config = require('../../utils/constants/config.json');
const messages = require('../../utils/constants/messages');

module.exports = {
  name: "kayıt-sıfırla",
  description: "Kayıt sıfırla!",
  type: 1,
  options: [],
  run: async(client, interaction) => {

    if(!(interaction.user.id === config.owner)) return interaction.reply({content: "Bunun için yetkin yok!", ephemeral: true})

    db.delete(`otorol_${interaction.guild.id}`)
    db.delete(`kayitkanal_${interaction.guild.id}`)
    db.delete(`erkek_${interaction.guild.id}`)
    db.delete(`erkek2_${interaction.guild.id}`)
    db.delete(`kadın_${interaction.guild.id}`)
    db.delete(`kadın2_${interaction.guild.id}`)
    db.delete(`kayityetkili_${interaction.guild.id}`)
    db.delete(`kayıtgif_${interaction.guild.id}`)
    interaction.reply({content: "Kayıt ayarları başarıyla sıfırlandı."})
}

};
