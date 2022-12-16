const Reply = require("../../../structures/handlers/replyHandler");

module.exports = {
    name: 'invite',
    aliases: [],
    description: 'Invite the bot to your server.',
    category: 'owner',
    ownerOnly: true,
    ignoreSlash: true,
    run: (client, message, args) => {
        Reply.send(message, `invite me with: ${(client.config.invite)}`)
    }
}