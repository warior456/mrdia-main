

Reply = require('../../Structures/Handlers/replyHandler')
module.exports = {
    name: 'play',
    aliases: ['p', 'shuffle', 'setvolume'],
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
        if (!message.member.voice.channel && message.author.id != process.env.OWNER) return Reply.edit(message, 'Join a voice channel first!')
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

        const userId = message.author ? message.author.id : message.user.id;

        let song = await queue.play(args.join(' '), {
            requestedBy: userId,
            data: {
                skipVotes: []
            }
        });
        if (song === 'undefined') {
            queue.stop();
            return Reply.edit(message, 'Something went wrong!');
        }
        Reply.edit(message, `**[${song}]** has been added to the queue`)
    } catch (error) {
        console.log(error);
        Reply.edit(message, `something went wrong when trying to play the song!`);
    }
}