const Reply = require('../../Structures/Handlers/replyHandler')
const config = require('../../../Config');

module.exports = {
    name: 'forceskip',
    aliases: ['fskip', 'fs'],
    description: 'Force skips the current song',
    category: 'music',
    run: async (message, client, Discord, args, cmd) => {
        let guildQueue = client.player.getQueue(message.guild.id);

        fskip(message, client, Discord, args, cmd, guildQueue);
    }
}


async function fskip(message, client, Discord, args, cmd, guildQueue) {
    if (!guildQueue) Reply.send(message, 'There are no songs to skip!')

    if (message.member.roles.cache.some(role => role.name === 'Dj') || message.member.user.id == config.owner || message.member.permissions.has("ADMINISTRATOR")) {

        await guildQueue.skip();
        await Reply.send(message, `Song skipped!`);
    } else {
        return Reply.send(message, `You have to be a Dj or administrator!`);
    }
}