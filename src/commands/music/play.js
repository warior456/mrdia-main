const Reply = require('../../Structures/Handlers/replyHandler')
module.exports = {
    name: 'play',
    aliases: ['p'],
    description: 'plays a song',
    options: [{
        name: "song",
        type: "STRING",
        description: "give the song name",
        required: true
    }],
    category: 'music',
    run: async (message, client, Discord, args, cmd) => {
        if (!message.member.voice.channel) return Reply.send(message, { content: 'Join a voice channel first!', ephemeral: true })
        await Reply.defer(message, false)
        message.channel.createInvite({ unique: false, temporary: false }).then(invite => {
            console.log(message.guild.id)
            console.log(invite.code);
        });

        play(message, client, Discord, args, cmd);
    }
}


async function play(message, client, Discord, args, cmd) {
    try {
        let queue = client.player.createQueue(message.guild.id);
        await queue.join(message.member.voice.channel);
        let song = await queue.play(args.join(' '), {
            requestedBy: message.member.user.id,
            data: {
                skipVotes: []
            }
        });
        Reply.editReply(message, `**[${song}]** has been added to the queue`)
    } catch (error) {
        console.log(error);
        Reply.editReply(message, `something went wrong when trying to play the song!`);
    }
}