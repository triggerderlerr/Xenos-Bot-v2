const { Client, EmbedBuilder, PermissionsBitField, ChannelType, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require("discord.js");
const db = require("croxydb")
const Discord = require("discord.js")
const config = require('../../utils/constants/config.json');
const messages = require('../../utils/constants/messages');

module.exports = {
  name: "create-server",
  description: "Public bir sunucu kurar!",
  type: 1,

  run: async(client, message) => {
    if(!(message.user.id === config.owner)) return message.reply({content: "Bunun için gerekli yetkiniz bulunmuyor!", ephemeral: true})
    
  let kayıtsızrol = db.fetch(`otorol_${message.guild.id}`)
  let kayıtyetkili = db.fetch(`kayityetkili_${message.guild.id}`)
  
  if (!kayıtsızrol) return message.reply("Kayıtsız rol ayarlanmamış!")
  if (!kayıtyetkili) return message.reply("Kayıt yetkili rol ayarlanmamış!")
    
		const confirm = new ButtonBuilder()
			.setCustomId('confirm')
			.setLabel('Onayla')
			.setStyle(ButtonStyle.Success);


		const cancel = new ButtonBuilder()
			.setCustomId('cancel')
			.setLabel('Vazgeç')
			.setStyle(ButtonStyle.Danger);
    
		const row = new ActionRowBuilder().addComponents(cancel, confirm);   
    const response = await message.reply({
      content: `Sunuyu yeniden kurmak istediğine emin misin?`,
      components: [row],
    });
    
    const collectorFilter = i => i.user.id === message.user.id;
    try {
      const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
	  if (confirmation.customId === 'confirm') {
//  message.reply("Kanallar oluşturuluyor..")
    	await confirmation.update({ content: `Kanallar oluşturuluyor..`, components: [] });
    
        var filter = m => m.author.id === message.author.id;
setTimeout(function(){
        message.guild.channels.cache.filter(channel => channel.delete()); //Bütün kanalları siliyoruz
   
          
 //  ======================= INFORMATION =====================================  
  setTimeout(function(){
        message.guild.channels.create({
            name: "INFORMATION",
            type: ChannelType.GuildCategory,
                      permissionOverwrites: [
              {
                id: message.guild.roles.everyone, // @everyone rolü
                allow: PermissionsBitField.Flags.ViewChannel
              },
              {
                id: kayıtsızrol,
                deny:PermissionsBitField.Flags.ViewChannel,
              },
              ]
          
        }).then(c => {
            var information = c.id;
          
                    message.guild.channels.create({
                        name: "1881-193∞", 
                        type: ChannelType.GuildText,
                        parent: information
                    })
          
                    message.guild.channels.create({
                        name: "rules", 
                        type: ChannelType.GuildText,
                        parent: information
                    })

                    message.guild.channels.create({
                        name: "announcements", 
                        type: ChannelType.GuildText,
                        parent: information
                    })
          
                    message.guild.channels.create({
                        name: "etkinlik-duyuru", 
                        type: ChannelType.GuildText,
                        parent: information
                    })
          
  },500)
 //  ======================= INFORMATION SON ===================================== 
          
 //  ======================= VOICE CHANNELS =====================================     
setTimeout(function(){
        message.guild.channels.create( {
             name: "VOICE CHANNELS",
             type: ChannelType.GuildCategory,
             permissionOverwrites: [
              {
                id: message.guild.roles.everyone, // @everyone rolü
                allow: [
                  PermissionsBitField.Flags.ViewChannel,
                  PermissionsBitField.Flags.Connect,
                  PermissionsBitField.Flags.Speak,
                  PermissionsBitField.Flags.Stream,
                  PermissionsBitField.Flags.UseVAD,
                  ]
              },
              {
                id: kayıtsızrol,
                deny:PermissionsBitField.Flags.ViewChannel,
              },
              ]
             }).then(c => {
             var voicechannels = c.id;
          
                    message.guild.channels.create({
                        name: "Whiskey Sour",
                        type: ChannelType.GuildVoice,
                        parent: voicechannels,                  
                    })
          
                    message.guild.channels.create({
                        name: "Espresso Martini",
                        type: ChannelType.GuildVoice,
                        parent: voicechannels,                    
                    })
          
                    message.guild.channels.create({
                        name: "Dark N Stormy",
                        type: ChannelType.GuildVoice,
                        parent: voicechannels,                  
                    })
          
                    message.guild.channels.create({
                        name: "Old Fashioned",
                        type: ChannelType.GuildVoice,
                        parent: voicechannels,                    
                    })
          
  },1000)              
 //  ======================= VOICE CHANNELS SON =====================================  
setTimeout(function(){ 
        message.guild.channels.create({
            name: "Text Channels",
            type: ChannelType.GuildCategory,
             permissionOverwrites: [
              {
                id: message.guild.roles.everyone, // @everyone rolü
                allow: [
                  PermissionsBitField.Flags.ViewChannel,
                  PermissionsBitField.Flags.Connect,
                  PermissionsBitField.Flags.Speak,
                  PermissionsBitField.Flags.SendMessages,
                  ]
              },
              {
                id: kayıtsızrol,
                deny:PermissionsBitField.Flags.ViewChannel,
              },
              ]
          
        }).then(c => {
            var textchannels = c.id;
          
                    message.guild.channels.create({
                        name: "server-chat", 
                        type: ChannelType.GuildText,
                        parent: textchannels
                      
                    })
          
                    message.guild.channels.create({
                        name: "bot-commands", 
                        type: ChannelType.GuildText,
                        parent: textchannels,
                       permissionOverwrites: [
                        {
                          id: message.guild.roles.everyone, // @everyone rolü
                          allow: [
                            PermissionsBitField.Flags.UseApplicationCommands, 
                            PermissionsBitField.Flags.ViewChannel, 
                            PermissionsBitField.Flags.SendMessages
                          ]
                            
                        },
                        {
                          id: kayıtsızrol,
                          deny:PermissionsBitField.Flags.ViewChannel,
                        },
                        ]
                    })
          
                    message.guild.channels.create({
                        name: "photo-chat", 
                        type: ChannelType.GuildText,
                        parent: textchannels
                    })
          
                    message.guild.channels.create({
                        name: "free-games", 
                        type: ChannelType.GuildText,
                        parent: textchannels
                    })
          
  },1500)
 //  ======================= PRIVATES =====================================  
setTimeout(function(){  
        message.guild.channels.create({
            name: "PRIVATE'S",
            type: ChannelType.GuildCategory,
            permissionOverwrites: [
              {
                id: message.guild.roles.everyone, // @everyone rolü
                allow: [
                  PermissionsBitField.Flags.ViewChannel,
                  PermissionsBitField.Flags.Connect,
                  PermissionsBitField.Flags.Speak,
                  PermissionsBitField.Flags.SendMessages,
                  PermissionsBitField.Flags.UseVAD,
                  ]
              },
              {
                id: kayıtsızrol,
                deny:PermissionsBitField.Flags.ViewChannel,
              },
              ]
          
          
        }).then(c => {
            var privates = c.id;
          
                    message.guild.channels.create({
                        name: "Private¹", 
                        type: ChannelType.GuildVoice,
                        parent: privates,
                        userLimit: 2,
                    })
          
                    message.guild.channels.create({
                        name: "Private²", 
                        type: ChannelType.GuildVoice,
                        parent: privates,
                        userLimit: 2,
                      
                    })
          
                    message.guild.channels.create({
                        name: "Private³", 
                        type: ChannelType.GuildVoice,
                        parent: privates,
                        userLimit: 3,
                    })
          
                    message.guild.channels.create({
                        name: "Private⁴", 
                        type: ChannelType.GuildVoice,
                        parent: privates,
                        userLimit: 4,
                    })

  },2000)
 //  ======================= PRIVATES SON =====================================  
          
 //  ======================= REGISTER =====================================      
setTimeout(function(){
        message.guild.channels.create( {
            name: "REGISTER",
            type: ChannelType.GuildCategory,
            permissionOverwrites: [

              {
                id: message.guild.roles.everyone, // @everyone rolü
                deny: PermissionsBitField.Flags.ViewChannel
              },
              
              {
                id: kayıtsızrol,
                allow: 
                [
                  PermissionsBitField.Flags.SendMessages,
                  PermissionsBitField.Flags.ViewChannel,
                  PermissionsBitField.Flags.Connect,
                  PermissionsBitField.Flags.Speak,
                ]
              },
              {
                id: kayıtyetkili,
                allow: 
                [
                  PermissionsBitField.Flags.SendMessages,
                  PermissionsBitField.Flags.MuteMembers,
                  PermissionsBitField.Flags.DeafenMembers,
                  PermissionsBitField.Flags.MoveMembers,
                  PermissionsBitField.Flags.Connect,
                  PermissionsBitField.Flags.Speak,
                  PermissionsBitField.Flags.ViewChannel,
                  PermissionsBitField.Flags.ReadMessageHistory,
                  PermissionsBitField.Flags.UseApplicationCommands,
                ]
              },

              
            ]
         
            }).then(c => {
            var register = c.id;
          
                    message.guild.channels.create({
                        name: "register-chat", 
                        type: ChannelType.GuildText,
                        parent: register
                    })
                  
                    message.guild.channels.create({
                        name: "Voice Confirm¹",
                        type: ChannelType.GuildVoice,
                        parent: register,
                        userLimit: 4,
                    })
                  
                    message.guild.channels.create({
                        name: "Voice Confirm²",
                        type: ChannelType.GuildVoice,
                        parent: register,
                        userLimit: 4,                      
                    })
                  
                    message.guild.channels.create({
                        name: "Voice Confirm³",
                        type: ChannelType.GuildVoice,
                        parent: register,
                        userLimit: 4,
                    })
          
  },2500)
  
  
 //  ======================= REGISTER SON =====================================   

  
                        });
                    });
                });
            });
        });
  
      },5000)   
	} else if (confirmation.customId === 'cancel') {
		await confirmation.update({ content: 'Iptal Edildi', components: [] });
	}
}
catch (e) {
	await message.editReply({ content: '1 dakika içinde onay alınamadı, iptal ediliyor', components: [] });
}
     
}};


