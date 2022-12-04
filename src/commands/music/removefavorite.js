const mongoose = require('mongoose')
const User = require('../../schemas/user')
const Reply = require('../../Structures/Handlers/replyHandler')
const { isNatural } = require('../../Utils/utilities')


module.exports = {
    name: 'removefavorite',
    aliases: ['delfavorite'],
    description: 'removes a song from your favorites',
    options: [{
        name: "song",
        type: "STRING",
        description: "Give the index of the song from your favorites list", //the song url or
        required: true
    }],
    category: 'music',
    run: async (message, client, Discord, args, cmd) => {
        await Reply.deferReply(message, true)
        let userProfile = await User.findOne({ userId: message.member.user.id })
        if (!userProfile.userFavoriteLinks[0]) {
            return Reply.editReply(message, { content: `You don't have any favorites!`, ephemeral: true })
        } else {
            const removed = await removeFavorite(args, userProfile)
            return Reply.editReply(message, { content: `Removed **${removed}** `, ephemeral: true })
        }

    }
}

async function removeFavorite(args, userProfile) {
    if (isNatural(args[0]) && userProfile.userFavoriteLinks.length >= args[0] && args[0] > 0){
        return await removeValue(userProfile, args[0] - 1)
    } else{
        return 'nothing, please provide a valid input!'
    }

    // const index = userProfile.userFavoriteLinks.indexOf(args[0])
    // return await removeValue(userProfile, index)
}

async function removeValue(userProfile, index) {
    await userProfile.userFavoriteLinks.splice(index, 1)
    const removed = await userProfile.userFavoriteNames.splice(index, 1)
    await userProfile.save().catch(console.error)
    return removed
}



