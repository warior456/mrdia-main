const Reply = require('../../Structures/Handlers/replyHandler')

module.exports = {
    name: 'skip',
    aliases: ['s'],
    description: 'skips the current song',
    category: 'music',
    run: async (message, client, Discord, args, cmd) => {
        let guildQueue = client.player.getQueue(message.guild.id);
        if (!message.member.voice.channel && message.author.id != process.env.OWNER) return Reply.send('Join a voice channel first!')

        skip(message, client, Discord, args, cmd, guildQueue);
    }
}

async function skip(message, client, Discord, args, cmd, guildQueue) {
    try {
        if (!guildQueue) return Reply.send(`Nothing to skip!`);


        let userC = message.member.voice.channel.members.size
        let userR = Math.floor(userC / 2)

        if (guildQueue.nowPlaying.data.skipVotes.includes(message.author.id)) return Reply.send(`you already voted, ${guildQueue.nowPlaying.data.skipVotes.length}/${userR}`)
        await guildQueue.nowPlaying.data.skipVotes.push(message.author.id)

        console.log(guildQueue.nowPlaying.data)

        if (guildQueue.nowPlaying.data.skipVotes.length >= userR) {
            guildQueue.nowPlaying.data.skipVotes = [];
            await guildQueue.skip();
            Reply.send(`Song skipped!`);
        } else {
            Reply.send(`voted! ${guildQueue.nowPlaying.data.skipVotes.length}/${userR}`)
        }


    } catch (error) {
        console.log(error);
        Reply.send(`Something went wrong when trying to skip the song!`);
    }

}