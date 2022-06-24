module.exports = {
    name: 'stop',
    aliases: ['leave'],
    description: 'Stops the song and disconnects the bot',

    run: async (message, client, Discord, args, cmd) => {
        let guildQueue = client.player.getQueue(message.guild.id);
        if (!message.member.voice.channel && message.author.id != process.env.OWNER) return message.channel.send('Join a voice channel first!')

        if (cmd === 'stop' || cmd === 'leave') stop(message, client, Discord, args, cmd, guildQueue);
    }
}

async function stop(message, client, Discord, args, cmd, guildQueue) {
    try {
        if (!guildQueue) {
            return message.channel.send('No songs playing!');
        }
        let userC = message.member.voice.channel.members.size
        if (userC < 4) guildQueue.stop();
        if (message.member.roles.cache.some(role => role.name === 'Dj') || message.author.id == process.env.OWNER || message.member.permissions.has("ADMINISTRATOR")) {
            guildQueue.stop();
        }
        else {
            message.channel.send(`[Dj] role required (more than 3 people in voice)`)
        }
    } catch (error) {
        console.log(error);
        message.channel.send(`Something went wrong when trying to stop the music!`);
    }
}