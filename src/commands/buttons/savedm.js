const Reply = require('../../Structures/Handlers/replyHandler')

module.exports = {
    name: "savedm",
    isButton: true,
    run: async (message, client, container) => {
        message.deferUpdate()
        let guildQueue = client.player.getQueue(message.guild.id);
        if (!guildQueue) return Reply.send(message, "no song playing")
        Reply.dm(message , { embeds: [makeEmbed(makeDescription())] })

    }
}

function makeDescription (guildQueue){
    let description = `[${guildQueue.nowPlaying.name}](${guildQueue.nowPlaying.url})}`
    return description
} 

function makeEmbed (description) {
    const queEmbed = new MessageEmbed()
        .setTitle('Server Queue')
        .setColor('#a20000')
        .setDescription(description)
    return queEmbed
} 