
const Reply = require('../../Structures/Handlers/replyHandler');
const { show_q } = require('../music/queue')

module.exports = {
    name: "nextpage",
    isButton: true,
    run: async (message, client, container) => {
        Reply.deferUpdate(message)
        let guildQueue = client.player.getQueue(message.guild.id);
        if (!guildQueue) return
        let pages = Math.ceil((guildQueue.songs.length - 1) / 10)
        guildQueue.data.page++
        if (guildQueue.data.page > pages) guildQueue.data.page = pages;
        if (guildQueue.data.page <= 0) guildQueue.data.page = 1
        show_q(message.message)
    }
}