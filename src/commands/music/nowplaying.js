const {MessageEmbed} = require('discord.js')
module.exports = {
    name:'nowplaying',
    aliases: ['np'],
    description: 'show the current playing track',
    async execute (message, args, cmd, client, Discord, player){
        let guildQueue = client.player.getQueue(message.guild.id);
        if(!message.member.voice.channel && message.author.id != process.env.OWNER) return message.channel.send('Join a voice channel first!')

        now_playing(message, args, cmd, client, Discord, guildQueue);

    }
}


const now_playing = async (message, args, cmd, client, Discord, guildQueue)=>{
    try {
        if (!guildQueue) {
            return message.channel.send(`There are no songs playing!`)
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

        message.channel.send({ embeds: [queEmbed] });
        
        
    } catch (error) {
        console.log(error);
        message.channel.send(`Something went wrong try again!`);
    }
}