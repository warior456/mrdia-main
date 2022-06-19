module.exports = {
    name: 'loop',
    aliases: ['l'],
    description: 'Loops the current song',

    run: (message, args, cmd, client, Discord) => {
        let guildQueue = client.player.getQueue(message.guild.id);
        if (!message.member.voice.channel && message.author.id != process.env.OWNER) return message.channel.send('Join a voice channel first!')

        if (cmd === 'l' || cmd === 'loop') loop(message, args, cmd, client, Discord, guildQueue);
    }
}

function loop(message, args, cmd, client, Discord, guildQueue) {
    try {
        if (!guildQueue) {
            return message.channel.send(`There are no songs in queue!`);
        }
        switch (guildQueue.repeatMode) {
            case 0:
                guildQueue.setRepeatMode(1);
                message.channel.send(`Song is now looping!`);
                break;
            case 1:
                guildQueue.setRepeatMode(0);
                message.channel.send(`Song is no longer looping!`);
                break;
            default:
                guildQueue.setRepeatMode(0);
                message.channel.send(`Turned of loopqueue do loop again to enable song loop.`)
                break;
        }
    } catch (error) {
        console.log(error);
    }
}