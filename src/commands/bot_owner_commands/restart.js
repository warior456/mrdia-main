const Reply = require('../../Structures/Handlers/replyHandler')
const config = require('../../../Config');

module.exports = {
    name: 'restart',
    aliases: [],
    description: "restarts the bot (or stops when not running in the main system)",
    category: 'owner',
    run: async (message, client, Discord, args, cmd) => {
        console.log(message.member.user.id)
        console.log(config.owner)
        if (message.member.user.id != config.owner) return Reply.send(message, `I don't think this is for you!`)
        await Reply.send(message, "stopping bot(if in right place, restarting)")
        process.exit()
    }
}