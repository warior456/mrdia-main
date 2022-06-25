module.exports = {
    name: 'loopqueue',
    aliases: ['lq'],
    description: 'Loops the queue',
    category: 'music',
    run: (message, client, Discord, args, cmd) => {
        let guildQueue = client.player.getQueue(message.guild.id);
        if (!message.member.voice.channel && message.author.id != process.env.OWNER) return message.channel.send('Join a voice channel first!')

        if (cmd === 'loopqueue' || cmd === 'lq') loop_queue(message, client, Discord, args, cmd, guildQueue);
    }
}

function loop_queue(message, client, Discord, args, cmd, guildQueue) {
    try {
        if (!guildQueue) {
            return message.channel.send(`There are no songs in queue!`);
        }
        switch (guildQueue.repeatMode) {
            case 0:
                guildQueue.setRepeatMode(2);
                message.channel.send(`Queue is now looping!`);
                break;
            case 2:
                guildQueue.setRepeatMode(0);
                message.channel.send(`Queue is no longer looping!`);
                break;
            default:
                guildQueue.setRepeatMode(0);
                message.channel.send(`Turned of song loop do loopqueue again to enable queue loop.`)
                break;
        }
    } catch (error) {
        console.log(error);
    }
}