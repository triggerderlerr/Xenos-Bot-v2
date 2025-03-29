class CommandManager {
    constructor() {
        this.commands = new Map();
        this.cooldowns = new Map();
        this.aliases = new Map();
    }

    registerCommand(command) {
        this.commands.set(command.name, command);
        
        if (command.aliases) {
            command.aliases.forEach(alias => {
                this.aliases.set(alias, command.name);
            });
        }
    }

    getCommand(name) {
        return this.commands.get(name) || this.commands.get(this.aliases.get(name));
    }

    checkCooldown(userId, commandName, cooldownAmount) {
        if (!this.cooldowns.has(commandName)) {
            this.cooldowns.set(commandName, new Map());
        }

        const now = Date.now();
        const timestamps = this.cooldowns.get(commandName);
        const cooldownTime = (cooldownAmount || 3) * 1000;

        if (timestamps.has(userId)) {
            const expirationTime = timestamps.get(userId) + cooldownTime;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return Math.round(timeLeft);
            }
        }

        timestamps.set(userId, now);
        setTimeout(() => timestamps.delete(userId), cooldownTime);
        return false;
    }
}

module.exports = CommandManager; 