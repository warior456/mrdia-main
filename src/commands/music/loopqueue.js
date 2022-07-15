const Reply = require('../../Structures/Handlers/replyHandler')
//todo options
module.exports = {
    name: 'loopqueue',
    aliases: ['lq'],
    description: 'Loops the queue',
    category: 'music',
    run: (message, client, Discord, args, cmd) => {
        let guildQueue = client.player.getQueue(message.guild.id);
        if (!message.member.voice.channel && message.author.id != process.env.OWNER) return Reply.send(message, 'Join a voice channel first!')

        loop_queue(message, client, Discord, args, cmd, guildQueue);
    }
}

function loop_queue(message, client, Discord, args, cmd, guildQueue) {
    try {
        if (!guildQueue) {
            return Reply.send(message, `There are no songs in queue!`);
        }
        switch (guildQueue.repeatMode) {
            case 0:
                guildQueue.setRepeatMode(2);
                Reply.send(message, `Queue is now looping!`);
                break;
            case 2:
                guildQueue.setRepeatMode(0);
                Reply.send(message, `Queue is no longer looping!`);
                break;
            default:
                guildQueue.setRepeatMode(0);
                Reply.send(message, `Turned of song loop do loopqueue again to enable queue loop.`)
                break;
        }
    } catch (error) {
        console.log(error);
    }
}