const Reply = require('../../Structures/Handlers/replyHandler')

module.exports = {
    name: 'seek',
    aliases: [],
    description: 'seek to a set time in the song',
    options: [{
        name: "seektime",
        type: "INTEGER",
        description: "Give the time in the song to skip to in seconds",
        required: true
    }],
    category: 'music',
    run: async (message, client, Discord, args, cmd) => {
        let guildQueue = client.player.getQueue(message.guild.id);
        if (!message.member.voice.channel && message.member.user.id != process.env.OWNER) return Reply.send(message, 'Join a voice channel first!')

        seek(message, client, Discord, args, cmd, guildQueue);
    }
}

async function seek(message, client, Discord, args, cmd, guildQueue) {
    try {
        if (!guildQueue) {
            return Reply.send(message, `There are no songs playing!`)
        }
        console.log(guildQueue.nowPlaying.milliseconds)
        if (args[0] * 1000 < guildQueue.nowPlaying.milliseconds) {
            await guildQueue.seek(parseInt(args[0]) * 1000);
            Reply.send(message, `Set the time to ${args[0]} seconds`)
        } else {
            Reply.send(message, `you can't seek higher than ${guildQueue.nowPlaying.milliseconds / 1000} seconds with this song!`)
        }

    } catch (error) {
        Reply.send(message, `Something went wrong when seeking!`);
        console.log(error);
    }
}