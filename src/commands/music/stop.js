const Reply = require('../../Structures/Handlers/replyHandler')

module.exports = {
    name: 'stop',
    aliases: ['leave'],
    description: 'Stops the song and disconnects the bot',
    category: 'music',
    run: async (message, client, Discord, args, cmd) => {
        let guildQueue = client.player.getQueue(message.guild.id);
        if (!message.member.voice.channel && message.author.id != process.env.OWNER) return Reply.send('Join a voice channel first!')

        stop(message, client, Discord, args, cmd, guildQueue);
    }
}

async function stop(message, client, Discord, args, cmd, guildQueue) {
    try {
        if (!guildQueue) {
            return Reply.send('No songs playing!');
        }
        let userC = message.member.voice.channel.members.size
        if (userC < 4) guildQueue.stop();
        if (message.member.roles.cache.some(role => role.name === 'Dj') || message.author.id == process.env.OWNER || message.member.permissions.has("ADMINISTRATOR")) {
            guildQueue.stop();
        }
        else {
            Reply.send(`[Dj] role required (more than 3 people in voice)`)
        }
    } catch (error) {
        console.log(error);
        Reply.send(`Something went wrong when trying to stop the music!`);
    }
}