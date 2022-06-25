module.exports = {
    name: 'forceskip',
    aliases: ['fskip', 'fs'],
    description: 'Force skips the current song',
    category: 'music',
    run: (message, client, Discord, args, cmd) => {
        let guildQueue = client.player.getQueue(message.guild.id);
        if (!message.member.voice.channel && message.author.id != process.env.OWNER) return message.channel.send('Join a voice channel first!')

        if (cmd === 'forceskip' || cmd === 'fskip' || cmd === 'fs') fskip(message, client, Discord, args, cmd, guildQueue);
    }
}


async function fskip(message, client, Discord, args, cmd, guildQueue) {
    if (message.member.roles.cache.some(role => role.name === 'Dj') || message.author.id == process.env.OWNER || message.member.permissions.has("ADMINISTRATOR")) {

        await guildQueue.skip();
        await message.channel.send(`Song skipped!`);
    } else {
        return message.channel.send(`You have to be a Dj or administrator!`);
    }
}