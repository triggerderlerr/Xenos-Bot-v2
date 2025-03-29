module.exports = {
    ERRORS: {
        MISSING_PERMISSIONS: 'Bu komutu kullanmak için yeterli yetkiye sahip değilsiniz.',
        COOLDOWN: (time) => `Bu komutu ${time} saniye sonra tekrar kullanabilirsiniz.`,
        COMMAND_ERROR: 'Komut çalıştırılırken bir hata oluştu.',
        INVALID_ARGS: 'Geçersiz argümanlar.',
        USER_NOT_FOUND: 'Kullanıcı bulunamadı.',
        CHANNEL_NOT_FOUND: 'Kanal bulunamadı.',
        ROLE_NOT_FOUND: 'Rol bulunamadı.'
    },
    SUCCESS: {
        COMMAND_EXECUTED: 'Komut başarıyla çalıştırıldı.',
        SETTINGS_UPDATED: 'Ayarlar güncellendi.',
        CHANNEL_CREATED: 'Kanal oluşturuldu.',
        ROLE_CREATED: 'Rol oluşturuldu.',
        USER_BANNED: 'Kullanıcı yasaklandı.',
        USER_KICKED: 'Kullanıcı atıldı.'
    },
    INFO: {
        BOT_INFO: (client) => `
            Bot Adı: ${client.user.username}
            Sunucu Sayısı: ${client.guilds.cache.size}
            Kullanıcı Sayısı: ${client.users.cache.size}
            Ping: ${client.ws.ping}ms
        `
    }
}; 