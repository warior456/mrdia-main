const Reply = require('../../Structures/Handlers/replyHandler')
const config = require('../../../Config');
//todo option
module.exports = {
    name: 'leaveserver',
    aliases: [],
    description: "leaves the provided server",
    category: 'owner',
    run: (message, client, Discord, args, cmd) => {
        if (message.member.user.id != config.owner) return Reply.send(message, `I don't think this is for you!`)
        try {

            client.guilds.cache.get(args[0]).leave();
            Reply.send(message, `left this server: ${args[0]}`);
        } catch (error) {
            console.log(error)
            Reply.send(message, 'Something went wrong when trying to leave the server')
        }


    }
}