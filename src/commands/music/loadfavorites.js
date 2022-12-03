const mongoose = require('mongoose')
const User = require('../../schemas/user')
const Reply = require('../../Structures/Handlers/replyHandler')

module.exports = {
    name: 'loadfavorites',
    aliases: ['lof'],
    description: 'Loads your personal favorite list to the queue',
    category: 'music',
    run: async (message, client, Discord, args, cmd, player) => {
        if (!message.member.voice.channel) return Reply.send(message, { content: 'Join a voice channel first!', ephemeral: true })
        await Reply.defer(message, false)
        let userProfile = await User.findOne({ userId: message.member.user.id })
        loadFavorites(message, client, userProfile);
    }
}
async function loadFavorites(message, client, userProfile) {
    Reply.editReply(message, {content: 'Loading queue', ephemeral: false })
    try {
        let queue = client.player.createQueue(message.guild.id);
        await queue.join(message.member.voice.channel);
        userProfile.userFavoriteLinks.forEach(async songUrl => {
            await queue.play(songUrl, {
                requestedBy: message.member.user.id,
                data: {
                    skipVotes: []
                }
            });
        });
        
        Reply.follow(message, `**${message.member.user.username}'s** favorites have been loaded`)
    } catch (error) {
        console.log(error);
        Reply.editReply(message, `Something went wrong when trying to load **${message.member.user.username}'s** favorites`);
    }
}