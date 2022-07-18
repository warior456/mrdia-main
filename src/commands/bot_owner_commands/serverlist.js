const Reply = require('../../Structures/Handlers/replyHandler')
const config = require('../../../Config');

module.exports = {
    name: 'servers',
    aliases: [],
    description: "list's the servers the bot is in",
    category: 'owner',
    run: (message, client, Discord, args, cmd) => {
        
        if (message.member.user.id != config.owner) return Reply.send(message, `I don't think this is for you!`)

        let listMessage = 'serverlist\n=========================================\n'
        client.guilds.cache.forEach(guild => {
            listMessage += (`${guild.name} | ${guild.id}\n`);
        })


        Reply.send(message, listMessage);

    }

}

