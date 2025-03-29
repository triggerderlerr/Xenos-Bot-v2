const { Client, EmbedBuilder, PermissionsBitField } = require("discord.js");
const db = require("croxydb");

module.exports = {
    name: "log-kanal",
    description: 'Log Kanal Sistemini Ayarlarsın!',
    type: 1,
    options: [
        {
            name: "işlem",
            description: "Logları Aç-Kapat ya da Kanal Seç",
            choices: [
                { name: "Aç", value: "aç" },
                { name: "Kapat", value: "kapat" }
            ],
            type: 3,
            required: true
        },
        {
            name: "kanal",
            description: "Logların atılacağı kanalı seçin",
            type: 7,
            required: false,
            channel_types: [0]
        },
    ],

    run: async (client, interaction) => {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) 
            return interaction.reply({content: "Kanalları Yönet Yetkin Yok!", ephemeral: true});
        
        const işlem = interaction.options.getString('işlem');

        if (işlem === "aç") {
            db.set(`logdurum_${interaction.guild.id}`, 'açık');
            interaction.reply({content: "Loglar başarıyla açıldı!"});
        }
        
        if (işlem === "kapat") {
            db.set(`logdurum_${interaction.guild.id}`, 'kapalı');
            interaction.reply({content: "Loglar başarıyla kapatıldı!"});
        }

        if (işlem === "aç" || işlem === "kapat") {
            const check = db.get(`logdurum_${interaction.guild.id}`);
            if (check === 'kapalı' && işlem === "kanal") 
                return interaction.reply("Log sistemini aktif etmeden bu komutu kullanamazsınız!");

            const kanal = interaction.options.getChannel('kanal');
            if (!kanal) 
                return interaction.reply({content: "Lütfen geçerli bir kanal seçin!", ephemeral: true});
            
            db.set(`logchannels_${interaction.guild.id}`, kanal.id);
            interaction.reply(`Log Kanalı başarıyla <#${kanal.id}> olarak ayarlandı!`);
        }
    }
};
