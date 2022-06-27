const {show_q} = require('../music/queue')

module.exports = {
    name: "nextpage",
    ownerOnly: true,
    run: async(client, interaction, container) => {
        let guildQueue = client.player.getQueue(interaction.message.guild.id);
        let pages = Math.ceil((guildQueue.songs.length-1)/10)
        if(!guildQueue) return
                guildQueue.data.page++
                if(guildQueue.data.page > pages ) guildQueue.data.page = pages;
                show_q(message, client, Discord, guildQueue)
                interaction.deferUpdate()
                
    }
}