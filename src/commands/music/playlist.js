const Reply = require('../../Structures/Handlers/replyHandler')
module.exports = {
    name: 'playlist',
    aliases: ['pl'],
    description: 'Add a YouTube or Spotify playlist to the queue',
    options: [{
        name: "url",
        type: "STRING",
        description: "Give the playlist url",
        required: true
    }],
    category: 'music',
    run: async (message, client, Discord, args, cmd) => {

        let guildQueue = client.player.getQueue(message.guild.id);
        if (!message.member.voice.channel && message.author.id != process.env.OWNER) return Reply.send(message, 'Join a voice channel first!')
        Reply.defer
        playlist(message, client, Discord, args, cmd, guildQueue);
    }
}


async function playlist(message, client, Discord, args, cmd, guildQueue) {
    try {
        let queue = client.player.createQueue(message.guild.id);
        await queue.join(message.member.voice.channel);
        let song = await queue.playlist(args.join(' '), {
            requestedBy: message.author.id,
            data: {
                skipVotes: []
            }
        });
        if (song === 'undefined') {
            queue.stop();
            return Reply.edit(message,'Something went wrong!');
        }
        Reply.edit(message, `**[${song}]** has been added to the queue`)
    } catch (error) {
        console.log(error);
        Reply.edit(message ,`something went wrong when trying to add the queue!`);
    }
}