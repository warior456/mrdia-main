module.exports = {
    name: 'pause',
    aliases: ['resume'],
    description: 'pause the current song',

    run: (message, args, cmd, client, Discord) => {
        let guildQueue = client.player.getQueue(message.guild.id);
        if (!message.member.voice.channel && message.author.id != process.env.OWNER) return message.channel.send('Join a voice channel first!')

        if (cmd === 'pause') pause(message, args, cmd, client, Discord, guildQueue);

        else if (cmd === 'resume') resume(message, args, cmd, client, Discord, guildQueue);
    }
}

function pause(message, args, cmd, client, Discord, guildQueue) {
    try {
        guildQueue.setPaused(true);
    } catch (error) {
        message.channel.send(`Something went wrong when trying to pause the song!`);
    }

}

function resume(message, args, cmd, client, Discord, guildQueue) {
    try {
        guildQueue.setPaused(false);
    } catch (error) {
        message.channel.send(`Something went wrong when trying to resume the song!`);
    }
}