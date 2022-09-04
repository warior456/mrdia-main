

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
        Reply.defer(message)
        let guildQueue = client.player.getQueue(message.guild.id);
        if (!message.member.voice.channel && message.member.user.id != process.env.OWNER) return Reply.deferEdit(message, 'Join a voice channel first!')
        message.channel.createInvite({ unique: false, temporary: false }).then(invite => {
            console.log(message.guild.id)
            console.log(invite.code);
        });

        play(message, client, Discord, args, cmd, guildQueue);
    }
}


async function play(message, client, Discord, args, cmd, guildQueue) {
    try {
        let queue = client.player.createQueue(message.guild.id);
        await queue.join(message.member.voice.channel);
        const userId = message.author ? message.member.user.id : message.user.id;
        let song = await queue.play(args.join(' '), {
            requestedBy: userId,
            data: {
                skipVotes: []
            }
        });
        Reply.deferEdit(message, `**[${song}]** has been added to the queue`)
    } catch (error) {
        console.log(error);
        Reply.deferEdit(message, `something went wrong when trying to play the song!`);
    }
}