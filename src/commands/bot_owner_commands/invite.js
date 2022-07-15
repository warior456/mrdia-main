const Reply = require('../../Structures/Handlers/replyHandler')

module.exports = {
    name: 'invite',
    aliases: [],
    description: 'Invite the bot to your server.',
    category: 'owner',
    run: (message, client, Discord, args, cmd) => {
        if (message.author.id != process.env.OWNER) return Reply.send(message, `I don't think this is for you!`)
        Reply.send(message, `invite me with: ${(process.env.INVITE)}`)
    }
}