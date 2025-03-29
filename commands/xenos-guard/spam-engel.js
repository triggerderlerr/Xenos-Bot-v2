const { Client, EmbedBuilder, PermissionsBitField } = require("discord.js");
const db = require("croxydb")
module.exports = {
    name:"anti-spam",
    description: 'Sunucuda spam mesajlarını engeller.',
    type:1,
        options: [
          {
            name: "işlem",
            description: "Anti spam açılsın mı?",
            choices: [
              { name: "Aç", value: "aç" },
              { name: "Kapat", value: "kapat" }
            ],
            type: 3,
            required: true
          },
        ],
	
	
	
  run: async(client, interaction) => {

    if(!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return interaction.reply({content: "Üyeleri Yasakla Yetkin Yok!", ephemeral: true})
		

    const bool = interaction.options.getString('işlem')


		
		if (bool === "aç") {
		 	db.set(`antispam_${interaction.guild.id}`, 'açık')
      interaction.reply({content: "Spam engel başarıyla açıldı!"});
		}
		
    
		if (bool === "kapat") {
		 	db.set(`antispam_${interaction.guild.id}`, 'kapalı')
      interaction.reply({content: "Spam engel başarıyla kapatıldı!"});
		}
		

}};