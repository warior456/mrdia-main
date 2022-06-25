module.exports = {
    name: 'seek',
    aliases: [],
    description: 'seek to a set time in the song',
    category: 'music',
    run: async (message, client, Discord, args, cmd) => {
        let guildQueue = client.player.getQueue(message.guild.id);
        if (!message.member.voice.channel && message.author.id != process.env.OWNER) return message.channel.send('Join a voice channel first!')

        if (cmd === 'seek') seek(message, client, Discord, args, cmd, guildQueue);
    }
}

async function seek (message, client, Discord, args, cmd, guildQueue) {
    try {
        if (!guildQueue) {
            return message.channel.send(`There are no songs playing!`)
        }
        console.log(guildQueue.nowPlaying.milliseconds)
        if (args[0] * 1000 < guildQueue.nowPlaying.milliseconds) {
            await guildQueue.seek(parseInt(args[0]) * 1000);
            message.channel.send(`Set the time to ${args[0]} seconds`)
        } else {
            message.channel.send(`you can't seek higher than ${guildQueue.nowPlaying.milliseconds / 1000} seconds with this song!`)
        }

    } catch (error) {
        message.channel.send(`Something went wrong when seeking!`);
        console.log(error);
    }
}