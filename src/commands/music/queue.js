const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js'); 
const {timeToSeconds, addLeadingZeros, addTime } = require('../../utilities');

const show_q = async (message, client, Discord, guildQueue)=>{
    let newMessage = 'false'
    show_queue(message, client, Discord, guildQueue, newMessage)
}


module.exports = {
    name: 'queue',
    aliases: ['q'],
    description: 'shows the current queue',
    async execute(message, args, cmd, client, Discord){
        let guildQueue = client.player.getQueue(message.guild.id)
        if(!args[0]) args[0] = 1
        await guildQueue.setData({
            page: args[0]
        });
        let newMessage = 'true'
        if(!message.member.voice.channel && message.author.id != process.env.OWNER) return message.channel.send('Join a voice channel first!')
        show_queue(message, client, Discord, guildQueue, newMessage);
    }, show_q
}



const show_queue = async (message, client, Discord, guildQueue, newMessage)=>{
    try {
        if (!guildQueue) return message.channel.send(`There are no songs in the queue`)

        let pages = Math.ceil((guildQueue.songs.length-1)/10)
        if(pages == '0') pages = 1;
        
        const ProgressBar = guildQueue.createProgressBar();

        
            let queuelength = '00:00'
        for (let i = 0; i < guildQueue.songs.length; i++) {

            queuelength = addTime(queuelength ,guildQueue.songs[i].duration)

            
        }
        
        
        let queueMessage = ''
        try {
            queueMessage = `**Current song:** [${guildQueue.nowPlaying.name}](${guildQueue.nowPlaying.url})\n\`${ProgressBar}| Requested by:\` <@${guildQueue.nowPlaying.requestedBy}>\n==========================================\n`
        } catch (error) {
            queueMessage = '**Current song:** error: no song playing'
        }
        

        let req_page = guildQueue.data.page                                                  //prevents getting an error when no page is given
        if(req_page > pages )return message.channel.send(`There are only ${pages} pages`)                       // page cap

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

        for (var i = req_page*10-9; i < guildQueue.songs.length && i <= req_page*10; i++) { //makes the queueMessage
            queueMessage += `\`${i}.\` [${guildQueue.songs[i].name}](${guildQueue.songs[i].url}) | \`${guildQueue.songs[i].duration} | Requested by:\` <@${guildQueue.songs[i].requestedBy}>\n\n`
        }

        let s = ''          //makes the field
        if(guildQueue.songs.length > 1) s = 's';
        let field = `**${guildQueue.songs.length-1} song${s} in queue||${queuelength} lotal length**`
        send_embed(message, client, Discord, guildQueue, queueMessage, footer, newMessage, field)
        
    } catch (error) {
        console.log(error);
        message.channel.send(`Something went wrong try again!(1)`);
    }
}

const send_embed = async (message, client, Discord, guildQueue, queueMessage, footer, newMessage,field)=>{
    try {
        
        const queEmbed = new MessageEmbed()
            .setTitle('Server Queue')
            .setColor('#a20000')
            .setDescription(queueMessage)
            .addFields(
                { name: field, value: footer},
            );

        const row = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setCustomId('back')
				.setLabel('previous page')
				.setStyle('PRIMARY'),
			
            new MessageButton()
                .setCustomId('next')
                .setLabel('next page')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('end')
                .setLabel('end interaction')
                .setStyle('SECONDARY')
        );
        
        if (newMessage == 'true')message = await message.channel.send({ embeds: [queEmbed], components: [row] });
        else if(newMessage == 'false')message.edit({ embeds: [queEmbed], components: [row] });
        
            
    } catch (error) {
        console.log(error);
        message.channel.send(`Something went wrong try again(2)!`);
    }
}

