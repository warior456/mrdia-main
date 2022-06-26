
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
        let guildQueue = client.player.getQueue(message.guild.id);
        if (!message.member.voice.channel && message.author.id != process.env.OWNER) return message.channel.send('Join a voice channel first!')
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
        // let userId = message.author.id
        
        let userId 
        if (!message.author) {
            userId = message.user.id;
        }else{userId = message.author.id}
        
        let song = await queue.play(args.join(' '), {
            requestedBy: userId,
            data: {
                skipVotes: []
            }
        });
        if (song === 'undefined') {
            queue.stop();
            return message.channel.send('Something went wrong!');
        }
        message.channel.send(`**[${song}]** has been added to the queue`)
    } catch (error) {
        console.log(error);
        message.channel.send(`something went wrong when trying to play the song!`);
    }
}