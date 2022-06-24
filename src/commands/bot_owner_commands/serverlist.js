
module.exports = {
    name: 'servers',
    aliases: [],
    description: "list's the servers the bot is in",
    run: (message, client, Discord, args, cmd) => {
        if (message.author.id != process.env.OWNER) return message.channel.send(`I don't think this is for you!`)

        let listMessage = 'serverlist\n=========================================\n'
        client.guilds.cache.forEach(guild => {
            listMessage += (`${guild.name} | ${guild.id}\n`);
        })


        message.channel.send(listMessage);

    }

}

