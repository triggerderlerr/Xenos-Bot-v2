const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const db = require("croxydb");
const cron = require('node-cron'); // node-cron kütüphanesini ekliyoruz

module.exports = {
  name: "destek-stats",
  description: "Yetkililerin baktığı ticket sayılarını ve çözülme sürelerini görüntüler.",
  type: 1,
  options: [],

  run: async (client, interaction) => {
    const members = interaction.guild.members.cache;
    let stats = [];
    let topPerformers = [];

    // Ticket istatistiklerini toplama
    members.forEach((member) => {
      const handledTickets = db.get(`handledTickets_${member.id}`);
      const totalResolved = handledTickets || 0;

      if (totalResolved > 0) {
        stats.push({
          name: 'Ticket Sıralaması',
          value: `Kullanıcı: **${member.user.tag}**\nÇözülen destek: **${totalResolved} Adet**`,
          inline: false
        });

        topPerformers.push({ 
          user: member.user.tag,
          tickets: totalResolved 
        });
      }
    });

    topPerformers.sort((a, b) => b.tickets - a.tickets);

    const top3 = topPerformers.slice(0, 3);

    if (stats.length === 0) {
      return interaction.reply({ content: "Henüz hiçbir ticket ile ilgilenilmemiş.", ephemeral: true });
    }

    const usersPerPage = 10;
    const totalPages = Math.ceil(stats.length / usersPerPage);
    let currentPage = 1;

    const getPageEmbed = (page) => {
      const start = (page - 1) * usersPerPage;
      const end = page * usersPerPage;
      const pageStats = stats.slice(start, end);

      const embed = new EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("Ticket İstatistikleri")
        .setDescription("Aşağıda, yetkililerin ticket çözme istatistikleri listelenmiştir.")
        .setTimestamp()
        .setFooter({ text: `Page ${page} of ${totalPages} | Sunucu: ${interaction.guild.name}` })
        .setThumbnail(interaction.guild.iconURL()); // Sunucunun thumbnail'ı

      // Ticket istatistikleri kısmı
      embed.addFields({
        name: "Ticket İstatistikleri",
        value: pageStats.map(stat => `${stat.name}\n${stat.value}`).join("\n\n"),
        inline: false
      });

      // En aktif kullanıcılar (Top 3)
      if (top3.length > 0) {
        embed.addFields({
          name: "En Aktif Kullanıcılar (Top 3)",
          value: top3.map((user, index) => `${index + 1}. ${user.user} - ${user.tickets} ticket`).join("\n"),
          inline: false
        });
      }

      // Haftalık sıfırlama zamanını hesapla
      const now = new Date();
      const nextResetDate = new Date(now);

      // Sonraki Pazar günü hesaplanıyor
      nextResetDate.setDate(now.getDate() + (7 - now.getDay())); // Bu, bir sonraki Pazar günü olacak
      nextResetDate.setHours(0, 0, 0, 0); // Gece yarısı saat 00:00'da sıfırlama

      const timeRemaining = nextResetDate - now; // Zaman farkı

      const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
      const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      const secondsRemaining = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      // Kalan süreyi ekle
      const timeMessage = `Sıfırlamaya kalan süre: **${hoursRemaining} saat, ${minutesRemaining} dakika, ${secondsRemaining} saniye**`;

      embed.addFields({
        name: "Haftalık Sıfırlama Zamanı",
        value: timeMessage,
        inline: false
      });

      return embed;
    };

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('prev_page')
        .setLabel('◀️ Geri')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(currentPage === 1),
      new ButtonBuilder()
        .setCustomId('next_page')
        .setLabel('İleri ▶️')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(currentPage === totalPages)
    );

    await interaction.reply({ embeds: [getPageEmbed(currentPage)], components: [row] });

    const filter = (buttonInteraction) => buttonInteraction.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

    collector.on('collect', async (buttonInteraction) => {
      if (buttonInteraction.customId === 'next_page' && currentPage < totalPages) {
        currentPage++;
      } else if (buttonInteraction.customId === 'prev_page' && currentPage > 1) {
        currentPage--;
      }

      const newEmbed = getPageEmbed(currentPage);

      const newRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('prev_page')
          .setLabel('◀️ Geri')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(currentPage === 1),
        new ButtonBuilder()
          .setCustomId('next_page')
          .setLabel('İleri ▶️')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(currentPage === totalPages)
      );

      await buttonInteraction.update({ embeds: [newEmbed], components: [newRow] });
    });

    collector.on('end', () => {
      const disabledRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('prev_page')
          .setLabel('◀️ Geri')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId('next_page')
          .setLabel('İleri ▶️')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true)
      );

      interaction.editReply({ components: [disabledRow] });
    });

    // Haftalık sıfırlama işlemi
    cron.schedule('0 0 * * 0', () => { // Her Pazar günü gece 12'de sıfırlama işlemi yapılacak
      members.forEach((member) => {
        db.delete(`handledTickets_${member.id}`);
      });
      console.log("Ticket istatistikleri sıfırlandı.");
    });
  },
};
