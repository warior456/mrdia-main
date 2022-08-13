
const { show_q } = require('../music/queue')

module.exports = {
    name: "nextpage",
    isButton: true,
    run: async (message, client, container) => {
        let guildQueue = client.player.getQueue(message.guild.id);
        let pages = Math.ceil((guildQueue.songs.length - 1) / 10)
        if (!guildQueue) return
        guildQueue.data.page++
        if (guildQueue.data.page > pages) guildQueue.data.page = pages;
        show_q(message.message)
        message.deferUpdate()
    }
}