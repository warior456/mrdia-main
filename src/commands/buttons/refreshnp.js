const Reply = require('../../Structures/Handlers/replyHandler')
const { refreshnp } = require('../music/nowplaying')

module.exports = {
    name: "refreshnp",
    isButton: true,
    run: async (message, client, container) => {
        message.deferUpdate()
        let guildQueue = client.player.getQueue(message.guild.id);
        if (!guildQueue) return Reply.send(message, "no songs in queue")
        refreshnp(message.message)

    }
}