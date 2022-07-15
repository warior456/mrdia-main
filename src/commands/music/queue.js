const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { timeToSeconds, addLeadingZeros, addTime } = require('../../Utils/utilities');
const Reply = require('../../Structures/Handlers/replyHandler')

const show_q = async (message) => {
    let guildQueue = client.player.getQueue(message.guild.id)
    let isNewMessage = false
    show_queue(message, guildQueue, isNewMessage)
}
//todo error messages need message parameter

module.exports = {
    name: 'queue',
    aliases: ['q'],
    description: 'shows the current queue',
    category: 'music',
    run: async (message, client, Discord, args, cmd) => {
        let isNewMessage = true
        let guildQueue = client.player.getQueue(message.guild.id)
        if (!args[0]) args[0] = 1
        await guildQueue.setData({
            page: args[0]
        });

        if (!message.member.voice.channel && message.author.id != process.env.OWNER) return Reply.send('Join a voice channel first!')
        show_queue(message, guildQueue, isNewMessage);
    }, show_q
}


async function show_queue(message, guildQueue, isNewMessage) {
    try {
        if (!guildQueue) return Reply.send(`There are no songs in the queue`)

        let queueMessage = await makeQueueMessage(guildQueue)
        let field = makeField(guildQueue)
        let footer = makeFooter(guildQueue)
        let embed = await makeEmbed(queueMessage, field, footer)
        send_embed(message, embed, isNewMessage)

    } catch (error) {
        console.log(error);
        Reply.send(`Something went wrong try again!(1)`);
    }
}

function totPages(guildQueue) {
    let pages = Math.ceil((guildQueue.songs.length - 1) / 10)
    if (pages === 0) pages = 1;
    return pages
}

async function makeQueueMessage(guildQueue) {

    // try {
    const ProgressBar = guildQueue.createProgressBar();
    // } catch (error) {
    //     const ProgressBar = 'Error'
    // }
    let req_page = guildQueue.data.page                                                  //prevents getting an error when no page is given
    if (req_page > totPages(guildQueue)) return Reply.send(`There are only ${totPages(guildQueue)} pages`)                       // page cap

    let queueMessage = ''
    try {
        queueMessage = `**Current song:** [${guildQueue.nowPlaying.name}](${guildQueue.nowPlaying.url})\n\`${ProgressBar}| Requested by:\` <@${guildQueue.nowPlaying.requestedBy}> \n==========================================\n`
    } catch (error) {
        queueMessage = '**Current song:** error: no song playing\n==========================================\n'
    }
    
    if(!guildQueue.songs[1])return queueMessage
    for (var i = req_page * 10 - 9; i < guildQueue.songs.length && i <= req_page * 10; i++) { //makes the queueMessage
        queueMessage += `\`${i}.\` [${guildQueue.songs[i].name}](${guildQueue.songs[i].url}) | \`${guildQueue.songs[i].duration} | Requested by:\` <@${guildQueue.songs[i].requestedBy}>\n\n`
    }
    return queueMessage
}

function makeField(guildQueue) {
    let queueLength = '00:00'
    for (let i = 0; i < guildQueue.songs.length; i++) {
        queueLength = addTime(queueLength, guildQueue.songs[i].duration)
    }

    let s = ''
    if (guildQueue.songs.length - 1 > 1 || guildQueue.songs.length - 1 === 0 ) s = 's';
    let field = `**${guildQueue.songs.length - 1} song${s} in queue||${queueLength} Total length**`

    return field
}

function makeFooter(guildQueue) {
    let req_page = guildQueue.data.page
    let footer = `page ${req_page}/${totPages(guildQueue)} `;   //makes the footer
    switch (guildQueue.repeatMode) {
        case 0:
            footer += `| LoopQueue: ❌ | Loop: ❌`
            break;
        case 1:
            footer += `| LoopQueue: ❌ | Loop: ✅`
            break;
        case 2:
            footer += `| LoopQueue: ✅ | Loop: ❌`
            break;
    }
    return footer
}

async function makeEmbed(queueMessage, field, footer) {
    const queEmbed = new MessageEmbed()
        .setTitle('Server Queue')
        .setColor('#a20000')
        .setDescription(queueMessage)
        .addFields(
            { name: field, value: footer },
        );
    return queEmbed
}

function addButtons() {
    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('previouspage')
                .setLabel('previous page')
                .setStyle('PRIMARY'),

            new MessageButton()
                .setCustomId('nextpage')
                .setLabel('next page')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('end')
                .setLabel('end interaction')
                .setStyle('SECONDARY')
        );
    return row
}

async function send_embed(message, queEmbed, isNewMessage) {
    if (isNewMessage) {
        Reply.send(message, { embeds: [queEmbed], components: [addButtons()] })
    } else {
        Reply.edit(message, { embeds: [queEmbed] });
    }
}

