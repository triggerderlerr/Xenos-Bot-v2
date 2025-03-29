const { PermissionsBitField } = require('discord.js');

const checkPermissions = (member, permissions) => {
    if (!Array.isArray(permissions)) {
        permissions = [permissions];
    }
    
    return permissions.every(permission => 
        member.permissions.has(PermissionsBitField.Flags[permission])
    );
};

const isAdmin = (member) => {
    return member.permissions.has(PermissionsBitField.Flags.Administrator);
};

const canManageGuild = (member) => {
    return member.permissions.has(PermissionsBitField.Flags.ManageGuild);
};

module.exports = {
    checkPermissions,
    isAdmin,
    canManageGuild
}; 