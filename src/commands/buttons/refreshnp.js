const Reply = require('../../structures/handlers/replyHandler')


module.exports = {
    name: "refreshnp",
    isButton: true,
    run: async (client, message) => {
        return Reply.send(message, 't')
        await Reply.deferUpdate(message)
        let guildQueue = client.player.getQueue(message.guild.id);
        if (!guildQueue) return Reply.follow(message, { content: 'Error- no songs in queue!', ephemeral: true})

    }
}