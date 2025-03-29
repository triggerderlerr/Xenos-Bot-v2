// Diğer gereksinimler
const Discord = require("discord.js");
const { createCanvas, loadImage } = require('canvas');
const GIFEncoder = require('gifencoder');
const path = require('path');

const coord1 = [-25, -33, -42, -14];
const coord2 = [-25, -13, -34, -10];

async function streamToArray(stream) {
    const array = [];
    for await (const chunk of stream) {
        array.push(chunk);
    }
    return array;
}

function drawImageWithTint(ctx, image, tint, x, y, width, height) {
    ctx.save();
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = tint;
    ctx.fillRect(x, y, width, height);
    ctx.drawImage(image, x, y, width, height);
    ctx.restore();
}

module.exports = {
  name: "efekt", // Komut ismi
  description: "Profil resminizi kullanarak efekt uygular.",
  options: [
    {
      name: "144p",
      description: "Profil resminizin kalitesini düşürür.",
      type: 1,
      options: [
        {
          name: "kullanıcı",
          description: "Bir kullanıcı ID'si ya da etiketi gir.",
          type: 6,
          required: false
        },
      ]
    },
    {
      name: "magik",
      description: "Profil resminizi abuk subuk bir şeye çevirir.",
      type: 1,
      options: [
        {
          name: "kullanıcı",
          description: "Bir kullanıcı ID'si ya da etiketi gir.",
          type: 6,
          required: false
        },
      ]
    },
    {
      name: "trigger",
      description: "Deneyerek görebilirsiniz.",
      type: 1,
      options: [
        {
          name: "kullanıcı",
          description: "Bir kullanıcı ID'si ya da etiketi gir.",
          type: 6,
          required: false
        },
      ]
    },
  ],
  async run(client, interaction, options) {
    await interaction.deferReply(); // Yanıtı geciktir

    try {
      const user = interaction.options.getUser("kullanıcı") || interaction.user;
      const command = interaction.options.getSubcommand(); // Kullanıcının seçtiği komut

      let commandtoURL;
      if (command == "trigger") {
        const avatarURL = user.displayAvatarURL({ extension: 'png', forceStatic: true, size: 512 });
        const base = await loadImage('https://i.imgyukle.com/2024/11/25/CgrNbp.png'); // Yeni link burada
        const avatar = await loadImage(avatarURL);
        const encoder = new GIFEncoder(base.width, base.width);
        const canvas = createCanvas(base.width, base.width);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, base.width, base.width);
        const stream = encoder.createReadStream();
        encoder.start();
        encoder.setRepeat(0);
        encoder.setDelay(50);
        encoder.setQuality(200);
        for (let i = 0; i < 4; i++) {
          drawImageWithTint(ctx, avatar, 'red', coord1[i], coord2[i], 300, 300);
          ctx.drawImage(base, 0, 218, 256, 38);
          encoder.addFrame(ctx);
        }
        encoder.finish();
        const buffer = await streamToArray(stream);

        const file = new Discord.AttachmentBuilder(Buffer.concat(buffer), { name: "triggered.gif" });

        return interaction.editReply({
          embeds: [
            {
              color: 0xEB1C5A,
              author: {
                name: `${client.user.username} • Triggered`,
                icon_url: client.user.displayAvatarURL(), // Optional: Add bot avatar to author
              },
              title: 'Birisi tetiklendi!',
              description: `${user.username} şu an **Triggered** oldu! 🎯🔥`,
              image: {
                url: 'attachment://triggered.gif',
              },
              timestamp: new Date(),
              footer: {
                text: 'Efekt botu tarafından sağlanmıştır.',
              },
            }
          ],
          files: [file]
        });
      }
      else if (command == "144p") {
        commandtoURL = `https://nekobot.xyz/api/imagegen?type=jpeg&url=${user.displayAvatarURL({ extension: "png", forceStatic: true, size: 512 })}`;
      }
      else if (command == "magik") {
        commandtoURL = `https://nekobot.xyz/api/imagegen?type=magik&image=${user.displayAvatarURL({ extension: "png", forceStatic: true, size: 256 })}`;
      }

      // Dinamik import ile fetch kullanıyoruz
      const { default: fetch } = await import('node-fetch'); 

      const request = await fetch(commandtoURL);
      const requestJSON = await request.json();

      if (!request || !requestJSON?.message) {
        return interaction.editReply({
          embeds: [
            {
              color: 0xEB1C5A,
              title: '**»** Bir Hata Oluştu!',
              description: `**•** Hatanın sebebini bilmiyorum. Lütfen tekrar deneyin.`
            }
          ]
        });
      }

      return await interaction.editReply({
        embeds: [
          {
            color: 0xEB1C5A,
            author: {
              name: `${client.user.username} • ${command.replace('magik', "Magik")}`,
              icon_url: client.user.displayAvatarURL(),
            },
            image: {
              url: requestJSON.message,
            },
            timestamp: new Date(),
          }
        ]
      });

    } catch (err) {
      console.error(err);
      return interaction.editReply({
        embeds: [
          {
            color: 0xEB1C5A,
            title: '**»** Bir Hata Oluştu!',
            description: `**•** Sistemde bir hata meydana geldi. Lütfen tekrar deneyin.`
          }
        ]
      });
    }
  }
};
