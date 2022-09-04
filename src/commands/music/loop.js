const Reply = require('../../Structures/Handlers/replyHandler')
//todo options
module.exports = {
    name: 'loop',
    aliases: ['l'],
    description: 'Loops the current song',
    category: 'music',
    run: (message, client, Discord, args, cmd) => {
        let guildQueue = client.player.getQueue(message.guild.id);
        if (!message.member.voice.channel && message.member.user.id != process.env.OWNER) return Reply.send(message, 'Join a voice channel first!')

        loop(message, client, Discord, args, cmd, guildQueue);
    }
}

function loop(message, client, Discord, args, cmd, guildQueue) {
    try {
        if (!guildQueue) {
            return Reply.send(message, `There are no songs in queue!`);
        }
        switch (guildQueue.repeatMode) {
            case 0:
                guildQueue.setRepeatMode(1);
                Reply.send(message, `Song is now looping!`);
                break;
            case 1:
                guildQueue.setRepeatMode(0);
                Reply.send(message, `Song is no longer looping!`);
                break;
            default:
                guildQueue.setRepeatMode(0);
                Reply.send(message, `Turned of loopqueue do loop again to enable song loop.`)
                break;
        }
    } catch (error) {
        console.log(error);
    }
}