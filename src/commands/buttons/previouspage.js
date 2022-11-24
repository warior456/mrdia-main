
const { show_q } = require('../music/queue')

module.exports = {
    name: "previouspage",
    isButton: true,
    run: async (message, client, container) => {
        message.deferUpdate()
        let guildQueue = client.player.getQueue(message.guild.id);
        let pages = Math.ceil((guildQueue.songs.length - 1) / 10)
        if (!guildQueue) return
        guildQueue.data.page--
        if (guildQueue.data.page <= 0) guildQueue.data.page = 1;
        show_q(message.message)
    }
}