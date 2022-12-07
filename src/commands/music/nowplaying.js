const Reply = require('../../Structures/Handlers/replyHandler')
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')
const config = require('../../../Config');

function refreshnp(message) {
    let guildQueue = client.player.getQueue(message.guild.id)
    let isNewMessage = false
    now_playing(message, guildQueue, isNewMessage)
}

module.exports = {
    name: 'nowplaying',
    aliases: ['np'],
    description: 'show the current playing track',
    category: 'music',
    run: async (message, client, Discord, args, cmd, player) => {
        let guildQueue = client.player.getQueue(message.guild.id);
        if (!message.member.voice.channel && message.member.user.id != config.owner) return Reply.send(message, { content: 'Join a voice channel first!', ephemeral: true })
        let isNewMessage = true
        now_playing(message, guildQueue, isNewMessage);

    }, refreshnp
}


async function now_playing(message, guildQueue, isNewMessage) {
    try {
        if (!guildQueue) {
            return Reply.send(message, `There are no songs playing!`)
        }
        let ProgressBar = ''
        try {
            ProgressBar = guildQueue.createProgressBar();
        } catch (error) {
            ProgressBar = 'Error-No song playing'
        }
        let queueMessage = `**[${guildQueue.nowPlaying.name}](${guildQueue.nowPlaying.url})**\n\`${ProgressBar}| Requested by:\` <@${guildQueue.nowPlaying.requestedBy}>`
        switch (guildQueue.repeatMode) {
            case 0:
                footer = `Loopqueue: ❌ | loop: ❌`
                break;
            case 1:
                footer = `Loopqueue: ❌ | loop: ✅`
                break;
            case 2:
                footer = `Loopqueue: ✅ | loop: ❌`
                break;
        }
        let queEmbed = new MessageEmbed()
            .setTitle('Now playing!')
            .setColor('#a20000')
            .setDescription(queueMessage)
            .setFooter(footer);

        if (isNewMessage) {
            Reply.send(message, { embeds: [queEmbed], components: [addButtons()] });
        } else {
            Reply.edit(message, { embeds: [queEmbed]})
        }
        


    } catch (error) {
        console.log(error);
        Reply.send(message, `Something went wrong try again!`);
    }
}

function addButtons() {
    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('refreshnp')
                .setLabel('Refresh')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('savedm')
                .setLabel('Send in dm')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('savefavorite')
                .setLabel('Add to favorites')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('end')
                .setLabel('end interaction')
                .setStyle('SECONDARY')

        );
    return row
}