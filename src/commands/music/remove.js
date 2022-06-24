module.exports = {
    name: 'remove',
    aliases: [],
    description: 'removes the given song',

    run: async (message, client, Discord, args, cmd) => {
        let guildQueue = client.player.getQueue(message.guild.id);
        if (!message.member.voice.channel && message.author.id != process.env.OWNER) return message.channel.send('Join a voice channel first!')

        if (cmd === 'remove') remove_song(message, client, Discord, args, cmd, guildQueue);
    }
}

async function remove_song(message, client, Discord, args, cmd, guildQueue) {
    try {
        if (!guildQueue) {
            return message.channel.send(`There are no songs in queue!`);
        }
        let remSongs = ''
        for (let i = 0; i < args.length; i++) {
            await guildQueue.remove(parseInt(args[i]))
            remSongs += `${args[i]} `
        }
        message.channel.send(`Removed song ${remSongs}from the queue!`);
    } catch (error) {
        console.log(error)
    }

}