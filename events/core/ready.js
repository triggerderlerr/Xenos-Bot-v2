const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { ActivityType } = require('discord.js');
const messages = require('../../utils/constants/messages');

module.exports = async (client) => {
    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

    try {
        // Global komut yükleme
        await rest.put(Routes.applicationCommands(client.user.id), {
            body: client.slashCommands,
        });
        console.log(`[✅] Komutlar global olarak başarıyla yüklendi`);
    } catch (error) {
        console.error(`[❌] Komutlar yüklenirken hata: ${error.message}`);
    }

    client.user.setActivity(`/yardım`);
    console.log(`[✅] ${client.user.username} hazır!`);
};
