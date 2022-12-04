const mongoose = require('mongoose')
const User = require('../../schemas/user')
const Reply = require('../../Structures/Handlers/replyHandler')
const { MessageEmbed } = require('discord.js');


module.exports = {
    name: 'favorites',
    aliases: [],
    description: 'Shows you the list of your favorites',
    category: 'music',
    run: async (message, client, Discord, args, cmd) => {
        await Reply.deferReply(message, false)
        let userProfile = await User.findOne({ userId: message.member.user.id })
        if (!userProfile.userFavoriteLinks[0]) {
            return Reply.editReply(message, { content: `You don't have any favorites!`, ephemeral: false })
        } else {
            const favEmbed = makeEmbed(message, makeDescription(userProfile))
            Reply.editReply(message, { embeds: [favEmbed], ephemeral: false })
        }
    }
}

function makeEmbed(message, description) {
    const favEmbed = new MessageEmbed()
        .setTitle(`${message.member.user.username}'s Favorites`)
        .setColor('#57ff92')
        .setDescription(description)
    return favEmbed
}

function makeDescription(userProfile) {
    let description = ''

    for (let index = 0; index < userProfile.userFavoriteLinks.length; index++) { //makes the queueMessage
        description += `\`${index + 1}.\` [${userProfile.userFavoriteNames[index]}](${userProfile.userFavoriteLinks[index]})\n\n`
    }
    return description
}