const mongoose = require('mongoose')
const User = require('../../schemas/user')
const Reply = require('../../Structures/Handlers/replyHandler')
//possible to move this to functions for adding /command and command for this
module.exports = {
    name: "savefavorite",
    isButton: true,
    run: async (message, client, container) => {
        await Reply.defer(message, true)
        let guildQueue = client.player.getQueue(message.guild.id);
        if (!guildQueue) {
            return Reply.editReply(message, { content: `There is no song playing!`, ephemeral: true })
        }
        let userProfile = await User.findOne({ userId: message.member.user.id })
        if (!userProfile) {
            userProfile = await createUser(message, guildQueue)
        }
        prepareFavorite(message, userProfile, guildQueue)
    }
}

async function prepareFavorite(message, userProfile, guildQueue) {
    if (!userProfile.userFavoriteLinks.includes(guildQueue.nowPlaying.url)) {
        userProfile.userFavoriteLinks.unshift(guildQueue.nowPlaying.url)
        userProfile.userFavoriteNames.unshift(guildQueue.nowPlaying.name)
        saveFavorite(message, userProfile)
    } else {
        Reply.editReply(message, { content: `**${userProfile.userFavoriteNames[0]}** is already a favorite!`, ephemeral: true })
    }
}

async function createUser(message, guildQueue) {
    userProfile = await new User({
        _id: mongoose.Types.ObjectId(),
        userId: message.member.user.id,
        userName: message.member.user.tag,
        userIcon: "todo",
    })
    return userProfile
}

async function saveFavorite(message, userProfile) {
    await userProfile.save().catch(console.error)
    await Reply.editReply(message, { content: `Added **${userProfile.userFavoriteNames[0]}** to your favorites!`, ephemeral: true })
}