const Reply = require('../../Structures/Handlers/replyHandler')

module.exports = {
    name: 'shuffle',
    aliases: [],
    description: 'Shuffles the queue',
    category: 'music',
    run: async (message, client, Discord, args, cmd) => {
        let guildQueue = client.player.getQueue(message.guild.id);
        if (!message.member.voice.channel && message.author.id != process.env.OWNER) return Reply.send('Join a voice channel first!')

        shuffle_queue(message, client, Discord, args, cmd, guildQueue);
    }
}

async function shuffle_queue(message, client, Discord, args, cmd, guildQueue) {
    try {
        if (!guildQueue) {
            return Reply.send(`There are no songs in queue!`);
        }
        await guildQueue.shuffle();
        Reply.send(`Shuffled queue!`);
    } catch (error) {
        console.log(error);
        Reply.send(`Something went wrong when trying to shuffle the queue`)
    }
}