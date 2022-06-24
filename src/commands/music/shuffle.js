module.exports = {
    name: 'shuffle',
    aliases: [],
    description: 'Shuffles the queue',

    run: async (message, client, Discord, args, cmd) => {
        let guildQueue = client.player.getQueue(message.guild.id);
        if (!message.member.voice.channel && message.author.id != process.env.OWNER) return message.channel.send('Join a voice channel first!')

        if (cmd === 'shuffle') shuffle_queue(message, client, Discord, args, cmd, guildQueue);
    }
}

async function shuffle_queue(message, client, Discord, args, cmd, guildQueue) {
    try {
        if (!guildQueue) {
            return message.channel.send(`There are no songs in queue!`);
        }
        await guildQueue.shuffle();
        message.channel.send(`Shuffled queue!`);
    } catch (error) {
        console.log(error);
        message.channel.send(`Something went wrong when trying to shuffle the queue`)
    }
}