module.exports = {
    name: 'restart',
    aliases: [],
    description: "restarts the bot (or stops when not running in the main system)",
    run: async (message, client, Discord, args, cmd) => {
        if (message.author.id != process.env.OWNER) return message.channel.send(`I don't think this is for you!`)
        await message.channel.send("stopping bot(if in right place ,restarting)")
        process.exit()
    }
}