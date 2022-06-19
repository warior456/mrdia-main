module.exports = {
    name: 'invite',
    description: 'Invite the bot to your server.',
    run: (message, args, cmd, client, Discord) => {
        if (message.author.id != process.env.OWNER) return message.channel.send(`I don't think this is for you!`)
        message.channel.send(`invite me with: ${(process.env.INVITE)}`)
    }
}