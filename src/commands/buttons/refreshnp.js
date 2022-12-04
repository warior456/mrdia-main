const Reply = require('../../Structures/Handlers/replyHandler')
const { refreshnp } = require('../music/nowplaying')

module.exports = {
    name: "refreshnp",
    isButton: true,
    run: async (message, client, container) => {
        Reply.deferUpdate(message)
        let guildQueue = client.player.getQueue(message.guild.id);
        if (!guildQueue) return Reply.send(message, { content: 'Error- no songs in queue!', ephemeral: true})
        refreshnp(message.message)

    }
}