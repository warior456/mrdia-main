const Reply = require('../../Structures/Handlers/replyHandler')
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: "savedm",
    isButton: true,
    run: async (message, client, container) => {
        let guildQueue = await client.player.getQueue(message.guild.id);
        await Reply.deferReply(message, true)
        if (!guildQueue) return Reply.editReply(message ,{ content: 'No song playing!', ephemeral: true })
        await Reply.dm(message, { embeds: [makeEmbed(guildQueue, message)] })
        Reply.editReply(message ,{ content: `I sent you the song, check your dm's`, ephemeral: true })
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
        .setFooter({text: makeFooter(guildQueue, message)})
    return queEmbed
} 