const Reply = require('../../Structures/Handlers/replyHandler')
const config = require('../../../Config');
//todo perms
module.exports = {
    name: 'invite',
    aliases: [],
    description: 'Invite the bot to your server.',
    category: 'owner',
    run: (message, client, Discord, args, cmd) => {
        if (message.member.user.id != config.owner) return Reply.send(message, `I don't think this is for you!`)
        Reply.send(message, `invite me with: ${(config.invite)}`)
    }
}