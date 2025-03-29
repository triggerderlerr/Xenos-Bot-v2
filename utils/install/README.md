# Advanced Slash Moderation v14

Gelişmiş Public Sunucu Botudur.

## Özellikler
 - ✅ Kayıt Sistemi
 - ✅ Server Stats
 - ✅ Küfür Engel 
 - ✅ Link Engel
 - ✅ Spam Koruma
 - ✅ Sunucu Kurma
 - ✅ Herkese Rol Ver
 - ✅ SA-AS Sistemi
 - ✅ Embed Mesaj
 - ✅ Oylama Sistemi
 - ✅ Timeout Sistemi
 - ✅ Emoji Oluşturma
 - ✅ NSFW Özelliği
 - ✅ Eğlence Özellikleri
 - ✅ Log Sistemi
 - ✅ Backup Sistemi
 - ✅ Join to Create
 - ✅ Yavaş Mod Sistemi
 - ✅ Kanal Kilitleme Sistemi
 - ✅ Profil Efekt Sistemi
 - ✅ Özel Ses Kanalları
 - ✅ Rol Yönetim Sistemi

## Güncellemeler
 - Önemli buglar fixlendi. ✅ - 07-06.2024
 - Spam Koruma Eklendi ✅ - 08-06.2024
 - Fazla Kodlar Çıkarıldı ve Daha Kolay Hale Getirildi ✅ - 08-06.2024
 - Bazı Komutlara Buton Özelliği Eklendi ✅ - 09-06.2024
 - NSFW Özelliği Eklendi 🔞 - 18-06.2024
 - Log Sistemi Eklendi ✅ - 28-06.2024
 - Nuke Sistemi Eklendi ✅ - 09-07.2024
 - Backup Sistemi Eklendi ✅ - 13-07.2024
 - interactionCreate Yenilendi ✅ - 13-07.2024
 - Join to Create Özelliği Eklendi ✅ - 27-07.2024
 - Yavaş Mod Sistemi Eklendi ✅ - 28-07.2024
 - Kanal Kilitleme Sistemi Eklendi ✅ - 28-07.2024
 - Profil Efekt Sistemi Eklendi ✅ - 28-07.2024
 - Özel Ses Kanalları Eklendi ✅ - 28-07.2024
 - Rol Yönetim Sistemi Eklendi ✅ - 28-07.2024

## Önemli
- settings/config.json içerisindeki emojileri yerine göre entegre etmelisin.
- Eğer yoksa bir .env dosyası oluştur ve içerisine `TOKEN=` yazıp yanına tokenizi yapıştırın.
- Aşağıdaki kurulumu yaptıktan sonra /yardım yazarak gerekli kurulum işlemlerini tamamlayabilirsiniz.
- MongoDB bağlantısı için .env dosyasına `MONGODB_URI=` ekleyip MongoDB bağlantı linkinizi yapıştırın.
- Bot'un çalışması için gerekli minimum yetkiler: Yönetici, Mesajları Yönet, Kanalları Yönet, Rolleri Yönet
- Sunucu ayarları için config.json dosyasındaki owner ID'yi kendi Discord ID'niz ile değiştirin
- Hata durumunda: 
  - Bot'un yetkilerini kontrol edin
  - MongoDB bağlantısını kontrol edin
  - Node.js versiyonunuzu kontrol edin
  - Tüm bağımlılıkların kurulu olduğundan emin olun

## Masaüstü Kurulum
- npm i yazarak modülleri kuruyoruz.
- start.bat klasörü oluşturup
```sh
@echo off
title TriggerX

:Reconnected

node index.js

goto Reconnected
```
Kodunu ekliyoruz ve kayıt ediyoruz.
- Botunuz kullanıma hazır durumdadır.

## Help
- Örnek Kayıt Gif'i
```sh
https://i.hizliresim.com/2la4xoi.gif
```

## DEVELOPER
- TriggerX 2024 〽️
- Transpiled 🌌
- Optimized 📈
- Readable 📊


## Support
```sh
Discord Ad: triggerderler
Discord ID: 440222721079508993
```

## Gereksinimler
- Node.js v16.9.0 veya üzeri
- Discord.js v14.0.0 veya üzeri

## Bağımlılıklar
```json
{
  "dependencies": {
    "discord.js": "^14.14.1",
    "mongoose": "^8.0.3",
    "moment": "^2.29.4",
    "ms": "^2.1.3"
  }
}
```

## Komutlar
- `/yardım` - Tüm komutları listeler
- `/kayıt` - Kullanıcı kayıt sistemi
- `/stats` - Sunucu istatistikleri
- `/timeout` - Kullanıcı timeout sistemi
- `/oylama` - Oylama oluşturma
- `/embed` - Embed mesaj oluşturma
- `/nuke` - Kanal nuke sistemi
- `/backup` - Sunucu yedekleme sistemi

## Hata Çözümleri
1. Bot çalışmıyorsa:
   - Node.js versiyonunuzu kontrol edin
   - `.env` dosyasındaki token'ı kontrol edin
   - `npm i` komutunu tekrar çalıştırın

2. Komutlar çalışmıyorsa:
   - Bot'un gerekli yetkilere sahip olduğunu kontrol edin
   - Slash komutların yüklendiğinden emin olun

## Lisans
Bu proje MIT lisansı altında lisanslanmıştır.
