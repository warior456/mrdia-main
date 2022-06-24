module.exports = {
    name: 'leaveserver',
    aliases: [],
    description: "leaves the provided server",
    run: (message, client, Discord, args, cmd) => {
        if (message.author.id != process.env.OWNER) return message.channel.send(`I don't think this is for you!`)
        try {

            client.guilds.cache.get(args[0]).leave();
            message.channel.send(`left this server: ${args[0]}`);
        } catch (error) {
            console.log(error)
            message.channel.send('Something went wrong when trying to leave the server')
        }


    }
}