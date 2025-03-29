const { ShardingManager } = require('discord.js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const manager = new ShardingManager('./index.js', {
    totalShards: 'auto',
    respawn: true,
    token: process.env.TOKEN,
    execArgv: ["--max-old-space-size=2048", "--trace-warnings"],
});

// Shard olay dinleyicileri için bir fonksiyon
const setupShardListeners = (shard) => {
    //console.log(`Shard ${shard.id + 1} başlatılıyor...`);

    shard.on('death', () => {
        console.warn(`Shard ${shard.id + 1} öldü!`);
    });

    shard.on('disconnect', (event) => {
        console.error(`Shard ${shard.id + 1} bağlantı kesildi:`, event);
    });

    shard.on('error', (err) => {
        if (err.message.includes('ShardingReadyDied')) {
            console.error(`Shard ${shard.id + 1} hatası: ShardingReadyDied!`);
            shard.spawn(); // Shard'ı yeniden başlat
        } else {
            console.error(`Shard ${shard.id + 1} hata: ${err.message}`);
        }
    });

    shard.on('message', (message) => {
        console.log(`Shard ${shard.id + 1} mesajı aldı:`, message);
    });
};

// Shard oluşturma dinleyicisini ayarlama
manager.on('shardCreate', setupShardListeners);

// Genel hata yönetimi
process.on('unhandledRejection', error => {
    console.error(`[HATA] - ${error}`);
});

process.on('uncaughtException', error => {
    console.error(`[HATA] - ${error}`);
});

// Genel uyarı ve hata dinleyicileri
manager.on('warn', m => {
    console.log(`[WARN - 1] - ${m}`);
});

manager.on('error', m => {
    console.log(`[HATA - 1] - ${m}`);
});

// Uygulamayı başlatma
const startManager = async () => {
    try {
        const shards = await manager.spawn({ timeout: 180000 });
        //console.log(`${shards.length} shard başlatıldı.`);
    } catch (err) {
        console.error('Hata: Shard başlatılırken bir sorun oluştu:', err);
    }
};

startManager();
