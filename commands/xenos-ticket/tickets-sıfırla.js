const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const db = require("croxydb");
const cron = require('node-cron'); // node-cron kütüphanesini ekliyoruz

module.exports = {
  name: "destek-sıfırla",
  description: "Tüm ticket istatistiklerini sıfırlar.",
  type: 1,
  options: [],

  run: async (client, interaction) => {
    const members = interaction.guild.members.cache;

    // Ticket istatistiklerini sıfırlama
    members.forEach((member) => {
      db.delete(`handledTickets_${member.id}`);
    });

    // Komutun başarıyla çalıştığını bildiren mesaj
    const embed = new EmbedBuilder()
      .setColor("#ff0000")
      .setTitle("Destek İstatistikleri Sıfırlandı")
      .setDescription("Tüm ticket istatistikleri başarıyla sıfırlandı.")
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    // Haftalık sıfırlama işlemi
    cron.schedule('0 0 * * 0', () => { // Her Pazar günü gece 12'de sıfırlama işlemi yapılacak
      members.forEach((member) => {
        db.delete(`handledTickets_${member.id}`);
      });
      console.log("Ticket istatistikleri sıfırlandı.");
    });
  },
};
