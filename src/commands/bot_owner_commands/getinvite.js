

module.exports = {
    name: 'ginvite',
    aliases: [],
    description: "get's an invite link to all servers the bot is in",
    run: (message, args, cmd, client, Discord) => {
        if (message.author.id != process.env.OWNER) return message.channel.send(`I don't think this is for you!`)


        // let guild = client.guilds.get(args[0]);

        // if (!guild) return message.reply("The bot isn't in the guild with this ID.");

        // let invitechannels = guild.channels.filter(c=> c.permissionsFor(guild.me).has('CREATE_INSTANT_INVITE'))
        // if(!invitechannels) return message.channel.send('No Channels found with permissions to create Invite in!')

        // invitechannels.random().createInvite()
        // .then(invite=> message.channel.send('Found Invite:\n' + invite.code))
        // }
        // client.guilds.cache.forEach(guild => {
        //         const ch = guild.channels.cache.filter(x => x.type != "category" && x.permissionsFor(guild.me).has('CREATE_INSTANT_INVITE'))
        //         ch.random.createInvite()

        //         console.log(ch)




        //     });


    }
}