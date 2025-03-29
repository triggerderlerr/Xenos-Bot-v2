const {
  ChannelType, Client, REST, Routes, Collection, GatewayIntentBits, Partials, PermissionsBitField,
  EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, UserSelectMenuBuilder
} = require("discord.js");
const path = require("path");
const db = require("croxydb");
const moment = require("moment");
const { readdirSync } = require("fs");
const fs = require("fs");

// Yeni utils yapısı
const CommandManager = require('./utils/managers/CommandManager');
const { checkPermissions } = require('./utils/helpers/permissions');
const messages = require('./utils/constants/messages');
const connectMongo = require('./utils/database/mongo');
const keep_alive = require("./utils/keep_alive.js");

require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const INTENTS = Object.values(GatewayIntentBits);
const PARTIALS = Object.values(Partials);

const client = new Client({
  intents: INTENTS,
  allowedMentions: {
    parse: ["users"],
  },
  partials: PARTIALS,
  retryLimit: 3,
});

// Command Manager entegrasyonu
const commandManager = new CommandManager();
client.commandManager = commandManager;

// MongoDB Bağlantısı
connectMongo();
global.client = client;
client.commands = (global.commands = []);
client.slashCommands = new Collection();
client.cooldown = new Collection();

// Komutları Yükle
(async () => {
  await loadSlashCommands();
})();

async function loadSlashCommands() {
  console.log("Slash komutları yükleniyor.");

  const commandDirs = readdirSync("./commands/");
  for (const dir of commandDirs) {
    const commands = readdirSync(`./commands/${dir}`).filter(file => file.endsWith(".js"));
    for (const file of commands) {
      const filePath = path.resolve(`./commands/${dir}/${file}`);
      delete require.cache[require.resolve(filePath)];

      try {
        const command = require(filePath);
        if (!command.name || !command.description) {
          console.log(`Eksik isim veya açıklama: ${file}`, "error");
          continue;
        }
        command.category = dir;
        client.commandManager.registerCommand(command);
        client.slashCommands.set(command.name, command);
        console.log(`[${dir.toUpperCase()}] ${command.name} komutu yüklendi.`);
      } catch (error) {
        console.error(`Hata oluştu: ${file}`, error);
      }
    }
  }
}

// Event yükleme sistemi güncellendi
const loadEvents = () => {
  // Core eventler
  const corePath = "./events/core";
  if (fs.existsSync(corePath)) {
    readdirSync(corePath)
      .filter(f => f.endsWith('.js'))
      .forEach(f => {
        const event = require(`${corePath}/${f}`);
        const name = f.split(".")[0];
        client.on(name, (...args) => event(client, ...args));
        console.log(`[CORE] ${name} eventi yüklendi.`);
      });
  }

  // Log eventleri
  const logsPath = "./events/logs";
  if (fs.existsSync(logsPath)) {
    readdirSync(logsPath)
      .filter(f => f.endsWith('.js'))
      .forEach(f => {
        const event = require(`${logsPath}/${f}`);
        const name = f.split(".")[0];
        client.on(name, (...args) => event(client, ...args));
        console.log(`[LOGS] ${name} log eventi yüklendi.`);
      });
  }

  // Protection eventleri
  const protectionPath = "./events/protection";
  if (fs.existsSync(protectionPath)) {
    // protectionEvents.js'yi doğrudan çalıştır
    require('./events/protection/protectionEvents')(client);
    console.log(`[PROTECTION] Koruma eventleri yüklendi.`);
  }
};

loadEvents();

// Üye Ayrılma Olayı
client.on("guildMemberRemove", member => {
  const toplam = db.get(`statkanal1_${member.guild.id}`) || "";
  const uye = db.get(`statkanal2_${member.guild.id}`) || "";
  const bot = db.get(`statkanal3_${member.guild.id}`) || "";

  if (!toplam || !uye || !bot) return;

  member.guild.channels.cache.get(toplam)?.setName(`💜 Toplam ${member.guild.memberCount}`);
  member.guild.channels.cache.get(uye)?.setName(`💜 Üye ${member.guild.members.cache.filter(m => !m.user.bot).size}`);
  member.guild.channels.cache.get(bot)?.setName(`🤖 Bot - ${member.guild.members.cache.filter(m => m.user.bot).size}`);
});

// StringSelectMenu için dinleyici
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isStringSelectMenu()) return;

    const selection = interaction.values[0];
    const validSelections = ['rowname', 'rowlimit', 'toggleLock', 'toggleVisibility', 'toggleBan', 'kickUser'];

    if (validSelections.includes(selection)) {
        const channel = interaction.guild.channels.cache.get(interaction.channelId);
        if (!channel) return;

        if (!checkPermissions(interaction.member, ['ManageChannels'])) {
            return interaction.reply({ 
                content: messages.ERRORS.MISSING_PERMISSIONS,
                ephemeral: true 
            });
        }

        const createEmbed = () => {
            return new EmbedBuilder()
                .setColor("#00FF00")
                .setTitle("Kanalınızı Özelleştirin")
                .setDescription(
                    `Merhaba **${interaction.member.user.username}**, ses kanalınızı kişiselleştirmek için aşağıdaki seçeneklerden birini seçin.\n\n` +
                    `- **Oda İsmi:** Kanalınızın ismini değiştirmek için.\n` +
                    `- **Kullanıcı Limiti:** Kanala kaç kişinin katılabileceğini ayarlamak için.\n` +
                    `- **Kilit Durumu Değiştir:** Kanalı kilitlemek veya kilidini açmak için.\n` +
                    `- **Görünürlük Değiştir:** Kanalı gizlemek veya görünür yapmak için.\n` +
                    `- **Yasak Durumu Değiştir:** Bir kullanıcıyı yasaklamak veya yasağını kaldırmak için.\n` +
                    `- **Odadan At:** Odadaki bir kullanıcıyı çıkarmak için.`
                )
                .setThumbnail(interaction.guild.iconURL())
                .setTimestamp();
        };

        const createRow = () => {
            return new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('ymoderasyon')
                    .setPlaceholder('🏷️ Yönetim panelini açmak için tıklayın...')
                    .setMinValues(1)
                    .setMaxValues(1)
                    .addOptions(
                        { label: 'İsim Değiştir', description: 'Kanalın ismini değiştirir.', emoji: '📝', value: 'rowname' },
                        { label: 'Kullanıcı Limiti', description: 'Kanalın kullanıcı limitini ayarlar.', emoji: '👥', value: 'rowlimit' },
                        { label: 'Kilit Durumu Değiştir', description: 'Kanalı kilitler veya kilidini açar.', emoji: '🔐', value: 'toggleLock' },
                        { label: 'Görünürlük Değiştir', description: 'Kanalı gizler veya görünür yapar.', emoji: '👁️', value: 'toggleVisibility' },
                        { label: 'Yasak Durumu Değiştir', description: 'Bir kullanıcıyı yasaklar veya yasağını kaldırır.', emoji: '🚫', value: 'toggleBan' },
                        { label: 'Odadan At', description: 'Odada bulunan bir kullanıcıyı çıkarır.', emoji: '👢', value: 'kickUser' }
                    )
            );
        };

        if (selection === 'rowname') {
            const modalName = new ModalBuilder()
                .setCustomId('myModal')
                .setTitle('Kanal Adı')
                .addComponents(
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId('hobiler')
                            .setLabel("Bir kanal adı belirleyin.")
                            .setRequired(true)
                            .setStyle(TextInputStyle.Short)
                    )
                );
            await interaction.showModal(modalName);
        } else if (selection === 'rowlimit') {
            const modalLimit = new ModalBuilder()
                .setCustomId('myModal2')
                .setTitle('Kullanıcı Limiti')
                .addComponents(
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId('favoriteColorInput')
                            .setLabel("Bir kullanıcı limiti belirleyin.")
                            .setRequired(true)
                            .setStyle(TextInputStyle.Short)
                    )
                );
            await interaction.showModal(modalLimit);
        } else if (selection === 'toggleLock') {
            const isLocked = channel.permissionOverwrites.cache.get(interaction.guild.id)?.deny.has('Connect');
            if (isLocked) {
                await channel.permissionOverwrites.edit(interaction.guild.id, {
                    Connect: true
                });
                await interaction.reply({ content: 'Oda kilidi açıldı.', ephemeral: true });
            } else {
                await channel.permissionOverwrites.edit(interaction.guild.id, {
                    Connect: false
                });
                await interaction.reply({ content: 'Oda kilitlendi.', ephemeral: true });
            }
            await interaction.message.delete();
            await channel.send({ embeds: [createEmbed()], components: [createRow()] });
        } else if (selection === 'toggleVisibility') {
            const isHidden = channel.permissionOverwrites.cache.get(interaction.guild.id)?.deny.has('ViewChannel');
            if (isHidden) {
                await channel.permissionOverwrites.edit(interaction.guild.id, {
                    ViewChannel: true
                });
                await interaction.reply({ content: 'Oda herkese görünür durumda.', ephemeral: true });
            } else {
                await channel.permissionOverwrites.edit(interaction.guild.id, {
                    ViewChannel: false
                });
                await interaction.reply({ content: 'Oda herkese gizlendi.', ephemeral: true });
            }
            await interaction.message.delete();
            await channel.send({ embeds: [createEmbed()], components: [createRow()] });
        } else if (selection === 'toggleBan') {
            const userSelectMenu = new UserSelectMenuBuilder()
                .setCustomId('toggleBanSelect')
                .setPlaceholder('Yasak durumu değiştirilecek kullanıcıyı seçin...')
                .setMinValues(1)
                .setMaxValues(1);

            const row = new ActionRowBuilder().addComponents(userSelectMenu);

            await interaction.reply({
                content: 'Yasak durumunu değiştirmek istediğiniz kullanıcıyı seçin:',
                components: [row],
                ephemeral: true
            });
        } else if (selection === 'kickUser') {
            const userSelectMenu = new UserSelectMenuBuilder()
                .setCustomId('kickUserSelect')
                .setPlaceholder('Odadan atılacak kullanıcıyı seçin...')
                .setMinValues(1)
                .setMaxValues(1);

            const row = new ActionRowBuilder().addComponents(userSelectMenu);

            await interaction.reply({
                content: 'Odadan atmak istediğiniz kullanıcıyı seçin:',
                components: [row],
                ephemeral: true
            });
        }
    }
});

// UserSelectMenu için dinleyici
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isUserSelectMenu()) return;

    const channel = interaction.guild.channels.cache.get(interaction.channelId);
    if (!channel) return;

    const createEmbed = () => {
        return new EmbedBuilder()
            .setColor("#00FF00")
            .setTitle("Kanalınızı Özelleştirin")
            .setDescription(
                `Merhaba **${interaction.member.user.username}**, ses kanalınızı kişiselleştirmek için aşağıdaki seçeneklerden birini seçin.\n\n` +
                `- **Oda İsmi:** Kanalınızın ismini değiştirmek için.\n` +
                `- **Kullanıcı Limiti:** Kanala kaç kişinin katılabileceğini ayarlamak için.\n` +
                `- **Kilit Durumu Değiştir:** Kanalı kilitlemek veya kilidini açmak için.\n` +
                `- **Görünürlük Değiştir:** Kanalı gizlemek veya görünür yapmak için.\n` +
                `- **Yasak Durumu Değiştir:** Bir kullanıcıyı yasaklamak veya yasağını kaldırmak için.\n` +
                `- **Odadan At:** Odadaki bir kullanıcıyı çıkarmak için.`
            )
            .setThumbnail(interaction.guild.iconURL())
            .setTimestamp();
    };

    const createRow = () => {
        return new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('ymoderasyon')
                .setPlaceholder('🏷️ Yönetim panelini açmak için tıklayın...')
                .setMinValues(1)
                .setMaxValues(1)
                .addOptions(
                    { label: 'İsim Değiştir', emoji: '📝', value: 'rowname' },
                    { label: 'Kullanıcı Limiti', emoji: '👥', value: 'rowlimit' },
                    { label: 'Kilit Durumu Değiştir', emoji: '🔐', value: 'toggleLock' },
                    { label: 'Görünürlük Değiştir', emoji: '👁️', value: 'toggleVisibility' },
                    { label: 'Yasak Durumu Değiştir', emoji: '🚫', value: 'toggleBan' },
                    { label: 'Odadan At', emoji: '👢', value: 'kickUser' }
                )
        );
    };

    if (interaction.customId === 'toggleBanSelect') {
        const userId = interaction.values[0];
        const targetUser = interaction.guild.members.cache.get(userId);

        if (channel && targetUser && userId !== interaction.member.id) {
            const isBanned = channel.permissionOverwrites.cache.get(userId)?.deny.has('Connect');
            if (isBanned) {
                await channel.permissionOverwrites.edit(userId, {
                    Connect: null
                });
                await interaction.reply({
                    content: `${targetUser.user.username} üzerindeki oda yasağı kaldırıldı.`,
                    ephemeral: true
                });
            } else {
                await channel.permissionOverwrites.edit(userId, {
                    Connect: false
                });
                await interaction.reply({
                    content: `${targetUser.user.username} odadan yasaklandı.`,
                    ephemeral: true
                });
            }
        } else if (userId === interaction.member.id) {
            await interaction.reply({
                content: 'Kendi yasak durumunuzu değiştiremezsiniz.',
                ephemeral: true
            });
        } else {
            await interaction.reply({
                content: 'Yasak durumu değiştirme işlemi sırasında bir hata oluştu.',
                ephemeral: true
            });
        }
        await channel.send({ embeds: [createEmbed()], components: [createRow()] });
    } else if (interaction.customId === 'kickUserSelect') {
        const userId = interaction.values[0];
        const kickedUser = interaction.guild.members.cache.get(userId);

        if (channel && kickedUser && userId !== interaction.member.id) {
            if (kickedUser.voice.channelId === channel.id) {
                await kickedUser.voice.setChannel(null);
                await interaction.reply({
                    content: `${kickedUser.user.username} odadan atıldı.`,
                    ephemeral: true
                });
            } else {
                await interaction.reply({
                    content: `${kickedUser.user.username} şu anda odada değil.`,
                    ephemeral: true
                });
            }
        } else if (userId === interaction.member.id) {
            await interaction.reply({
                content: 'Kendinizi odadan atamazsınız.',
                ephemeral: true
            });
        } else {
            await interaction.reply({
                content: 'Atma işlemi sırasında bir hata oluştu.',
                ephemeral: true
            });
        }
        await channel.send({ embeds: [createEmbed()], components: [createRow()] });
    }
});


// ModalSubmit için dinleyici
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isModalSubmit()) return;

    if (!checkPermissions(interaction.member, ['ManageChannels'])) {
        return interaction.reply({ 
            content: messages.ERRORS.MISSING_PERMISSIONS,
            ephemeral: true 
        });
    }

    const channel = interaction.guild.channels.cache.get(interaction.channelId);
    if (!channel) return;

    const createEmbed = () => {
        return new EmbedBuilder()
            .setColor("#00FF00")
            .setTitle("Kanalınızı Özelleştirin")
            .setDescription(
                `Merhaba **${interaction.member.user.username}**, ses kanalınızı kişiselleştirmek için aşağıdaki seçeneklerden birini seçin.\n\n` +
                `- **Oda İsmi:** Kanalınızın ismini değiştirmek için.\n` +
                `- **Kullanıcı Limiti:** Kanala kaç kişinin katılabileceğini ayarlamak için.\n` +
                `- **Kilit Durumu Değiştir:** Kanalı kilitlemek veya kilidini açmak için.\n` +
                `- **Görünürlük Değiştir:** Kanalı gizlemek veya görünür yapmak için.\n` +
                `- **Yasak Durumu Değiştir:** Bir kullanıcıyı yasaklamak veya yasağını kaldırmak için.\n` +
                `- **Odadan At:** Odadaki bir kullanıcıyı çıkarmak için.`
            )
            .setThumbnail(interaction.guild.iconURL())
            .setTimestamp();
    };

    const createRow = () => {
        return new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('ymoderasyon')
                .setPlaceholder('🏷️ Yönetim panelini açmak için tıklayın...')
                .setMinValues(1)
                .setMaxValues(1)
                .addOptions(
                    { label: 'İsim Değiştir', emoji: '📝', value: 'rowname' },
                    { label: 'Kullanıcı Limiti', emoji: '👥', value: 'rowlimit' },
                    { label: 'Kilit Durumu Değiştir', emoji: '🔐', value: 'toggleLock' },
                    { label: 'Görünürlük Değiştir', emoji: '👁️', value: 'toggleVisibility' },
                    { label: 'Yasak Durumu Değiştir', emoji: '🚫', value: 'toggleBan' },
                    { label: 'Odadan At', emoji: '👢', value: 'kickUser' }
                )
        );
    };

    if (interaction.customId === 'myModal') {
        const channelName = interaction.fields.getTextInputValue('hobiler');
        if (/^\d+$/.test(channelName)) {
            await interaction.reply({
                content: 'Kanal adı sadece sayı olamaz, lütfen geçerli bir isim girin.',
                ephemeral: true
            });
        } else if (channel) {
            await channel.setName(channelName);
            await interaction.reply({
                content: `Odanın ismi **${channelName}** olarak ayarlandı.`,
                ephemeral: true
            });
            await channel.send({ embeds: [createEmbed()], components: [createRow()] });
        }
    } else if (interaction.customId === 'myModal2') {
        const userLimitInputValue = interaction.fields.getTextInputValue('favoriteColorInput');
        if (isNaN(userLimitInputValue)) {
            await interaction.reply({
                content: 'Lütfen geçerli bir kullanıcı limiti girin (sadece sayı olmalıdır).',
                ephemeral: true
            });
        } else {
            const userLimit = parseInt(userLimitInputValue);
            if (channel) {
                if (userLimit > 99) {
                    await interaction.reply({
                        content: 'Uyarı: Kullanıcı limiti 99\'dan fazla olamaz. Lütfen geçerli bir sayı girin.',
                        ephemeral: true
                    });
                } else {
                    await channel.setUserLimit(userLimit);
                    await interaction.reply({
                        content: `Odanın kullanıcı limiti **${userLimit}** olarak ayarlandı.`,
                        ephemeral: true
                    });
                    await channel.send({ embeds: [createEmbed()], components: [createRow()] });
                }
            }
        }
    }
});

// Button dinleyici
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;

    const kayitYetkiliRoleId = db.get(`desteksistem_${interaction.guild.id}`)?.rol;

    const restrictedButtons = ["yedek_al", "beklemede", "ilgileniliyor", "resolved", "close_ticket"];

    if (restrictedButtons.includes(interaction.customId) && !interaction.member.roles.cache.has(kayitYetkiliRoleId)) {
        return interaction.reply({
            content: messages.ERRORS.MISSING_PERMISSIONS,
            ephemeral: true,
        });
    }

    if (interaction.customId === "destekbuton") {
        const sistem = db.fetch(`desteksistem_${interaction.guild.id}`);

        if (!sistem || !sistem.rol || !sistem.kanal || !sistem.embed || !sistem.buton || !sistem.kategori) {
            return interaction.reply({
                content: "Destek sistemi ayarlanmamış. Lütfen bir yetkili tarafından ayar yapılması gerekir.",
                ephemeral: true,
            });
        }

        const ticketCategoryId = sistem.kategori;

        try {
            const userTickets = interaction.guild.channels.cache.filter(
                (ch) =>
                ch.parentId === ticketCategoryId &&
                ch.name.startsWith(interaction.user.username.toLowerCase())
            );

            const ticketNumber = userTickets.size + 1;
            const ticketChannelName = `${interaction.user.username.toLowerCase()}-${ticketNumber}`;

            const ticketChannel = await interaction.guild.channels.create({
                name: ticketChannelName,
                type: ChannelType.GuildText,
                parent: ticketCategoryId,
                permissionOverwrites: [{
                        id: interaction.guild.id,
                        deny: [PermissionsBitField.Flags.ViewChannel],
                    },
                    {
                        id: interaction.user.id,
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                    },
                    {
                        id: sistem.rol,
                        allow: [
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.ManageMessages,
                        ],
                    },
                ],
            });

            const embed = new EmbedBuilder()
                .setColor("#0099ff")
                .setTitle("Destek Talebi")
                .setDescription(`${interaction.user}, destek talebiniz alınmıştır.`)
                .addFields({
                    name: "Destek Durumu",
                    value: "**Durum:** Beklemede ⚪\n**Yetkili:** Henüz bakılmadı."
                }, {
                    name: "Yardım Talebi",
                    value: "Lütfen yardımcı olmamızı istediğiniz konuyu mesaj ile belirtin ve bir yetkilinin gelmesini bekleyin."
                }, {
                    name: "Kurallar",
                    value: "1. Küfür ve hakaret etmekten kaçının.\n2. Gereksiz spam yapmamaya özen gösterin.\n3. Yetkililere karşı lütfen saygılı olun."
                })
                .setThumbnail(interaction.guild.iconURL())
                .setTimestamp()
                .setFooter({
                    text: "Destek Sistemi"
                });

            const supportButton = new ButtonBuilder()
                .setCustomId("yedek_al")
                .setLabel("Yedek Al")
                .setStyle(ButtonStyle.Danger)
                .setEmoji("💾");

            const workingButton = new ButtonBuilder()
                .setCustomId("beklemede")
                .setLabel("Askıya Al")
                .setStyle(ButtonStyle.Primary)
                .setEmoji("⏳");

            const inProgressButton = new ButtonBuilder()
                .setCustomId("ilgileniliyor")
                .setLabel("İlgileniliyor")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("🔵");

            const solvedButton = new ButtonBuilder()
                .setCustomId("resolved")
                .setLabel("Çözüldü")
                .setStyle(ButtonStyle.Success)
                .setEmoji("✅");

            const row = new ActionRowBuilder().addComponents(supportButton, workingButton, inProgressButton, solvedButton);

            const message = await ticketChannel.send({
                embeds: [embed],
                components: [row]
            });

            interaction.reply({
                content: `Ticket başarıyla oluşturuldu: ${ticketChannel}`,
                ephemeral: true
            });
        } catch (error) {
            console.error("Ticket oluşturulurken hata:", error);
            interaction.reply({
                content: "Ticket oluşturulurken bir hata oluştu.",
                ephemeral: true
            });
        }
    }

    if (interaction.customId === "yedek_al") {
        try {
            const channel = interaction.channel;
            const messages = await channel.messages.fetch();
            const userMessages = messages.filter((msg) => !msg.author.bot); // Bot mesajlarını filtrele

            if (userMessages.size === 0) {
                return interaction.reply({
                    content: "Ticket'ta hiç mesaj yok, yedek alınmadı.",
                    ephemeral: true
                });
            }

            const messageData = userMessages.map((msg) => ({
                author: msg.author.username,
                content: msg.content,
                timestamp: msg.createdTimestamp,
                attachments: msg.attachments.map(attachment => attachment.url),
            }));

            // Mesajları ters sıralama
            messageData.reverse();
 
            const messageContent = `Ticket geçmiş kaydı:\n\n${messageData
		  .map(
			(msg) =>
			  `Kullanıcı: ${msg.author}\nMesaj: ${msg.content}\nTarih: ${new Date(msg.timestamp).toLocaleString()}\nEkler: ${msg.attachments.join(", ")}`).join("\n\n")}`;
  
            const file = Buffer.from(messageContent, "utf-8");

            // Kullanıcıya DM olarak yedek gönderme
            const user = interaction.user;
            await user.send({
                content: `Ticket geçmiş kaydınız aşağıda belirtilmiştir:\n\nKanal: ${channel.name}\nYedek alınan destek: ${user.tag}`,
                files: [{
                    attachment: file,
                    name: `destek_gecmisi_${channel.id}.txt`
                }],
            });

            interaction.reply({
                content: "Ticket geçmişi DM olarak gönderildi.",
                ephemeral: true
            });
        } catch (error) {
            console.error("Yedek alırken bir hata oluştu:", error);
            interaction.reply({
                content: "Bir hata oluştu.",
                ephemeral: true
            });
        }
    }

    if (interaction.customId === "ilgileniliyor") {
        try {
            const embed = EmbedBuilder.from(interaction.message.embeds[0])
                .setFields({
                        name: "Destek Durumu",
                        value: `**Durum:** İlgileniliyor 🔵\n**Yetkili:** <@${interaction.user.id}>`
                    },
                    ...interaction.message.embeds[0].fields.slice(1)
                );

            await interaction.message.edit({
                embeds: [embed]
            });
            interaction.reply({
                content: "Durum 'İlgileniliyor' olarak güncellendi.",
                ephemeral: true
            });
        } catch (error) {
            console.error("İlgileniliyor durumu ayarlanırken bir hata oluştu:", error);
            interaction.reply({
                content: "Bir hata oluştu.",
                ephemeral: true
            });
        }
    }

    if (interaction.customId === "beklemede") {
        try {
            const embed = EmbedBuilder.from(interaction.message.embeds[0])
                .setFields({
                        name: "Destek Durumu",
                        value: `**Durum:** Askıda 🟠\n**Yetkili:** <@${interaction.user.id}>`
                    },
                    ...interaction.message.embeds[0].fields.slice(1)
                );

            await interaction.message.edit({
                embeds: [embed]
            });
            interaction.reply({
                content: "Durum 'Askıda' olarak güncellendi.",
                ephemeral: true
            });
        } catch (error) {
            console.error("Askıda durumu ayarlanırken bir hata oluştu:", error);
            interaction.reply({
                content: "Bir hata oluştu.",
                ephemeral: true
            });
        }
    }

    if (interaction.customId === "resolved") {
        const channel = interaction.channel;
        const member = interaction.member;

        try {
            await channel.send(`Bu destek <@${member.user.id}> tarafından çözüldü olarak kayıt edildi.`);

            let handledTickets = db.get(`handledTickets_${member.id}`) || 0;
            handledTickets += 1;

            db.set(`handledTickets_${member.id}`, handledTickets);

            db.set(`resolvedStatus_${channel.id}`, true);

            const closeButton = new ButtonBuilder()
                .setCustomId("close_ticket")
                .setLabel("Ticket Kapat")
                .setStyle(ButtonStyle.Danger)
                .setEmoji("🔒")
                .setDisabled(false);

            const row = new ActionRowBuilder().addComponents(closeButton);

            await interaction.message.edit({
                components: [row]
            });

            const destekGeçmişiKanaliId = db.get(`logchanneldestekgecmisi_${interaction.guild.id}`);
            const destekGeçmişiKanali = interaction.guild.channels.cache.get(destekGeçmişiKanaliId);

            if (destekGeçmişiKanali) {
                const messages = await interaction.channel.messages.fetch();
                const userMessages = messages.filter((msg) => !msg.author.bot); // Bot mesajlarını filtrele

                if (userMessages.size === 0) {
                    return interaction.reply({
                        content: "Ticket'ta hiç mesaj yok, destek geçmişine yedekleme yapılmadı.",
                        ephemeral: true
                    });
                }

                const messageData = userMessages.map((msg) => {
                    // Eğer mesajda ek varsa, sadece URL'leri al
                    const attachments = msg.attachments.size > 0 ?
                        msg.attachments.map(attachment => attachment.url).join(", ") :
                        null;

                    return {
                        author: msg.author.username,
                        content: msg.content,
                        timestamp: msg.createdTimestamp,
                        attachments: attachments, // URL'leri ekle
                    };
                });
 
				const messageContent = `Ticket geçmiş kaydı:\n\n${messageData.map((msg) =>`Kullanıcı: ${msg.author}\nMesaj: ${msg.content}\nTarih: ${new Date(msg.timestamp).toLocaleString()}\n${msg.attachments ? `Ekler: ${msg.attachments}` : ""}`).join("\n\n")}`;
 
                const file = Buffer.from(messageContent, "utf-8");

                await destekGeçmişiKanali.send({
                    content: `Destek geçmişi:\n\nKanal: ${interaction.channel.name}\nÇözülen Destek: ${interaction.user.tag}`,
                    files: [{
                        attachment: file,
                        name: `destek_gecmisi_${interaction.channel.id}.txt`
                    }],
                });
            }

            interaction.reply({
                content: "Ticket çözüldü olarak işaretlendi ve geçmişi kaydedildi.",
                ephemeral: true
            });
        } catch (error) {
            console.error("Çözüldü durumu ayarlanırken bir hata oluştu:", error);
            interaction.reply({
                content: "Bir hata oluştu.",
                ephemeral: true
            });
        }
    }

    if (interaction.customId === "close_ticket") {
        try {
            if (!interaction.channel || !interaction.channel.isTextBased()) {
                return interaction.reply({
                    content: "Kanal bulunamadı veya zaten silinmiş.",
                    ephemeral: true
                });
            }

            await interaction.channel.delete();
        } catch (error) {
            console.error("Ticket kapatılırken bir hata oluştu:", error);
            interaction.reply({
                content: "Ticket kapatılırken bir hata oluştu.",
                ephemeral: true
            });
        }
    }
});

// Sunucuya katılan birine otomatik rol verme kodu
client.on('guildMemberAdd', async (member) => {
  const rolID = db.fetch(`otorol_${member.guild.id}`);
  if (rolID) {
    const rol = member.guild.roles.cache.get(rolID);
    if (rol) {
      try {
        await member.roles.add(rol);
        console.log(`${member.user.tag} kullanıcısına ${rol.name} rolü verildi.`);
      } catch (error) {
        console.error(`${member.user.tag} kullanıcısına rol verilirken hata:`, error);
      }
    }
  }
});

// Yedek dosyasının yolu
const backupFile = path.join(__dirname, "utils/channels.json");

function loadBackup() {
    if (!fs.existsSync(backupFile)) return {};
    return JSON.parse(fs.readFileSync(backupFile, "utf-8"));
}

function saveBackup(data) {
    fs.writeFileSync(backupFile, JSON.stringify(data, null, 2), "utf-8");
}

client.on("ready", async () => {
  await new Promise(resolve => setTimeout(resolve, 3000));

  const backups = loadBackup();

  for (const guildID in backups) {
    for (const channelID in backups[guildID]) {
      try {
        const channel = await client.channels.fetch(channelID);
        if (channel && channel.type === ChannelType.GuildVoice) {
          const guild = client.guilds.cache.get(guildID);
          if (!guild) continue;

          const voiceChannel = guild.channels.cache.get(channelID);
          if (voiceChannel && voiceChannel.members.size === 0) {
            await voiceChannel.delete();
          }
        }
      } catch (error) {
        if (error.code !== 10003) {
          console.error(`Kanal ${channelID} kontrol edilirken hata oluştu:`, error);
        }
      }
    }
  }
});

const restrictedWords = [
  "sa", "s a", "SA", "S A",
  "selam", "selamun aleyküm", "selamın aleyküm", "selamın aleykum", 
  "SELAM", "SELAMUN ALEYKÜM", "SELAMIN ALEYKÜM", "SELAMIN ALEYKUM",
  "as", "a s", "AS", "A S",
  "slm", "SLM"
];

const userGreetings = new Map();
const userMessages = new Map();

const responses = [
  "kafanı biraz zorlayıp farklı bir şey söylemeyi ne zaman planlıyosun?",
  "dostum mağarana geri dön artık.",
  "medeni olmaya bir hal hatır sormakla başlayabilirsin.",
  "ya amına kodumun ucubesi laftan anlamıyon mu?",
];

const allowedGuildId = "1059516811223257159"; // Belirli sunucu ID

client.on("messageCreate", async (message) => {
  if (message.author.bot || message.guild.id !== allowedGuildId) return;

  const member = await message.guild.members.fetch(message.author.id);
  const botMember = await message.guild.members.fetch(client.user.id);

  restrictedWords.forEach(async (word) => {
    if (message.content.includes(word)) {
      if (message.deletable) message.delete().catch(() => {}); // Mesajı sil, hata olursa görmezden gel

      const userId = message.author.id;
      if (!userGreetings.has(userId)) {
        userGreetings.set(userId, 0);
        userMessages.set(userId, 0);
      }
      userGreetings.set(userId, userGreetings.get(userId) + 1);

      if (userGreetings.get(userId) >= 5) {
        if (member.roles.highest.position < botMember.roles.highest.position) {
          member.timeout(3600000, "Aynı kelimeyi çok kez kullandığı için 1 saatlik timeout uygulandı.").catch(() => {});
          message.channel.send(`${message.author}, çok fazla selam verdin. şimdi siktir git 1 saatlik timeout uygulandı.`);
        } else {
          message.channel.send(`${message.author}, işlem uygulanamadı.Neyse ki yetkilisin amına koduğum sen bari yapma.`);
        }
      } else {
        const messageIndex = userMessages.get(userId);
        if (messageIndex < responses.length) {
          message.channel.send(`${message.author}, ${responses[messageIndex]}`);
          userMessages.set(userId, messageIndex + 1);
        }
      }
    }
  });
});

// Giriş
client.login(process.env.TOKEN).catch(err => {
  console.error('[!] Geçersiz token. Giriş yapılamadı!');
});

// Hata Yakalama
process.on('unhandledRejection', error => {
  console.error(`[HATA] - ${error}`);
});

process.on('uncaughtException', error => {
  console.error(`[HATA] - ${error}`);
});

client.on('warn', m => {
  console.log(`[WARN - 1] - ${m}`);
});

client.on('error', m => {
  console.log(`[HATA - 1] - ${m}`);
});
