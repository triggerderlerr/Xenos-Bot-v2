const { Client, EmbedBuilder, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
module.exports = {
    name:"ban",
    description: 'Kullanıcıyı Sunucudan Yasaklarsın.',
    type:1,
    options: [
        {
            name:"kullanıcı",
            description:"Yasaklanıcak Kullanıcıyı Seçin.",
            type:6,
            required:true
        },
        {
            name:"sebep",
            description:"Hangi Sebepten dolayı yasaklanıcak?",
            type:3,
            required:true
        },
    ],
  run: async(client, interaction) => {

    if(!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return interaction.reply({content: "Üyeleri Yasakla Yetkin Yok!", ephemeral: true})
    const target = interaction.options.getMember('kullanıcı')
    const reason = interaction.options.getString('sebep')
    if(target.permissions.has(PermissionsBitField.Flags.BanMembers)) return interaction.reply({content:"Bu Kullanıcının Ban Yetkisi Olduğu İçin Onu Yasaklayamadım.   ",ephemeral:true})
		const confirm = new ButtonBuilder()
			.setCustomId('confirm')
			.setLabel('Onayla')
			.setStyle(ButtonStyle.Success);


		const cancel = new ButtonBuilder()
			.setCustomId('cancel')
			.setLabel('Vazgeç')
			.setStyle(ButtonStyle.Danger);

		const row = new ActionRowBuilder().addComponents(cancel, confirm);
    
    const response = await interaction.reply({
      content: `<@${target.user.id}> isimli üyeyi **${reason}** sebebinden dolayı banlamak istediğinize emin misiniz?`,
      components: [row],
    });
    
const collectorFilter = i => i.user.id === interaction.user.id;
try {
	const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });

	if (confirmation.customId === 'confirm') {
		await interaction.guild.members.ban(target);
		await confirmation.update({ content: `<@${target.user.id}> isim üye şu sebepten: ${reason} banlandı.`, components: [] });
	} else if (confirmation.customId === 'cancel') {
		await confirmation.update({ content: 'Iptal edildi.', components: [] });
	}
} catch (e) {
	await interaction.editReply({ content: '1 dakika içinde onay alınamadı, iptal ediliyor', components: [] });
}
    

}};
