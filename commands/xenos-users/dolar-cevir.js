const { PermissionsBitField } = require("discord.js");
const axios = require("axios");
const Discord = require("discord.js");

module.exports = {
  name: "doviz-cevir",
  description: "Farklı para birimlerini birbirine çevirir!",
  type: 1,
  options: [
    {
      name: "miktar",
      description: "Çevrilecek para miktarı.",
      type: 3, // String tipi
      required: true
    },
    {
      name: "kaynak_birim",
      description: "Çevrilecek para birimi.",
      type: 3, // String tipi
      required: true,
      choices: [
        { name: "Dolar (USD)", value: "USD" },
        { name: "Euro (EUR)", value: "EUR" },
        { name: "Türk Lirası (TRY)", value: "TRY" },
        { name: "İngiliz Sterlini (GBP)", value: "GBP" },
        { name: "Japon Yeni (JPY)", value: "JPY" },
        { name: "Rumen Leyi (RON)", value: "RON" },
        { name: "Kanada Doları (CAD)", value: "CAD" },
        { name: "Avustralya Doları (AUD)", value: "AUD" },
        { name: "İsviçre Frangı (CHF)", value: "CHF" },
        { name: "Çin Yuanı (CNY)", value: "CNY" }
      ]
    },
    {
      name: "hedef_birim",
      description: "Hedef para birimi.",
      type: 3, // String tipi
      required: true,
      choices: [
        { name: "Dolar (USD)", value: "USD" },
        { name: "Euro (EUR)", value: "EUR" },
        { name: "Türk Lirası (TRY)", value: "TRY" },
        { name: "İngiliz Sterlini (GBP)", value: "GBP" },
        { name: "Japon Yeni (JPY)", value: "JPY" },
        { name: "Rumen Leyi (RON)", value: "RON" },
        { name: "Kanada Doları (CAD)", value: "CAD" },
        { name: "Avustralya Doları (AUD)", value: "AUD" },
        { name: "İsviçre Frangı (CHF)", value: "CHF" },
        { name: "Çin Yuanı (CNY)", value: "CNY" }
      ]
    }
  ],
  run: async (client, interaction) => {
    const miktarStr = interaction.options.getString("miktar");
    const kaynakBirim = interaction.options.getString("kaynak_birim");
    const hedefBirim = interaction.options.getString("hedef_birim");

    const miktar = parseFloat(miktarStr);

    if (isNaN(miktar) || miktar <= 0) {
      return interaction.reply({ content: "Geçersiz miktar! Lütfen sayısal bir değer girin.", ephemeral: true });
    }

    try {
      // API'den döviz kurlarını al
      const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${kaynakBirim}`);
      const kurData = response.data.rates;

      // Hedef birim API'de yoksa hata ver
      if (!kurData[hedefBirim]) {
        return interaction.reply({ content: "Geçersiz hedef para birimi!", ephemeral: true });
      }

      const hedefKuru = kurData[hedefBirim];
      const cevrilenMiktar = (miktar * hedefKuru).toFixed(2);

      const embed = new Discord.EmbedBuilder()
        .setTitle("💱 Döviz Çevirici")
        .setColor('Blue')
        .addFields(
          { name: `📥 Yazılan Tutar (${kaynakBirim})`, value: `\`${miktarStr} ${kaynakBirim}\``, inline: true },
          { name: `📤 Anlık Kur (${kaynakBirim} -> ${hedefBirim})`, value: `\`${hedefKuru.toFixed(2)} ${hedefBirim}\``, inline: true },
          { name: `🪙 Çevrilen Tutar (${hedefBirim})`, value: `\`${cevrilenMiktar} ${hedefBirim}\``, inline: false }
        )
        .setDescription(`Seçtiğiniz ${kaynakBirim} miktarının ${hedefBirim} karşılığı aşağıdaki tabloda belirtilmiştir.`)
        .setThumbnail('https://i.pinimg.com/originals/c3/97/7d/c3977d7be06576701fd39950123b13d6.gif') // Thumbnail URL'si
        .setFooter({ 
          text: `Komutu kullanan: ${interaction.user.tag}`, 
          iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` 
        })
        .setTimestamp();

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("API isteği sırasında bir hata oluştu:", error);
      interaction.reply({ content: "Kuru alırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.", ephemeral: true });
    }
  }
};