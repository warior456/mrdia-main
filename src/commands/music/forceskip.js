const Reply = require('../../Structures/Handlers/replyHandler')

module.exports = {
    name: 'forceskip',
    aliases: ['fskip', 'fs'],
    description: 'Force skips the current song',
    category: 'music',
    run: (message, client, Discord, args, cmd) => {
        let guildQueue = client.player.getQueue(message.guild.id);
        if (!message.member.voice.channel && message.member.user.id != process.env.OWNER) return Reply.send(message, 'Join a voice channel first!')

        fskip(message, client, Discord, args, cmd, guildQueue);
    }
}


async function fskip(message, client, Discord, args, cmd, guildQueue) {
    if (message.member.roles.cache.some(role => role.name === 'Dj') || message.member.user.id == process.env.OWNER || message.member.permissions.has("ADMINISTRATOR")) {

        await guildQueue.skip();
        await Reply.send(message, `Song skipped!`);
    } else {
        return Reply.send(message, `You have to be a Dj or administrator!`);
    }
}