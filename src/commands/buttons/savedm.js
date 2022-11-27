const Reply = require('../../Structures/Handlers/replyHandler')
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: "savedm",
    isButton: true,
    run: async (message, client, container) => {
        message.deferUpdate()
        let guildQueue = await client.player.getQueue(message.guild.id);
        if (!guildQueue) return Reply.send(message, "no song playing")
        Reply.dm(message, { embeds: [makeEmbed(guildQueue, message)] })

    }
}

function makeDescription(guildQueue) {
    let description = `[${guildQueue.nowPlaying.name}](${guildQueue.nowPlaying.url})\n\n\`Length:\` ${guildQueue.nowPlaying.duration}\n\n\`Requested by:\` <@${guildQueue.nowPlaying.requestedBy}>`
    return description
}

function makeFooter(guildQueue, message) {
    let footer = `Saved from ${message.guild.name}`
    return footer
}

function makeEmbed(guildQueue, message) {
    const queEmbed = new MessageEmbed()
        .setTitle('Song saved 🎵')
        .setColor('#a20000')
        .setDescription(makeDescription(guildQueue))
        .setFooter(makeFooter(guildQueue, message))
    return queEmbed
} 