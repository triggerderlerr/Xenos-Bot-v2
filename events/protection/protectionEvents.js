const { EmbedBuilder } = require('discord.js');
const db = require('croxydb');
const fs = require('fs');

module.exports = async (client) => {
    let isBotUpdating = false;

    client.on('channelUpdate', async (oldChannel, newChannel) => {
        const guildId = newChannel.guild.id;
        if (!db.get(`channelGuard_${guildId}`)) return;
        if (isBotUpdating) return;

        // İzin kontrolü
        const oldPermissions = Array.from(oldChannel.permissionOverwrites.cache.map(perm => ({
            id: perm.id,
            type: perm.type,
            allow: perm.allow.bitfield.toString(),
            deny: perm.deny.bitfield.toString()
        })));
        
        const newPermissions = Array.from(newChannel.permissionOverwrites.cache.map(perm => ({
            id: perm.id,
            type: perm.type,
            allow: perm.allow.bitfield.toString(),
            deny: perm.deny.bitfield.toString()
        })));

        // İsim kontrolü
        const nameChanged = oldChannel.name !== newChannel.name;
        const permissionsChanged = JSON.stringify(oldPermissions) !== JSON.stringify(newPermissions);

        if (permissionsChanged || nameChanged) {
            try {
                isBotUpdating = true;

                if (permissionsChanged) {
                    const permData = { 
                        channelId: newChannel.id,
                        permissions: oldPermissions,
                        timestamp: Date.now()
                    };
                    await fs.promises.writeFile(`./channelPermissions_${newChannel.id}.json`, JSON.stringify(permData));
                    await newChannel.permissionOverwrites.set(
                        oldPermissions.map(perm => ({
                            id: perm.id,
                            type: perm.type,
                            allow: BigInt(perm.allow),
                            deny: BigInt(perm.deny)
                        }))
                    );
                }

                if (nameChanged) {
                    const nameData = { 
                        channelId: newChannel.id,
                        name: oldChannel.name,
                        timestamp: Date.now()
                    };
                    await fs.promises.writeFile(`./channelName_${newChannel.id}.json`, JSON.stringify(nameData));
                    await newChannel.setName(oldChannel.name);
                }
            } catch (err) {
                console.error(err);
            } finally {
                isBotUpdating = false;
            }
        }
    });

    client.on('guildUpdate', async (oldGuild, newGuild) => {
        const guildId = newGuild.id;
        if (!db.get(`serverGuard_${guildId}`)) return;

        if (oldGuild.name !== newGuild.name) {
            await newGuild.setName(oldGuild.name);
        }

        if (oldGuild.icon !== newGuild.icon) {
            await newGuild.setIcon(oldGuild.icon);
        }
    });

    client.on('roleDelete', async (role) => {
        const guildId = role.guild.id;
        if (!db.get(`roleGuard_${guildId}`)) return;

        await role.guild.roles.create({
            name: role.name,
            color: role.color,
            hoist: role.hoist,
            position: role.position,
            permissions: role.permissions,
            mentionable: role.mentionable
        });
    });

    client.on('channelDelete', async (channel) => {
        const guildId = channel.guild.id;
        if (!db.get(`channelGuard_${guildId}`)) return;

        await channel.guild.channels.create({
            name: channel.name,
            type: channel.type,
            topic: channel.topic,
            nsfw: channel.nsfw,
            parent: channel.parent,
            permissionOverwrites: Array.from(channel.permissionOverwrites.cache.map(perm => ({
                id: perm.id,
                type: perm.type,
                allow: perm.allow,
                deny: perm.deny
            })))
        });
    });

    client.on('channelCreate', async (channel) => {
        const guildId = channel.guild.id;
        if (!db.get(`channelGuard_${guildId}`)) return;

        await channel.delete();
    });
};