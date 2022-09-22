const Reply = require('../../Structures/Handlers/replyHandler')
const config = require('../../../Config');

module.exports = {
    name: 'setvolume',
    aliases: ['sv'],
    description: 'Sets the volume of the bot',
    options: [{
        name: "volume",
        type: "INTEGER",
        description: "give a value between 1-300 (or for Dj's it can be higher)",
        required: true
    }],
    category: 'music',
    run: (message, client, Discord, args, cmd) => {
        let guildQueue = client.player.getQueue(message.guild.id);
        if (!message.member.voice.channel && message.member.user.id != config.owner) return Reply.send(message, 'Join a voice channel first!')

        setVolume(message, client, Discord, args, cmd, guildQueue);
    }
}

function setVolume (message, client, Discord, args, cmd, guildQueue) {
    try {
        if (message.member.roles.cache.some(role => role.name === 'Dj') || message.member.user.id == config.owner || message.member.permissions.has("ADMINISTRATOR")) {
            guildQueue.setVolume(parseInt(args[0]));
            Reply.send(message, `Volume set to ${args[0]}`)
        }
        else if (args[0] <= 300) {
            guildQueue.setVolume(parseInt(args[0]));
            Reply.send(message, `Volume set to ${args[0]}`)
        }
        else {
            Reply.send(message, `You need [Dj] role to set the volume above 300`)
        }

    } catch (error) {

    }
}