const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
	name: "embed-yaz",
	description: "Embed mesajıyla birşeyler söyle.",
	type: 1,
	options: [
		{
			name: "mesaj",
			description: "Herhangi birşeyler yaz.",
			type: 3,
			required: true,
		},
	],
  run: async(client, interaction) => {
    if(!interaction.member.permissions.has(PermissionsBitField.Flags.DeleteMessages)) return interaction.reply({content: "Bunun için gerekli yetkin yok!", ephemeral: true})
    let mesaj = interaction.options.getString("mesaj")
    const avatar = interaction.user.displayAvatarURL({dynamic: true})
    const username = interaction.user.username
    
		const embed = new EmbedBuilder()
    .setAuthor({name: `${username}`,iconURL: `${avatar}`})
			.setDescription(`> ${mesaj}`)
			.setColor("Random")
			.setTimestamp()
    //  .setFooter({text: `Komutu kullanan : ${interaction.user.tag}`,iconURL: `${interaction.user.displayAvatarURL({ dynamic: true})}` })
		await interaction.reply({embeds: [embed]});

}};