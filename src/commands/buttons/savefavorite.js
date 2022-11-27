const Reply = require('../../Structures/Handlers/replyHandler')
const { refreshnp } = require('../music/nowplaying')

module.exports = {
    name: "savefavorite",
    isButton: true,
    run: async (message, client, container) => {
        await message.deferUpdate()
        Reply.follow(message ,{ content: 'wip', ephemeral: true })

    }
}