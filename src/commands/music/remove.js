const Reply = require('../../Structures/Handlers/replyHandler')
//todo multiple songs and options
module.exports = {
    name: 'remove',
    aliases: [],
    description: 'Removes the given song',
    options: [{
        name: "songnumber",
        type: "INTEGER",
        description: "Give the song number",
        required: true
    }],
    category: 'music',
    run: async (message, client, Discord, args, cmd) => {
        let guildQueue = client.player.getQueue(message.guild.id);
        if (!message.member.voice.channel && message.author.id != process.env.OWNER) return Reply.send(message, 'Join a voice channel first!')

        remove_song(message, client, Discord, args, cmd, guildQueue);
    }
}

async function remove_song(message, client, Discord, args, cmd, guildQueue) {
    try {
        if (!guildQueue) {
            return Reply.send(message, `There are no songs in queue!`);
        }
        let remSongs = ''
        for (let i = 0; i < args.length; i++) {
            await guildQueue.remove(parseInt(args[i]))
            remSongs += `${args[i]} `
        }
        Reply.send(message, `Removed song ${remSongs}from the queue!`);
    } catch (error) {
        console.log(error)
    }

}