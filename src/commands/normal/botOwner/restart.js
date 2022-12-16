const Reply = require('../../../structures/handlers/replyHandler');

module.exports = {
    name: 'restart',
    aliases: [],
    description: "restarts the bot (or stops when not running in the main system)",
    category: 'owner',
    ownerOnly: true,
    ignoreSlash: true,
    run: (client, message, args) => {
        Reply.send(message, "stopping bot(if in right place, restarting)")
        exitprocess()
        
    }
}
function exitprocess(){
    process.exit()
}