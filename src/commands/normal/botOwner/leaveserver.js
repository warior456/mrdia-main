const Reply = require('../../../structures/handlers/replyHandler');
//todo option
module.exports = {
    name: 'leaveserver',
    aliases: [],
    description: "leaves the provided server",
    category: 'owner',
    ownerOnly: true,
    ignoreSlash: true,
    run: (client, message, args) => {
        if (!args) {
            return Reply.send('please provide a server id')
        }
        try {

            client.guilds.cache.get(args[0]).leave();
            Reply.send(message, `left this server: ${args[0]}`);
        } catch (error) {
            console.log(error)
            Reply.send(message, 'Something went wrong when trying to leave the server')
        }


    }
}