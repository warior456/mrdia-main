module.exports = {
    name: 'removeduplicates',
    aliases: ['removedupes', 'rd'],
    description: 'Removes duplicate songs from the queue',

    async execute(message, args, cmd, client, Discord) {
        let guildQueue = client.player.getQueue(message.guild.id);
        if(!message.member.voice.channel && message.author.id != process.env.OWNER) return message.channel.send('Join a voice channel first!')
        if(cmd=== 'removeduplicates'||cmd === 'removedupes'|| cmd === 'rd') rdupes(message, args, cmd, client, Discord, guildQueue);
    }
}

const rdupes = async(message, args, cmd, client, Discord, guildQueue)=>{
    try {
        const uniques = []
        guildQueue.songs = guildQueue.songs.filter((song, i) => uniques.includes(song.url) ? false : (uniques.push(song.url), true))
        message.channel.send(`Exact duplicates have been removed`)
    } catch (error) {
        console.log(error)
    }
}