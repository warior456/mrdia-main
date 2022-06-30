const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { timeToSeconds, addLeadingZeros, addTime } = require('../../Utils/utilities');
Reply = require('../../Structures/Handlers/replyHandler')

const show_q = async (message) => {
    let guildQueue = client.player.getQueue(message.guild.id)
    let newMessage = false
    show_queue(message, guildQueue, newMessage)
}


module.exports = {
    name: 'queue',
    aliases: ['q'],
    description: 'shows the current queue',
    category: 'music',
    run: async (message, client, Discord, args, cmd) => {
        let guildQueue = client.player.getQueue(message.guild.id)
        if (!args[0]) args[0] = 1
        await guildQueue.setData({
            page: args[0]
        });
        let newMessage = true
        if (!message.member.voice.channel && message.author.id != process.env.OWNER) return message.channel.send('Join a voice channel first!')
        show_queue(message, guildQueue, newMessage);
    }, show_q
}


async function show_queue(message, guildQueue, newMessage) {
    try {
        if (!guildQueue) return message.channel.send(`There are no songs in the queue`)


        let footer = makeFooter()
        let queueMessage = makeQueueMessage()
        let field = makeField()

        send_embed(message, queueMessage, footer, newMessage, field)

    } catch (error) {
        console.log(error);
        message.channel.send(`Something went wrong try again!(1)`);
    }
}

function makeField() {
    let queueLength = '00:00'
    for (let i = 0; i < guildQueue.songs.length; i++) {
        queueLength = addTime(queueLength, guildQueue.songs[i].duration)
    }

    let s = ''
    if (guildQueue.songs.length > 1) s = 's';
    let field = `**${guildQueue.songs.length - 1} song${s} in queue||${queueLength} Total length**`
    
    return field
}

function makeFooter() {
    let pages = Math.ceil((guildQueue.songs.length - 1) / 10)
    if (pages === 0) pages = 1;

    let footer = `page ${req_page}/${pages} `;   //makes the footer
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

async function makeQueueMessage(guildQueue) {
    const ProgressBar = guildQueue.createProgressBar();

    let req_page = guildQueue.data.page                                                  //prevents getting an error when no page is given
    if (req_page > pages) return message.channel.send(`There are only ${pages} pages`)                       // page cap

    let queueMessage = ''
    try {
        queueMessage = `**Current song:** [${guildQueue.nowPlaying.name}](${guildQueue.nowPlaying.url})\n\`${ProgressBar}| Requested by:\` <@${guildQueue.nowPlaying.requestedBy}> \n==========================================\n`
    } catch (error) {
        queueMessage = '**Current song:** error: no song playing'
    }

    for (var i = req_page * 10 - 9; i < guildQueue.songs.length && i <= req_page * 10; i++) { //makes the queueMessage
        queueMessage += `\`${i}.\` [${guildQueue.songs[i].name}](${guildQueue.songs[i].url}) | \`${guildQueue.songs[i].duration} | Requested by:\` <@${guildQueue.songs[i].requestedBy}>\n\n`
    }
    return queueMessage
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

async function send_embed(message, queEmbed) {
    try {
        console.log(2)
        if (newMessage) {
            console.log(3)
            Reply.send(message, { embeds: [queEmbed], components: [addButtons()] })
        } else {
            console.log(4)
            Reply.edit(message, { content: [queEmbed] });
        }
    } catch (error) {
        console.log(error);
        message.channel.send(`Something went wrong try again(2)!`);
    }
}

