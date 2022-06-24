module.exports = {
    name: 'invite',
    aliases: [],
    description: 'Invite the bot to your server.',
    run: (message, client, Discord, args, cmd) => {
        if (message.author.id != process.env.OWNER) return message.channel.send(`I don't think this is for you!`)
        message.channel.send(`invite me with: ${(process.env.INVITE)}`)
    }
}