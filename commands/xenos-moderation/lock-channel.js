const { Client, EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  name: "kilitle",
  description: "Bulunduğun Kanalı Kapatırsın/Açarsın!",
  type: 1,
  options: [],

  run: async (client, message, args, embed) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return message.reply({content: "Kanalları Yönet Yetkin Yok!", ephemeral: true});
    
    const channelPermissions = message.channel.permissionsFor(message.guild.id);
    if (channelPermissions.has([PermissionsBitField.Flags.SendMessages])) {
      message.channel.permissionOverwrites.edit(message.guild.id, { SendMessages: false });
      message.reply( "Kanal kilitlendi!");
    } else {
      message.channel.permissionOverwrites.edit(message.guild.id, { SendMessages: true });
      message.reply( "Kanal kilidi açıldı!");
    }
  
}};
