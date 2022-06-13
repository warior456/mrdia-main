module.exports = {
    name: 'playlist',
    aliases: ['pl'],
    description: 'Add a YouTube or Spotify playlist to the queue',

    async execute(message, args, cmd, client, Discord) {
        
        let guildQueue = client.player.getQueue(message.guild.id);
        if(!message.member.voice.channel && message.author.id != process.env.OWNER) return message.channel.send('Join a voice channel first!')

        if(cmd === 'pl'||cmd === 'playlist') playlist(message, args, cmd, client, Discord, guildQueue);
    }
}


const playlist = async (message, args, cmd, client, Discord, guildQueue)=>{
    try {
        let queue = client.player.createQueue(message.guild.id);
        await queue.join(message.member.voice.channel);
        let song = await queue.playlist(args.join(' '), {
                requestedBy: message.author.id,
                data: {
                    skipVotes: []
                }
        });
        if(song === 'undefined'){
            queue.stop();
            return message.channel.send('Something went wrong!');
        }
        message.channel.send(`**[${song}]** has been added to the queue`)
    } catch (error) {
        console.log(error);
        message.channel.send(`something went wrong when trying to add the queue!`);
    }
}