const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");

module.exports = {
  name: "yardım",
  description: "Tüm komutları kategorilere göre listeler.",
  type: 1,
  options: [],
  run: async (client, interaction) => {
    const categorizedCommands = {};
    client.slashCommands.forEach(command => {
      let category = command.category || "📌 Diğer";
      category = category.replace(/^xenos-/i, "").replace(/-/g, " ").replace(/\b\w/g, char => char.toUpperCase());

      if (!categorizedCommands[category]) {
        categorizedCommands[category] = [];
      }
      const description = command.description || "❌ Açıklama bulunamadı.";
      const truncatedDescription = description.length > 1024 ? description.substring(0, 1024) + '...' : description;
      categorizedCommands[category].push({
        name: `/${command.name}`,
        value: truncatedDescription
      });
    });

    const categoryOptions = Object.keys(categorizedCommands).map(category => ({
      label: `📂 ${category}`,
      value: category,
      description: `📌 ${categorizedCommands[category].length} komut içerir.`
    }));

    const initialCategory = Object.keys(categorizedCommands)[0];
    const initialCommands = categorizedCommands[initialCategory];

    const embed = new EmbedBuilder()
      .setColor("#7289DA")
      .setTitle(`${initialCategory} Komutları`)
      .setDescription(`Aşağıda **${initialCategory}** kategorisindeki komutları bulabilirsiniz.`)
      .addFields(
        initialCommands.map(command => ({
          name: `🔹 **${command.name}**`,
          value: command.value,
          inline: false
        }))
      )
      .setFooter({ text: `Toplam kategori sayısı: ${Object.keys(categorizedCommands).length}`, iconURL: client.user.displayAvatarURL() })
      .setThumbnail(interaction.guild.iconURL())
      .setTimestamp();

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("help_category_select")
      .setPlaceholder("📌 Bir kategori seçin...")
      .addOptions(categoryOptions);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: true
    });

    const collector = interaction.channel.createMessageComponentCollector({
      filter: i => i.user.id === interaction.user.id && i.customId === "help_category_select",
      time: 60000
    });

    collector.on("collect", async (i) => {
      const selectedCategory = i.values[0];
      const commands = categorizedCommands[selectedCategory];

      const updatedEmbed = new EmbedBuilder()
        .setColor("#7289DA")
        .setTitle(`${selectedCategory} Komutları`)
        .setDescription(`🔍 Aşağıda **${selectedCategory}** kategorisindeki komutları bulabilirsiniz.`)
        .addFields(
          commands.map(command => ({
            name: `🔹 **${command.name}**`,
            value: command.value,
            inline: false
          }))
        )
        .setFooter({ text: `Toplam kategori sayısı: ${Object.keys(categorizedCommands).length}`, iconURL: client.user.displayAvatarURL() })
        .setThumbnail(interaction.guild.iconURL())
        .setTimestamp();

      await i.update({
        embeds: [updatedEmbed],
        components: [row]
      });
    });

    collector.on("end", () => {
      interaction.editReply({ components: [] }).catch(() => {});
    });
  }
};