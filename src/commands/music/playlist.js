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
        Reply.defer(message)
        let guildQueue = client.player.getQueue(message.guild.id);
        if (!message.member.voice.channel && message.member.user.id != process.env.OWNER) return Reply.send(message, 'Join a voice channel first!')
        playlist(message, client, Discord, args, cmd, guildQueue);
    }
}


async function playlist(message, client, Discord, args, cmd, guildQueue) {
    try {
        let queue = client.player.createQueue(message.guild.id);
        await queue.join(message.member.voice.channel);
        let song = await queue.playlist(args.join(' '), {
            requestedBy: message.member.user.id,
            data: {
                skipVotes: []
            }
        });
        if (song === 'undefined') {
            queue.stop();
            return Reply.deferEdit(message,'Something went wrong!');
        }
        Reply.deferEdit(message, `**[${song}]** has been added to the queue`)
    } catch (error) {
        console.log(error);
        Reply.deferEdit(message ,`something went wrong when trying to add the queue!`);
    }
}