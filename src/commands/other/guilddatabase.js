const mongoose = require('mongoose')
const Guild = require('../../schemas/guild')
const Reply = require('../../Structures/Handlers/replyHandler')

module.exports = {
    name: 'guilddatabase',
    aliases: [],
    description: "guilddatabase test command",
    category: 'other',
    run: async (message, client, Discord, args, cmd) => {
        let guildProfile = await Guild.findOne({ guildId: message.guild.id })
        if (!guildProfile) {
            guildProfile = await new Guild({
                _id: mongoose.Types.ObjectId(),
                guildId: message.guild.id,
                guildName: message.guild.name,
                guildIcon: message.guild.iconURL() ? message.guild.iconURL() : "None."
            })
            await guildProfile.save().catch(console.error)
            await Reply.send(message, {
                content: `Server Name: ${guildProfile.guidName}`
            })
        } else {
            await Reply.send(message, { content: `Server Id: ${guildProfile.guildId}` })
        }
    }
}