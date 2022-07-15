const Reply = require('../../Structures/Handlers/replyHandler')
const { MessageEmbed } = require('discord.js')
module.exports = {
    name: 'nowplaying',
    aliases: ['np'],
    description: 'show the current playing track',
    category: 'music',
    run: async (message, client, Discord, args, cmd, player) => {
        let guildQueue = client.player.getQueue(message.guild.id);
        if (!message.member.voice.channel && message.author.id != process.env.OWNER) return Reply.send(message, 'Join a voice channel first!')

        now_playing(message, client, Discord, args, cmd, guildQueue);

    }
}


async function now_playing(message, client, Discord, args, cmd, guildQueue) {
    try {
        if (!guildQueue) {
            return Reply.send(message, `There are no songs playing!`)
        }
        const ProgressBar = guildQueue.createProgressBar();
        let queueMessage = `**Current song:** [${guildQueue.nowPlaying.name}](${guildQueue.nowPlaying.url})\n\`${ProgressBar}| Requested by:\` <@${guildQueue.nowPlaying.requestedBy}>`
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

        Reply.send(message, { embeds: [queEmbed] });


    } catch (error) {
        console.log(error);
        Reply.send(message, `Something went wrong try again!`);
    }
}