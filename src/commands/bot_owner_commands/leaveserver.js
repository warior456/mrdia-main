const Reply = require('../../Structures/Handlers/replyHandler')

module.exports = {
    name: 'leaveserver',
    aliases: [],
    description: "leaves the provided server",
    category: 'owner',
    run: (message, client, Discord, args, cmd) => {
        if (message.author.id != process.env.OWNER) return Reply.send(`I don't think this is for you!`)
        try {

            client.guilds.cache.get(args[0]).leave();
            Reply.send(`left this server: ${args[0]}`);
        } catch (error) {
            console.log(error)
            Reply.send('Something went wrong when trying to leave the server')
        }


    }
}