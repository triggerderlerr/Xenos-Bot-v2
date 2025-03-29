const { PermissionsBitField } = require("discord.js");
const db = require("croxydb")
module.exports = {
    name:"rol-yönet",
    description: 'Bir kullanıcıya rol verir/alır.',
    type:1,
    options: [
        {
            name:"kullanıcı",
            description:"Rol verilecek/alınacak kullanıcıyı seçin!",
            type:6,
            required:true
        },
        {
            name:"işlem",
            description:"Yapılacak işlemi seçin!",
            type:3,
            required:true,
            choices:[
            { name: 'Ver', value: 'ver' },
            { name: 'Al', value: 'al' },
          ],

        },
        {
            name:"rol",
            description:"Lütfen bir rol etiketle!",
            type:8,
            required:true
        },

       
       
    ],
  run: async(client, interaction) => {
   const user = interaction.options.getMember('kullanıcı')
   
    if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) return interaction.reply({content: "Rolleri Yönet Yetkin Yok!", ephemeral: true})
    if(user.permissions.has(PermissionsBitField.Flags.ManageRoles)) return interaction.reply({content:"Bu Kullanıcının Rolleri Yönet Yetkisi Zaten Buluyor.   ",ephemeral:true})
 
    const işlem = interaction.options.getString('işlem')
    const rol = interaction.options.getRole("rol")


      if (işlem === 'al'){
        interaction.guild.members.cache.get(user.id).roles.remove(rol)
         interaction.reply({content: "Başarıyla <@"+user+"> isimli kullanıcının <@&"+rol.id+"> rolü alındı!"})
      }
      
      if (işlem === 'ver'){
          interaction.guild.members.cache.get(user.id).roles.add(rol)
         interaction.reply({content: "Başarıyla <@"+user+"> isimli kullanıcıya <@&"+rol.id+"> rolü verildi!"})
      }
      
       
}};

