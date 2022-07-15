const Reply = require('../../Structures/Handlers/replyHandler')

module.exports = {
    name: 'restart',
    aliases: [],
    description: "restarts the bot (or stops when not running in the main system)",
    category: 'owner',
    run: async (message, client, Discord, args, cmd) => {
        if (message.author.id != process.env.OWNER) return Reply.send(`I don't think this is for you!`)
        await Reply.send("stopping bot(if in right place ,restarting)")
        process.exit()
    }
}