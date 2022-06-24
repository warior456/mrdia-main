module.exports = {
    name: 'setvolume',
    aliases: ['sv'],
    description: 'Sets the volume of the bot',

    run: (message, client, Discord, args, cmd) => {
        let guildQueue = client.player.getQueue(message.guild.id);
        if (!message.member.voice.channel && message.author.id != process.env.OWNER) return message.channel.send('Join a voice channel first!')

        if (cmd === 'setvolume' || cmd === 'sv') setVolume(message, client, Discord, args, cmd, guildQueue);
    }
}

function setVolume (message, client, Discord, args, cmd, guildQueue) {
    try {
        if (message.member.roles.cache.some(role => role.name === 'Dj') || message.author.id == process.env.OWNER || message.member.permissions.has("ADMINISTRATOR")) {
            guildQueue.setVolume(parseInt(args[0]));
        }
        else if (args[0] <= 300) {
            guildQueue.setVolume(parseInt(args[0]));
        }
        else {
            message.channel.send(`You need [Dj] role to set the volume above 300`)
        }

    } catch (error) {

    }
}