const mongoose = require('mongoose')
const User = require('../../schemas/user')
const Reply = require('../../Structures/Handlers/replyHandler')

module.exports = {
    name: "savefavorite",
    isButton: true,
    run: async (message, client, container) => {
        Reply.defer(message)
        let guildQueue = client.player.getQueue(message.guild.id);
        if (!guildQueue) {
            return Reply.follow(message, {content: `There is no song playing!`, ephemeral: true})
        }
        let userProfile = await User.findOne({ userId: message.member.user.id })
        //Reply.follow(message ,{ content: 'wip', ephemeral: true })


        if (!userProfile) {
            userProfile = await new User({
                _id: mongoose.Types.ObjectId(),
                userId: message.member.user.id,
                userName: message.member.user.tag,
                userIcon: "todo",
                userFavoriteLinks: guildQueue.nowPlaying.url,
                userFavoriteNames: guildQueue.nowPlaying.name,
            })
            await userProfile.save().catch(console.error)
            console.log(userProfile)
            await Reply.follow(message, { content: `Added **${userProfile.userFavoriteNames[0]}** to your favorites!`, ephemeral: true })
        } else {
            userProfile.userFavoriteLinks.unshift(guildQueue.nowPlaying.url)
            userProfile.userFavoriteNames.unshift(guildQueue.nowPlaying.name)

            await userProfile.save().catch(console.error)
            await Reply.follow(message, { content: `Added **${userProfile.userFavoriteNames[0]}** to your favorites!`, ephemeral: true })
            console.log(userProfile)
        }
    }
}

